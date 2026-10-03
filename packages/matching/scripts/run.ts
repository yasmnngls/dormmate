import { type BatchInput, match } from "../src/index.ts";
import { randomInput } from "../test/fixtures/random.ts";

const USAGE = "usage: run.ts <fixture-name> | run.ts --random <n> --seed <s>";

async function readInput(args: readonly string[]): Promise<BatchInput> {
  if (args[0] === "--random") {
    const n = Number(args[1]);
    const seed = args[2] === "--seed" ? Number(args[3]) : Number.NaN;
    if (!Number.isInteger(n) || n < 0 || !Number.isInteger(seed)) {
      throw new Error(USAGE);
    }
    return randomInput(n, seed);
  }
  const name = args[0];
  if (name === undefined || !/^[a-z0-9-]+$/.test(name)) throw new Error(USAGE);
  const fixture: { input?: BatchInput } = await import(
    `../test/fixtures/${name}.ts`
  );
  if (fixture.input === undefined) {
    throw new Error(`fixture ${name} exports no input`);
  }
  return fixture.input;
}

try {
  const input = await readInput(process.argv.slice(2));
  console.log(JSON.stringify(match(input), null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
