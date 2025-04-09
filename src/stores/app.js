import { create } from 'zustand';
import Env from '@/helpers/Env';
import AudioService from '@/services/AudioService';
import {
  getUrlString,
  getUrlBoolean,
  getUrlInt,
  getUrlFloat,
} from '@/helpers/UrlParam';
import { Howler } from 'howler';

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
  muted: false,
  setMuted: (val) =>
    set((state) => {
      Howler.mute(val);
      return { muted: val };
    }),
  toggleMuted: () =>
    set((state) => {
      let val = !state.muted;
      Howler.mute(val);
      return { muted: val };
    }),

  // ****************************************
  // SHOW QUIT
  // ****************************************
  showQuit: false,
  setShowQuit: (val) =>
    set((state) => {
      return { showQuit: val };
    }),
  toggleShowQuit: () =>
    set((state) => {
      let val = !state.showQuit;
      return { showQuit: val };
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
      return { page: toPage };
    }),
}));
