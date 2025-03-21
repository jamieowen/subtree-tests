export default function useZSubscribe(store, handler, deps = []) {
  const isInitial = useRef(true);
  useEffect(() => {
    if (!store) return;
    const unsub = store.subscribe((s) => {
      handler(s, isInitial.current);
      isInitial.current = false;
    });

    return () => {
      unsub();
    };
  }, [store, handler, ...deps]);
}
