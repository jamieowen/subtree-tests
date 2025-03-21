export const useColor = (color) => {
  const _color = useMemo(() => {
    if (typeof color === 'object') {
      return color;
    } else {
      return new Color(color);
    }
  }, [color]);

  return _color;
};
