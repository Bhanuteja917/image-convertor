// libheif-js ships no type declarations for its browser wasm-bundle entry
// point. Its CJS module.exports is an already-invoked Emscripten factory
// Promise, which ESM interop surfaces as the default export.
declare module "libheif-js/wasm-bundle" {
  const heifModulePromise: Promise<unknown>;
  export default heifModulePromise;
}
