// @types/node would edit the root lockfile, which sits outside this package.
declare global {
  const process: { readonly argv: readonly string[]; exitCode?: number };
  const console: {
    log(...data: unknown[]): void;
    error(...data: unknown[]): void;
  };
}

export {};
