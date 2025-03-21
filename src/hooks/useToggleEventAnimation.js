export function useToggleEventAnimation({ inParams, outParams }, deps = []) {
  const { animateIn, animateOut, kill } = useAnimation(
    {
      inParams,
      outParams,
    },
    deps
  );

  useEvent(inParams?.event, animateIn, false, ...deps);
  if (outParams) useEvent(outParams?.event, animateOut, false, ...deps);

  return { animateIn, animateOut, kill };
}
