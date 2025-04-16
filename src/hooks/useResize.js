export const useResize = (callback) => {
  useEffect(() => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }, [callback]);
};
