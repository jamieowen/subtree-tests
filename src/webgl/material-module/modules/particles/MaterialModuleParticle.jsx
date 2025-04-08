import quaternionToMatrix4 from '@/webgl/glsl/utils/quaternionToMatrix4.glsl';

export const MaterialModuleParticle = memo(({}) => {
  const { maxParticles } = useContext(ParticleSystemContext);

  useMaterialModule({
    name: 'MaterialModuleParticle',
    uniforms: {
      uParticleCount: { value: maxParticles },
    },
    vertexShader: {
      setup: /*glsl*/ `
        attribute vec2 reference;
        attribute float index;

        uniform sampler2D uPositionTexture;
        uniform sampler2D uRotationTexture;
        uniform sampler2D uRandomTexture;
        uniform sampler2D uLifeTexture;
        uniform float uParticleCount;

        flat varying vec2 vReference;
        flat varying float vIndex;
        varying float vProgress;

        ${quaternionToMatrix4}
      `,
      main: /*glsl*/ `
        vec4 life = texture2D(uLifeTexture, reference);
        float progress = life.y;
        vProgress = progress;

        if (progress <= 0. || progress >= 1.) {
          discard;
          return;
        }

        vec4 rot = texture2D(uRotationTexture, reference);
        vec4 pos = texture2D(uPositionTexture, reference);
        vec4 rand = texture2D(uRandomTexture, reference);

        transformed = (vec4(position, 1.0) * quaternionToMatrix4(rot)).xyz;
        transformed += pos.xyz;
        vPosition = transformed;

        vWorldPos = (modelMatrix * vec4(transformed.xyz, 1.0)).xyz;

        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        vReference = reference;
        vIndex = index;

      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `

        uniform sampler2D uPositionTexture;
        uniform sampler2D uRotationTexture;
        uniform sampler2D uRandomTexture;
        uniform sampler2D uLifeTexture;

        flat varying vec2 vReference;
        flat varying float vIndex;
        varying float vProgress;

      `,
      main: /*glsl*/ `
        pc_fragColor = vec4(1.);

        if (vProgress <= 0. || vProgress >= 1.) {
          discard;
        }
      `,
    },
  });

  return <></>;
});
