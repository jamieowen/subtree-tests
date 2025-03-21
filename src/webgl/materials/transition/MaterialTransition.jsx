import { map } from '@/helpers/MathUtils';

import {
  scenes,
  offsetMap,
  totalLength,
} from '@/components/webgl/scenes/config';
import { create } from 'zustand';

// export const fboState = create(() => ({
//   curr: null,
//   next: null,
// }));

export const MaterialTransition = ({ children, ...props }) => {
  const { scroll } = useScroller();

  const refGroup = useRef(null);
  const refMix = useRef(null);
  const refZoom = useRef(null);
  const refRadial = useRef(null);

  useFrame(() => {
    const state = transitionState.getState();

    // scroll idx
    let s = scroll.current.current % totalLength;

    // curr scene idx
    let currSceneIdx =
      offsetMap.findIndex(function (offset) {
        return offset > s;
      }) - 1;
    if (currSceneIdx < 0) currSceneIdx = scenes.length - 1;

    // prev scene idx
    let prevSceneIdx = currSceneIdx - 1;
    if (prevSceneIdx < 0) prevSceneIdx = scenes.length - 1;

    // next scene idx
    let nextSceneIdx = currSceneIdx + 1;
    if (nextSceneIdx >= scenes.length) {
      nextSceneIdx = 0;
    }

    const next = state.fbos[nextSceneIdx];
    const curr = state.fbos[currSceneIdx];
    const config = scenes[currSceneIdx].transition;
    const mixRatio = map(
      s - offsetMap[currSceneIdx],
      config.start,
      config.end,
      0,
      1,
      true
    );

    transitionState.setState({
      fboNext: next,
      fboCurr: curr,
      config,
      mixRatio,
    });

    let material = refMix.current;
    switch (config.material.name) {
      case 'MaterialTransitionMix':
        material = refMix.current;
        break;
      case 'MaterialTransitionZoom':
        material = refZoom.current;
        break;
      case 'MaterialTransitionRadialPosition':
        material = refRadial.current;
        break;
    }

    if (refGroup.current.parent.material != material) {
      refGroup.current.parent.material = material;
      refGroup.current.parent.material.needsUpdate = true;
    }
  }, -1);

  return (
    <group ref={refGroup}>
      <MaterialTransitionMix ref={refMix} />
      <MaterialTransitionZoom ref={refZoom} />
      <MaterialTransitionRadialPosition ref={refRadial} />
    </group>
  );
};

export default MaterialTransition;
