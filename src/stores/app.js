import { create } from 'zustand';
import Env from '@/helpers/Env';
import AudioService from '@/services/AudioService';
import {
  getUrlString,
  getUrlBoolean,
  getUrlInt,
  getUrlFloat,
} from '@/helpers/UrlParam';

export const useAppStore = create((set) => ({
  // ****************************************
  // LOADED
  // ****************************************
  loaded: false,
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
  // AUDIO UNLOCKED
  // ****************************************
  audioUnlocked: false,
  setAudioUnlocked: (val) =>
    set((state) => {
      return { audioUnlocked: true };
    }),

  // ****************************************
  // MUTED
  // ****************************************
  muted: true,
  setMuted: (val) =>
    set((state) => {
      return { muted: val };
    }),
  toggleMuted: () =>
    set((state) => {
      let val = !state.muted;
      return { muted: val };
    }),

  // ****************************************
  // PAGE
  // ****************************************
  page: getUrlString('page', ''),
  setPage: (val) =>
    set((state) => {
      return { page: val };
    }),
  nextPage: () =>
    set((state) => {
      let pages = [
        '',
        'cleaning-intro',
        'cleaning',
        'filling',
        'grouping',
        'ending',
      ];
      let idx = pages.indexOf(state.page);
      idx++;
      if (idx >= pages.length) return {};
      const toPage = pages[idx];
      console.log('nextPage', idx, toPage);
      return { page: toPage };
    }),
}));
