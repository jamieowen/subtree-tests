import rgb2luma from '@/webgl/glsl/lygia/color/space/rgb2luma.glsl';

export const MaterialModuleUv1 = memo(({ set = false, ...props }) => {
  useMaterialModule({
    name: 'MaterialModuleUv1',
    uniforms: {},
    vertexShader: {
      setup: /*glsl*/ `
        attribute vec2 uv1;
        varying vec2 vUv1;
      `,
      main: /*glsl*/ `
        vUv1 = uv1;
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
        varying vec2 vUv1;
        
      `,
      main: /*glsl*/ `
        vec2 st1 = vUv1;
        ${set ? 'st = st1;' : ''}
      `,
    },
  });

  return <></>;
});
