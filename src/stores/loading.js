import { create } from 'zustand';
import { produce } from 'immer';

export const useLoadingStore = create((set) => ({
  // loadGroups: [],
  addLoadGroup: (id) =>
    set(
      produce((state) => {
        if (state[id]) return;
        state[id] = { id, progress: 0, completed: false };
      })
    ),
  // set((state) => {
  //   if (state[id]) return;
  //   state.id = { id, progress: 0, completed: false };
  //   return state;
  //   // return {
  //   //   [id]: { id, progress: 0, completed: false },
  //   // };
  //   // if (loadGroups.find((g) => g.id === id)) return {};
  //   // return {
  //   //   loadGroups: [...loadGroups, { id, progress: 0, completed: false }],
  //   // };
  // }),

  setLoadGroupProgress: (id, progress) =>
    set(
      produce((state) => {
        state[id].progress = progress;
      })
    ),

  setLoadGroupCompleted: (id) =>
    set(
      produce((state) => {
        state[id].completed = true;
      })
    ),
}));
