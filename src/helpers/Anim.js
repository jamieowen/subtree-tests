import Vue from 'vue';
import Typed from './Typed';

export const nextTick = function () {
  return new Promise((resolve) => {
    Vue.nextTick(resolve);
  });
};

export const delay = function (time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const delayedCall = function (fn, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, time);
  });
};

export const invertOpacity = function (el, time) {
  return new Promise((resolve) => {
    if (el) {
      el.style.opacity = 1 - parseInt(el.style.opacity || 0);
    }
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export const revealLine = function (el, line, speed = 15, delay = 100) {
  return new Promise((resolve) => {
    function done() {
      setTimeout(() => {
        resolve();
      }, delay);
    }

    if (line.length <= 0) {
      if (el) {
        el.innerHTML = '&nbsp;';
      }
      done();
    } else {
      if (!el) {
        return done();
      }
      new Typed(el, {
        line,
        typeSpeed: speed,
        onComplete: done,
      });
    }
  });
};
