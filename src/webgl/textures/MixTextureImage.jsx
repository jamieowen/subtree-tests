import { urls } from '@/config/assets';

export const MixTextureImage = forwardRef(function (
  { enabled, id, url, ...props },
  ref
) {
  let _url = useMemo(() => {
    let u = urls.t_transition_swirl;
    if (id) u = urls[`t_transition_${id}`];
    if (url) u = url;
    return u;
  }, [id, url]);

  const texture = useTexture(_url);

  // useImperativeHandle(
  //   ref,
  //   () => {
  //     return texture;
  //   },
  //   [texture]
  // );

  return (
    <>
      <primitive
        ref={ref}
        object={texture}
        {...props}
      />
    </>
  );
});
