// type Entity = {
//   velocity: { x: number; y: number };
//   position: { x: number; y: number };
//   frame: number;
//   cleaning: false;
//   cleaned: false;
// };

export const world = new World();

export const ECS = createReactAPI(world);
