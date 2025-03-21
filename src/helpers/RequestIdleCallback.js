const Queue = [];
let batchStart = 0;

let requestIdleCallback;

const doBatch = (cb) => {
  const task = Queue.shift();
  task(() => {
    if (performance.now() > batchStart + 15) {
      cb();
    } else {
      task(cb);
    }
  });
};

const update = () => {
  batchStart = performance.now();
  if (Queue.length) {
    doBatch();
  }
  requestAnimationFrame(update);
};

const requestIdleCallbackFill = (cb) => {
  Queue.push(cb);
  requestAnimationFrame(update);
};

if (typeof window === 'undefined' || !window.requestIdleCallback) {
  requestIdleCallback = requestIdleCallbackFill;
} else {
  requestIdleCallback = window.requestIdleCallback;
}

export default requestIdleCallback;
