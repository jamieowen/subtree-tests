import { urls } from '@/config/assets';
import range from '@/webgl/glsl/utils/range.glsl';
import { targetHeight } from '@/config';
import normalEncoding from '@/webgl/glsl/utils/normalEncoding.glsl';

const vertexShader = /*glsl*/ `
    attribute vec2 reference;

    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    flat varying vec2 vReference;
    varying float vLife;
    varying vec3 vPos;
    varying vec4 vRand;

    uniform float uTime;
    uniform sampler2D uLifeTexture;
    uniform sampler2D uVelocityTexture;
    uniform sampler2D uPositionTexture;
    uniform sampler2D uRandomTexture;
    uniform float uPointSize;

    void main() {
        vec4 life = texture2D(uLifeTexture, reference);
        vec4 modelPosition = vec4(position, 0.0);
        vec4 pos = texture2D(uPositionTexture, reference);
        vec4 rand = texture2D(uRandomTexture, reference);

        vec3 transformed = position;
        transformed += pos.xyz;

        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Make particles smaller based on camera dist
        float size = 1000.0 / length(mvPosition.xyz) * (rand.x * 0.6);

        gl_PointSize = size * uPointSize;
        #ifdef RANDOM_SIZE
          gl_PointSize = size * ((0.25 + rand.x * 0.75) * uPointSize);
        #endif
        float sizeProgress = 1.0 - smoothstep(0.9, 1.0, abs(life.y * 2.0 - 1.0));
        gl_PointSize *= sizeProgress;

        vWorldPos = vec3(modelMatrix * vec4(transformed, 1.0));
        vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
        vPos = modelPosition.xyz;
        vUv = uv;
        vReference = reference;
        vLife = life.y;
        vRand = rand;
    }
`;

const fragmentShader = /*glsl*/ `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vNormal;
    varying float vLife;
    flat varying vec2 vReference;
    varying vec4 vRand;

    uniform float uTime;
    uniform vec3 uPointColor;
    uniform float uPointFade;
    uniform float uPointOutline;
    uniform sampler2D tMap;
    uniform vec3 uColor;
    uniform float uAlpha;

    layout(location = 1) out vec4 gNormal;
    layout(location = 2) out vec4 gOutline;

    ${range}
    ${normalEncoding}

    void main() {
        vec2 uv = gl_PointCoord;
        vec4 color = texture(tMap, uv);
        
        float initialAlpha = clamp(sin(uTime + (vRand.y * 100.) * 0.1) * 0.5 + 0.5, 0., 1.);
        // float maxAlpha = color.a * initialAlpha - (vRand.w * 0.25) * uAlpha;
        float maxAlpha = initialAlpha * color.a * uAlpha;
        // float alpha = crange(vLife, 0., 0.9, maxAlpha, 0.0);
        // alpha *= crange(vLife, 0., 0.2, 0.0, maxAlpha);
        float alpha = maxAlpha * (1.0 - smoothstep(0.9, 1.0, abs(vLife * 2.0 - 1.0)));
        // float alpha = maxAlpha;
        
        vec3 final = vec3(color.r) * uColor;
        //final = mix(final, final - vRand.xyz * 0.25, vRand.w);

        if(alpha < 0.01) discard;

        pc_fragColor = vec4(final, alpha);

        // gNormal = vec4(vNormal, 0.);
        gNormal.xy = normalEncode(vNormal);
        gNormal.w = 0.0;
        gOutline = gOutline;
        // gOutline = vec4(0.0, 0.0, 0.0, 0.0);
    }

`;

export default function ParticleAmbiance({
  color = '#ffffff',
  size = 1,
  alpha = 1,
  ...props
}) {
  const tMap = useAsset(urls.t_particle);
  const height = useThree((state) => state.size.height);
  const viewport = useThree((state) => state.viewport);

  const _size = useMemo(() => {
    return size * viewport.dpr * (height / targetHeight);
  }, [size, viewport, height]);

  const shader = useMemo(
    () => ({
      vertexShader,
      fragmentShader,
      defines: {
        RANDOM_SIZE: true,
      },
      uniforms: {
        tMap: {
          value: tMap,
        },
        uColor: {
          value: new Color(color).convertSRGBToLinear(),
        },
        uAlpha: {
          value: alpha,
        },
        uPointSize: {
          value: _size,
        },
      },
      transparent: true,
      depthWrite: false,
    }),
    []
  );

  useEffect(() => {
    shader.uniforms.uColor.value = new Color(color).convertSRGBToLinear();
  }, [color]);
  useEffect(() => {
    shader.uniforms.uAlpha.value = alpha;
  }, [alpha]);
  useEffect(() => {
    shader.uniforms.uPointSize.value = _size;
  }, [_size]);

  return (
    <shaderMaterial
      {...shader}
      blending={AdditiveBlending}
      {...props}
    />
  );
}
