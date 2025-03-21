export const PromiseTimeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
