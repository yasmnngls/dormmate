import { registerHooks } from "node:module";

// Node strips types but resolves only exact paths. The package imports
// without extensions so apps/web can compile its source.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (
        error?.code !== "ERR_MODULE_NOT_FOUND" ||
        !specifier.startsWith(".")
      ) {
        throw error;
      }
      return nextResolve(`${specifier}.ts`, context);
    }
  },
});
