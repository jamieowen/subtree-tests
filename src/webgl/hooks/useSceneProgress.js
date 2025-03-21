export const useSceneTextures = function (sceneTextures) {
  const { scroll } = useScroller();

  const [curr, setCurr] = useState(0);
  const tSceneNext = useRef(null);
  const tSceneCurr = useRef(null);
  const uMixRatio = useRef(0);

  const scene = useMemo(() => scenes[curr], [curr]);

  const transitionConfig = useMemo(() => {
    return scenes[curr].transition;
  }, [scene]);

  useFrame(() => {
    // scroll idx
    let s = scroll.current.current % totalLength;

    // curr scene idx
    let currSceneIdx =
      offsetMap.findIndex(function (offset) {
        return offset > s;
      }) - 1;
    if (currSceneIdx < 0) currSceneIdx = scenes.length - 1;
    setCurr(currSceneIdx);

    // prev scene idx
    let prevSceneIdx = currSceneIdx - 1;
    if (prevSceneIdx < 0) prevSceneIdx = scenes.length - 1;

    // next scene idx
    let nextSceneIdx = currSceneIdx + 1;
    if (nextSceneIdx >= scenes.length) {
      nextSceneIdx = 0;
    }

    // scene progress
    let p = (s - offsetMap[currSceneIdx]) / scenes[currSceneIdx].scrollLength;
    let sceneLength = scenes[currSceneIdx].scrollLength;

    let transitionConfig = scenes[currSceneIdx].transition;

    // Update uniforms
    tSceneNext.current = sceneTextures.current[nextSceneIdx];
    tSceneCurr.current = sceneTextures.current[currSceneIdx];

    uMixRatio.current = map(
      s - offsetMap[currSceneIdx],
      transitionConfig.start,
      transitionConfig.end,
      0,
      1,
      true
    );
  });

  return {
    tSceneNext,
    tSceneCurr,
    uMixRatio,
    config: transitionConfig,
  };
};
