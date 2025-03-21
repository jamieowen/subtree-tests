import { createContext, useContext } from 'react';
import mitt from 'mitt';
import { getUrlString } from '@/helpers/UrlParam';

const emitter = mitt();
const calledQueue = new Map();

const debug = getUrlString('debugEvents');

export function setupEmitter(debugEvents = false) {
  if (debug) emitter.on('*', (type, e) => console.log(type, e));

  emitter.on('*', (type, ev) => {
    calledQueue.set(type, ev);
  });

  return emitter;
}

export function addHandler(type, handler, callUnregisteredHandler = false) {
  emitter.on(type, handler);

  if (callUnregisteredHandler && calledQueue.has(type)) {
    console.warn('CALLING UNREGISTERED HANDLER FOR EVENT:', type);
    // calledQueue.delete(type);
    handler();
  }
}

export function removeHandler(type, handler) {
  emitter.off(type, handler);
  calledQueue.delete(type);
}

export const MittContext = createContext();

export const MittProvider = ({ children }) => {
  return (
    <MittContext.Provider value={emitter}>{children}</MittContext.Provider>
  );
};

export const useMitt = () => useContext(MittContext);
