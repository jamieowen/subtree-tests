import rgb2luma from '@/webgl/glsl/lygia/color/space/rgb2luma.glsl';

export const MaterialModuleUv2 = memo(({ set = false, ...props }) => {
  useMaterialModule({
    name: 'MaterialModuleUv2',
    uniforms: {},
    vertexShader: {
      setup: /*glsl*/ `
        attribute vec2 uv2;
        varying vec2 vUv2;
      `,
      main: /*glsl*/ `
        vUv2 = uv2;
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
        varying vec2 vUv2;
        
      `,
      main: /*glsl*/ `
        vec2 st2 = vUv2;
        ${set ? 'st = st2;' : ''}
      `,
    },
  });

  return <></>;
});
