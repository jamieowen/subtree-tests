export function useToggleAnimation({ active, inParams, outParams }, deps = []) {
  const { animateIn, animateOut, kill } = useAnimation(
    {
      inParams,
      outParams,
    },
    deps
  );

  useEffect(() => {
    if (active) {
      animateIn();
    } else {
      if (outParams) {
        animateOut();
      }
    }
  }, [active]);

  return { animateIn, animateOut, kill };
}
