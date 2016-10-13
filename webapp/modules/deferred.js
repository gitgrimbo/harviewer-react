export default function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((...args) => {
    [resolve, reject] = args;
  });
  return {
    resolve,
    reject,
    promise,
  };
};
