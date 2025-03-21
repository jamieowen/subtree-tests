import { FileLoader } from 'three';

export const IsObject = (url) =>
  url === Object(url) && !Array.isArray(url) && typeof url !== 'function';

export const useJson = (input, onLoad) => {
  const gl = useThree((state) => state.gl);

  const jsons = useLoader(
    FileLoader,
    IsObject(input) ? Object.values(input) : input,
    (loader) => {
      loader.setResponseType('json');
    }
  );

  useLayoutEffect(() => {
    onLoad?.(textures);
  }, [onLoad]);

  if (IsObject(input)) {
    const keyed = {};
    let i = 0;
    for (const key in input) keyed[key] = jsons[i++];
    return keyed;
  } else {
    return jsons;
  }
};
