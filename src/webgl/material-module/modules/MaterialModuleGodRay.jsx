import { urls } from '@/config/assets';
import range from '@/webgl/glsl/utils/range.glsl';

export const MaterialModuleGodRay = forwardRef(
  (
    { alpha = 1, power = 1, billboard = false, color = new Color(0xffffff) },
    ref
  ) => {
    const camera = useThree((state) => state.camera);

    const [tNoise, tMask] = useAsset([urls.t_noise_rough, urls.t_godray_mask]);

    const { material } = useMaterialModule({
      name: 'MaterialModuleGodRay',
      uniforms: {
        tGodRay_Noise: { value: tNoise },
        tGodRay_Mask: { value: tMask },
        uCameraQuaternion: { value: camera.quaternion },
        uGodRay_Opacity: { value: 0.01 },
        uGodRay_C: { value: 1.5 },
        uGodRay_Power: { value: power },
        uGodRay_Alpha: { value: alpha },
        uGodRay_Color: { value: color },
      },
      vertexShader: {
        setup: /*glsl*/ `
          uniform float uGodRay_Power;
          uniform float uGodRay_C;
          uniform vec4 uCameraQuaternion;

          attribute vec3 aGodRay_Random;

          varying float vGodRay_Intensity;
          varying vec3 vGodRay_ViewDir;
          varying vec3 vGodRay_Normal;
          varying vec3 vGodRay_Random;
        `,
        main: /*glsl*/ `
          vec3 pos = position;

          // TODO: times offset
          #ifdef GOD_RAY_BILLBOARD
            pos += 2.0 * cross(uCameraQuaternion.xyz, cross(uCameraQuaternion.xyz, pos) + uCameraQuaternion.w * pos);
          #endif

          vec4 offset = instanceMatrix * vec4(pos, 1.0);
          //offset.x *= 1. + (aRandom.x * 1.8);
          offset.xz *= 1. + (aGodRay_Random.z * 0.8);
          offset.x += sin(uTime * aGodRay_Random.x * 0.03) * 1. + aGodRay_Random.x;

          // TODO: scale wider downwards
          // gl_Position = projectionMatrix * modelViewMatrix * offset;
          csm_PositionRaw = projectionMatrix * modelViewMatrix * offset;

          // vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
          // vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
          vec3 vNormel = normalize(normalMatrix * cameraPosition);
          vGodRay_ViewDir = -vec3(modelViewMatrix * vec4(pos, 1.0));
          vGodRay_Intensity = pow(uGodRay_C - dot(vNormal, vNormel), uGodRay_Power);

          vGodRay_Random = aGodRay_Random;

        `,
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform float uGodRay_Opacity;
          uniform sampler2D tGodRay_Mask;
          uniform sampler2D tGodRay_Noise;
          uniform float uGodRay_Alpha;
          uniform vec3 uGodRay_Color;

          varying float vGodRay_Intensity;
          varying vec3 vGodRay_ViewDir;
          varying vec3 vGodRay_Random;
        `,
        main: /*glsl*/ `
            vec2 gst = st * 0.6 + vGodRay_Random.x;
            float t = uTime * .3 + vGodRay_Random.x * 0.2;

            // float colorInc = 1.5 + (vGodRay_Random.y * 0.5);
            vec3 initialColor = vec3(0.05);
            float colorInc = .5 + (vGodRay_Random.y * 0.5);
            vec3 final = (initialColor + colorInc) * vGodRay_Intensity;

            float freq = 0.04;
            vec2 noiseUv = gst;
            noiseUv.x *= .5;
            vec3 noiseTex = texture2D(tGodRay_Noise, noiseUv * freq).rgb;
            
            vec3 rgbMask = texture2D(tGodRay_Mask, gst).rgb;
            vec2 maskUv = gst;

            maskUv.x += t * 0.2;

            vec4 mask = texture2D(tGodRay_Mask, maskUv);
            final = mix(final, mask.rgb * rgbMask, noiseTex.g);

            float initialAlpha = uGodRay_Alpha;

            // FUNC: Smoothen edges
            float sm = 0.75;
            
            float a = initialAlpha;
            a = a - smoothstep(1. - sm, 1., st.x);
            a = a - smoothstep(sm, .0, st.x);

            if(a < 0.01) {
                discard;
            }


            vec4 color = vec4(final * 4., a);
            // FUNC: Fade on Y
            float fadeBottom = 0.3;
            color = mix(color * fadeBottom, color * 1.4, vUv.y);
            color.rgb *= uGodRay_Color;

            csm_FragColor = color;
            // pc_fragColor = color;
        `,
      },
    });

    useFrame(({ camera }) => {
      if (billboard) {
        material.uniforms['uCameraQuaternion'].value = camera.quaternion;
      }
    });

    useEffect(() => {
      material.uniforms['uGodRay_Power'].value = power;
    }, [material, power]);

    useEffect(() => {
      material.uniforms['uGodRay_Alpha'].value = alpha;
    }, [material, alpha]);

    useEffect(() => {
      if (billboard) {
        material.defines.GOD_RAY_BILLBOARD = 1;
      } else {
        delete material.defines.GOD_RAY_BILLBOARD;
      }
    }, [material, alpha]);

    useImperativeHandle(
      ref,
      () => ({
        get power() {
          return material.uniforms['uGodRay_Power'].value;
        },
        set power(val) {
          material.uniforms['uGodRay_Power'].value = val;
        },
        get alpha() {
          return material.uniforms['uGodRay_Alpha'].value;
        },
        set alpha(val) {
          material.uniforms['uGodRay_Alpha'].value = val;
        },
      }),
      [material]
    );

    return <></>;
  }
);
