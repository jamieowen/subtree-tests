import { urls } from '@/config/assets';

export const MaterialModuleFlowMap = ({ map }) => {
  useMaterialModule({
    name: 'MaterialModuleFlowMap',
    uniforms: {
      tFlowMap: siteFlowMapUniform, // auto updated in src/webgl/utils/FlowMap.jsx
    },
    vertexShader: {
      setup: /*glsl*/ `
        uniform sampler2D tFlowMap;
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform sampler2D tFlowMap;
      `,
    },
  });

  return <></>;
};
