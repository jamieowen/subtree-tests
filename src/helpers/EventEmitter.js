const EventEmitter = {};

EventEmitter.subscribe = function (
  name,
  callback,
  order = -1,
  invokeValue = undefined
) {
  this.on(name, callback, order);
  // invole immediately if have callback value
  if (invokeValue !== undefined) {
    callback(invokeValue);
  }
  return () => {
    // console.log('unsubscribe', name)
    this.off(name, callback);
  };
};
EventEmitter.subscription = EventEmitter.subscribe;

EventEmitter.on = function (name, callback, order = -1) {
  if (typeof callback !== 'function') {
    return;
  }
  this._emitCallbacks = this._emitCallbacks || {};
  this._emitCallbacks[name] = this._emitCallbacks[name] || [];

  callback._callback_order = order === -1 ? 1000000 : order;
  this._emitCallbacks[name].push(callback);
  // only sort if not using default order (default order is last in queue)
  if (order > -1) {
    this._emitCallbacks[name].sort((a, b) => {
      return a._callback_order - b._callback_order;
    });
  }
};

// obj.off() - remove all listeners
// obj.off([name]) - remove all listeners from eventType:[name]
// obj.off([name], [callback]) - remove  [callback] from eventType:[name]
EventEmitter.off = function (name, callback) {
  if (!this._emitCallbacks) {
    return;
  }

  if (!name && !callback) {
    this._emitCallbacks = null;
  }

  if (name && !callback) {
    this._emitCallbacks[name] = null;
  }

  if (name && callback && this._emitCallbacks[name]) {
    const i = this._emitCallbacks[name].indexOf(callback);
    if (i > -1) {
      this._emitCallbacks[name].splice(i, 1);
    }
  }
};

EventEmitter.emit = function (name, evt) {
  if (!(this._emitCallbacks && this._emitCallbacks[name])) {
    return;
  }
  for (const callback of this._emitCallbacks[name]) {
    callback(evt);
  }
};

EventEmitter.set = function (propKey, val, eventKey = null) {
  this.setEmit(propKey, val, eventKey);
};

EventEmitter.setEmit = function (key, val, eventKey = null) {
  if (this[key] !== val) {
    this[key] = val;
    eventKey = eventKey || key;
    this.emit(eventKey, val);
  }
};

EventEmitter.removeEventListener = EventEmitter.off;
EventEmitter.addEventListener = EventEmitter.on;
EventEmitter.trigger = EventEmitter.emit;

export { EventEmitter };
export default EventEmitter;
