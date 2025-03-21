const EventObserver = {};

// listens to 'on' , '$on' or 'addEventListener' events,
// remembers those event references -clean up with unlisten()

// 'addEventListener' options: see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
EventObserver.listen = function (emitter, eventKey, callback, options) {
  this._emitters = this._emitters || new Map();
  if (!this._emitters.has(emitter)) {
    this._emitters.set(emitter, new Set());
  }

  let existing = false;
  this._emitters.get(emitter).forEach((obj) => {
    if (obj.eventKey === eventKey && obj.callback === callback) {
      existing = true;
    }
  });

  if (!existing) {
    _removeObservedEvent(emitter, eventKey, callback);
    _addObservedEvent(emitter, eventKey, callback, options);
    this._emitters.get(emitter).add({ eventKey, callback });
  }
};

// to remove all - unlisten();
// to remove all attached to emitter - unlisten(emitter);

// to remove only specific callbacks attached to eventKey unlisten(emitter, eventKey:String)
// to remove only specific callbacks attached to each eventKey in eventKeys unlisten(emitter, eventKeys:Array)

// to remove only specific callback unlisten(emitter, eventKey, callback)
EventObserver.unlisten = function (emitter, eventKey, callback) {
  if (!this._emitters) {
    return;
  }

  // remove all
  if (!emitter) {
    this._emitters.forEach((v, k) => {
      v.forEach((o) => {
        _removeObservedEvent(k, o.eventKey, o.callback);
      });
    });
    this._emitters.clear();

    // remove single specific listener
  } else if (emitter && eventKey && callback) {
    const m = this._emitters.get(emitter);
    if (m) {
      m.forEach((o) => {
        if (o.eventKey === eventKey && o.callback === callback) {
          _removeObservedEvent(emitter, o.eventKey, o.callback);
          m.delete(o);
        }
      });
    }

    // remove any attached to a specific emitter for each eventEventKey in eventKeys:Array
  } else if (emitter && eventKey && Array.isArray(eventKey)) {
    const m = this._emitters.get(emitter);
    const eventKeys = eventKey;
    if (m) {
      m.forEach((o) => {
        if (eventKeys.includes(o.eventKey)) {
          _removeObservedEvent(emitter, o.eventKey, o.callback);
          m.delete(o);
        }
      });
    }

    // remove any attached to a specific emitter + eventKey
  } else if (emitter && eventKey) {
    const m = this._emitters.get(emitter);
    if (m) {
      m.forEach((o) => {
        if (o.eventKey === eventKey) {
          _removeObservedEvent(emitter, o.eventKey, o.callback);
          m.delete(o);
        }
      });
    }

    // remove any listeners attached to specific emitter
  } else if (emitter) {
    const m = this._emitters.get(emitter);
    if (m) {
      m.forEach((o) => {
        _removeObservedEvent(emitter, o.eventKey, o.callback);
        m.delete(o);
      });
      this._emitters.delete(emitter);
    }
  }
};

/* ---UTIL------------------------------------------------------------------------- */

const _isfunc = function (func) {
  return typeof func === 'function';
};

const _addObservedEvent = function (emitter, eventKey, callback, options) {
  const on = _isfunc(emitter.on) ? 'on' : null;
  const $on = _isfunc(emitter.$on) ? '$on' : null;
  const addEventListener = _isfunc(emitter.addEventListener)
    ? 'addEventListener'
    : null;
  emitter[on || $on || addEventListener](eventKey, callback, options);
};

const _removeObservedEvent = function (emitter, eventKey, callback) {
  const off = _isfunc(emitter.off) ? 'off' : null;
  const $off = _isfunc(emitter.$off) ? '$off' : null;
  const removeEventListener = _isfunc(emitter.addEventListener)
    ? 'removeEventListener'
    : null;
  emitter[off || $off || removeEventListener](eventKey, callback);
};

/* ---UTIL------------------------------------------------------------------------- */

export { EventObserver };
export default EventObserver;
