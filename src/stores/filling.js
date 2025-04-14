import { create } from 'zustand';
import Env from '@/helpers/Env';
import {
  getUrlString,
  getUrlBoolean,
  getUrlInt,
  getUrlFloat,
} from '@/helpers/UrlParam';

import * as config from '@/config/games/filling';
import { number } from 'prop-types';

export const useFillingStore = create((set) => ({
  config,

  // ****************************************
  // LOADED
  // ****************************************
  setLoaded: () =>
    set((state) => {
      return { loaded: true };
    }),

  loadProgress: 0,
  setLoadProgress: (val) =>
    set((state) => {
      return { loadProgress: val };
    }),

  // ****************************************
  // READY
  // ****************************************
  ready: false,
  setReady: (val) =>
    set((state) => {
      return { ready: true };
    }),

  // ****************************************
  // SECTION
  // ****************************************
  section:
    getUrlString('page', '') == 'filling'
      ? getUrlString('section', 'video')
      : 'video',
  setSection: (val) =>
    set((state) => {
      return { section: val };
    }),
  nextSection: () =>
    set((state) => {
      switch (state.section) {
        case 'video':
          return { section: 'intro' };
        case 'intro':
          return { section: 'tutorial' };
        case 'tutorial':
          return { section: 'game' };
        case 'game':
          return { section: 'results' };
      }
    }),

  // ****************************************
  // GAME
  // ****************************************
  count: 0,
  setCount: (val) =>
    set((state) => {
      return { count: val };
    }),

  // ****************************************
  // REPLAY
  // ****************************************
  replay: () =>
    set((state) => {
      return {
        section: 'intro',
        count: 0,
      };
    }),
}));
