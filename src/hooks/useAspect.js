export const useAspect = () => {
  const size = useWindowSize();

  const aspectRatio = useMemo(() => {
    return size.width / size.height;
  }, [size.width, size.height]);

  const orientation = useMemo(() => {
    if (aspectRatio >= 1) {
      return 'landscape';
    } else {
      return 'portrait';
    }
  }, [aspectRatio]);

  const isLandscape = useMemo(() => {
    return orientation === 'landscape';
  }, [orientation]);

  const isPortrait = useMemo(() => {
    return orientation === 'portrait';
  }, [orientation]);

  return { aspectRatio, orientation, isLandscape, isPortrait };
};
