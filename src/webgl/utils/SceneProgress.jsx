import { createContext } from 'react';
import { map } from '@/helpers/MathUtils';

import {
  scenes,
  offsetMap,
  totalLength,
} from '@/components/webgl/scenes/config';

export const SceneProgressContext = createContext();

export const SceneProgress = ({ children, idx }) => {
  const { scroll } = useScroller();

  const prevScene = useMemo(() => {
    let prevIdx = idx - 1;
    if (prevIdx < 0) {
      prevIdx = scenes.length - 1;
    }
    return scenes[prevIdx];
  }, [idx]);

  const nextScene = useMemo(() => {
    let nextIdx = idx + 1;
    if (nextIdx >= scenes.length) {
      nextIdx = 0;
    }
    return scenes[nextIdx];
  }, [idx]);

  const scene = useMemo(() => scenes[idx], [idx]);
  const scrollLength = useMemo(() => scene.scrollLength, [scene]);
  const offset = useMemo(() => scene.offset, [scene]);

  const state = create(() => {
    return {
      idx,
      scenes,
      prevScene,
      nextScene,
      scene,
      scrollLength,
      offset,

      progress: 0, // scrollPosition / scrollLength
      scrollPosition: 0,
      renderOn: undefined,

      isActive: false,
      isPrev: false,
      isNext: false,
      isTransitioning: false,
      isLoop: false,
    };
  });

  // const scene = useMemo(() => scenes[idx], [scenes, idx]);
  // const scrollLength = useMemo(() => scene.scrollLength, [scene]);
  // const offset = useMemo(() => scene.offset, [scene]);

  // const progress = useRef(0);
  // const scrollPosition = useRef(0);
  // const renderOn = useRef(undefined);

  // const [isActive, setIsActive] = useState(false);
  // const [isPrev, setIsPrev] = useState(false);
  // const [isNext, setIsNext] = useState(false);
  // const [isTransitioning, setIsTransitioning] = useState(false);

  useFrame(() => {
    let s = scroll.current.current % totalLength;

    let scrollPosition = (scroll.current.current % totalLength) - scene.offset;
    let progress = map(s, offset, offset + scrollLength, 0, 1);

    // curr scene idx
    let currSceneIdx = offsetMap.findIndex((o) => o > s) - 1;
    if (currSceneIdx < 0) currSceneIdx = scenes.length - 1;

    // next scene idx
    let nextSceneIdx = currSceneIdx + 1;
    if (nextSceneIdx >= scenes.length) {
      nextSceneIdx = 0;
    }

    // prev scene idx
    let prevSceneIdx = currSceneIdx - 1;
    if (prevSceneIdx < 0) {
      prevSceneIdx = scenes.length - 1;
    }

    // if (idx == 0) {
    //   console.log(currSceneIdx, nextSceneIdx);
    // }

    if (idx == 0 && currSceneIdx == scenes.length - 1) {
      progress -= totalLength;
    }

    let transitionConfig = scenes[currSceneIdx].transition;
    let active = false;

    let renderOn = undefined;
    if (idx == currSceneIdx) {
      active = true;

      // Check if is transitioning (for alternate frame rendering)
      if (!transitionConfig.disableHalfFrameRate) {
        let p = s - offsetMap[currSceneIdx];

        // let from =
        //   transitionConfig.start +
        //   (transitionConfig.end - transitionConfig.start) * 0.5;
        let from = transitionConfig.start;
        let to = transitionConfig.end;
        if (p >= from && p <= to) {
          renderOn = 0;
        }
      }
    }

    if (idx == nextSceneIdx) {
      let p = s - offsetMap[currSceneIdx];
      if (p >= transitionConfig.start && p <= transitionConfig.end) {
        active = true;

        if (!transitionConfig.disableHalfFrameRate) {
          let from = transitionConfig.start;
          // let to =
          //   transitionConfig.end -
          //   (transitionConfig.end - transitionConfig.start) * 0.5;
          let to = transitionConfig.end;
          if (p >= from && p <= to) {
            renderOn = 1; // alternate frame rendering
          }
        }
      }
    }
    // setIsActive(active);
    // setIsNext(idx == nextSceneIdx);
    // setIsPrev(idx == prevSceneIdx);
    // setIsTransitioning(idx == nextSceneIdx && active);

    state.setState({
      scrollPosition,
      progress,
      renderOn,
      isActive: active,
      isNext: idx == nextSceneIdx,
      isPrev: idx == prevSceneIdx,
      isTransitioning: idx == nextSceneIdx && active,
      isLoop: scroll.current.isLoop,
    });
  });

  // const renderChildren = () => {
  //   return Children.map(children, (child) => {
  //     return cloneElement(child, {
  //       progress,
  //       enabled: isActive,
  //       isNext,
  //       renderOn,
  //       // isTransitioning,
  //       ...scene.props,
  //       idx,
  //       scene,
  //     });
  //   });
  // };

  return (
    // <>
    //   {children &&
    //     children({
    //       progress,
    //       enabled: isActive,
    //       // isPrev,
    //       isNext,
    //       isTransitioning,
    //       renderOn,
    //       ...scene.props,
    //       idx,
    //       scene,
    //     })}
    // </>
    <SceneProgressContext.Provider value={state}>
      {children}
    </SceneProgressContext.Provider>
  );
};

export default SceneProgress;
