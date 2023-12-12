// TinyGo does not work well with strings (throws a `syscall/js.finalizeRef` error). In ImageWand case
// these could be replaced with integers (enum). There are hacks around the string usage, but it still leads
// to memory leaks https://github.com/tinygo-org/tinygo/issues/1140
export const formatGoNumber = {
  jpg: 1,
  png: 2,
  gif: 3
};

export const formatToNumber = (input) => formatGoNumber[input];


export const imageWand = async () => {
  await import("../wasm_exec.js");

  const go = new window.Go();
  const result = await WebAssembly.instantiateStreaming(
    fetch("../main.wasm"),
    go.importObject
  );
  const inst = result.instance;
  go.run(inst); // fire and forget
  // uses the global `wand`
  return Promise.resolve(wand);
};
