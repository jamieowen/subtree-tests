export const mouse = {
  clientX: undefined,
  clientY: undefined,
  x: undefined, // normalized
  y: undefined, // normalized
  isDown: false,
};

// import { create } from 'zustand';

// export const useMouseStore = create((set, get) => ({
//   mouse: {
//     clientX: undefined,
//     clientY: undefined,
//     x: undefined, // normalized
//     y: undefined, // normalized
//     isDown: false,
//   },
//   setMouse: (val) =>
//     set((state) => {
//       return { mouse: { ...state.mouse, ...val } };
//     }),
//   // projected: {
//   //   x: undefined,
//   //   y: undefined,
//   //   z: undefined,
//   // },
//   // getProjected: (out = [Infinity, Infinity, Infinity], invertXY = true) => {
//   //   const { mouse, projected } = get();

//   //   if (isNaN(mouse.clientX)) {
//   //     return out;
//   //   }

//   //   const x = invertXY ? -projected.x : projected.x;
//   //   const y = invertXY ? -projected.y : projected.y;
//   //   return [x, y, projected.z];
//   // },
// }));
