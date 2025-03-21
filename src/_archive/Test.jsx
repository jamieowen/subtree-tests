export const Test = () => {
  useMemo(() => {
    console.log('Test useMemo');
  }, []);
  useEffect(() => {
    console.log('Test useEffect');
    return () => {
      console.log('Test useEffect dispose');
    };
  }, []);

  return <></>;
};
