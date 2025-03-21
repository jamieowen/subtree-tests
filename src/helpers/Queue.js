import EventEmitter from './EventEmitter';

const Events = {
  EMPTY: 'empty',
};

class Queue {
  constructor(concurrency) {
    Object.assign(this, EventEmitter);

    this.concurrency = concurrency || Infinity;
    this.pending = 0;
    this.queue = [];
  }

  add(fn) {
    this.queue.push(fn);
    this.next();
  }

  next = () => {
    if (this.pending >= this.concurrency) {
      return;
    }

    const fn = this.queue.shift();
    if (!fn) {
      this.emit(Events.EMPTY);
      return;
    }

    this.pending++;
    fn().then(() => {
      this.pending--;
      this.next();
    });
  };
}

Queue.Events = Events;

export default Queue;

// *****************************************
// EXAMPLE
// *****************************************

// let q = new Queue(2)
// for (let i = 0; i < 100; i++) {
//   q.add(() => {
//     return new Promise(resolve => {
//       console.log('hi')
//       setTimeout(() => {
//         resolve()
//       }, 500)
//     })
//   })
// }
