// import { suspend, preload } from 'suspend-react';
import { PromiseTimeout } from '@/helpers/PromiseTimeout';

const wait = async () => {
  await PromiseTimeout(1000);
  return 'abcd';
};

// preload(wait, ['test-suspense']);

export const TestSuspense = () => {
  // const data = suspend(wait, ['test-suspense']);

  const loaded = useRef(false);

  if (!loaded.current) {
    throw new Promise(async (resolve) => {
      await PromiseTimeout(1000);
      loaded.current = true;
      resolve();
    });
  }

  useMemo(() => {
    console.log('TestSuspense useMemo');
  }, []);

  useEffect(() => {
    console.log('TestSuspense useEffect');
    return () => {
      console.log('TestSuspense useEffect dispose');
    };
  }, []);

  return <></>;
};
