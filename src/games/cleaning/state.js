// type Entity = {
//   velocity: { x: number; y: number };
//   position: { x: number; y: number };
//   frame: number;
//   cleaning: false;
//   cleaned: false;
// };

export const cleaningWorld = new World();

export const CleaningECS = createReactAPI(cleaningWorld);
