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
      if (!val) {
        document.querySelector('.bgm').play();
      }
      document.querySelector('.bgm').muted = val;
      return { muted: val };
    }),
  toggleMuted: () =>
    set((state) => {
      let val = !state.muted;
      if (!val) {
        document.querySelector('.bgm').play();
      }
      document.querySelector('.bgm').muted = val;
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
}));
