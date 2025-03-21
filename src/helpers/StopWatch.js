import Raf from '@/helpers/Raf';
import EventEmitter from '@/helpers/EventEmitter';

const Events = {
  TICK: 'stopwatch.tick',
};

class StopWatch {
  constructor() {
    Object.assign(this, EventEmitter);
    this.Events = Events;
    this.reset();
  }

  start = () => {
    this._isRunning = true;
    Raf.remove(this._update);
    Raf.add(this._update);
  };

  stop = () => {
    this._timePausedStart = this._timeElapsed;
    this._isPaused = true;
    Raf.remove(this._update);
  };

  destroy = () => {
    this.reset();
  };

  reset = () => {
    this._time = 0;

    this._timeStart = null;
    this._timeElapsed = 0;

    this._timePausedStart = null;
    this._timePausedElapsed = 0;

    this._isRunning = false;
    this._isPaused = false;

    this._timeouts = [];

    Raf.remove(this._update);
  };

  _update = (timestamp) => {
    if (!this._timeStart) {
      this._timeStart = timestamp;
    }
    this._timeElapsed = timestamp - this._timeStart;

    if (this._isPaused) {
      this._timePausedElapsed += this._timeElapsed - this._timePausedStart;
      this._isPaused = false;
    }

    this._time = this._timeElapsed - this._timePausedElapsed;

    this._checkTimeouts();

    this.emit(Events.TICK, this.time);
  };

  // _onVisibilityChange = evt => {
  //   if (document['hidden']) {
  //     this._wasRunning = this._isRunning
  //     this.stop()
  //   } else {
  //     if (this._wasRunning) this.start()
  //   }
  // }

  _checkTimeouts = () => {
    this._timeouts.forEach((timeout, idx) => {
      if (timeout.cb !== null) {
        if (this.time >= timeout.triggerTime) {
          timeout.cb();
          timeout.cb = null;
        }
      }

      if (timeout.cb === null) {
        this._timeouts.splice(this._timeouts.indexOf(timeout), 1);
      }
    });
  };

  addTimeout = (cb, time = 0) => {
    const timer = {
      triggerTime: this.time + time,
      cb,
    };
    this._timeouts.push(timer);
    return timer;
  };

  removeTimeout = (timer) => {
    timer.cb = null;
  };

  get time() {
    return this._time;
  }
}

StopWatch.Events = Events;
export default StopWatch;
