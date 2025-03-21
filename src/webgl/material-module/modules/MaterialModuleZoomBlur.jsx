import zoomblur from '@/webgl/glsl/utils/zoom-blur.glsl';
import swirl from '@/webgl/glsl/utils/swirl.glsl';
import transformUV from '@/webgl/glsl/utils/transformUV.glsl';
import { urls } from '@/config/assets';
import { useFrame } from '@react-three/fiber';
import radialBlur from '@/webgl/glsl/lygia/filter/radialBlur.glsl';

export const MaterialModuleZoomBlur = forwardRef(
  ({ map, center = [0.5, 0.5], strength = 0, transition = 0 }, ref) => {
    const tZoomBlur = useAsset(urls.t_noise_rough);

    const { material } = useMaterialModule({
      name: 'MaterialModuleZoomBlur',
      uniforms: {
        uZoomBlur_Center: { value: new Vector2(center[0], center[1]) },
        uZoomBlur_Strength: { value: strength },
        tZoomBlur: {
          value: tZoomBlur,
        },
        uTime: {
          value: 0,
        },
        uZoomBlur_Transition: {
          value: transition,
        },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform vec2 uZoomBlur_Center;
          uniform float uZoomBlur_Strength;
          uniform float uZoomBlur_Transition;
          uniform sampler2D tZoomBlur;

          vec2 uvToRadial(vec2 uv) {
              // Center the UV coordinates to the range [-0.5, 0.5]
              vec2 centeredUV = uv - vec2(0.5, 0.5);

              // Compute the radius
              float r = length(centeredUV);

              // Compute the angle (theta) using atan function
              float theta = atan(centeredUV.y, centeredUV.x);

              return fract(vec2(r, theta));
          }


          #define RADIALBLUR_KERNELSIZE 32
          
          ${zoomblur}
          ${swirl}
          ${transformUV}
          ${radialBlur}

          float subtractWithFactor(float value1, float value2, float factor) {
              float result = value1 - value2;  // Simple subtraction
              return mix(value1, result, factor);  // Blend between original value and subtracted result
          }
        `,
        main: /*glsl*/ `
          vec2 zoomUV = uvToRadial(st);
          zoomUV.x += uTime * -0.5;
          zoomUV.y += uTime * -0.1;
          
          float n = swirl(tZoomBlur, zoomUV, vec2(1., 2.), vec2(0.1, 0.2), 0.5, false);
          vec4 noise = texture(tZoomBlur, zoomUV);

          float t = uZoomBlur_Transition;
          
          float r = crange(uZoomBlur_Transition, 0., 1., 0.8, 0.15);
          float innerCircle = subtractWithFactor(length(st - uZoomBlur_Center), r, noise.r);
          if(innerCircle < 0.02) innerCircle = 0.;

          float zbt = innerCircle * t;

          vec2 blurUV = st;
          blurUV = scaleUV(blurUV, vec2(1. + (zbt)), vec2(0.5));
          if (uZoomBlur_Strength + zbt > 0.) {
            pc_fragColor = zoomBlur(tMap, blurUV, uZoomBlur_Center, uZoomBlur_Strength + zbt);
          } else {
            pc_fragColor = texture(tMap, blurUV);
          }
          pc_fragColor.rgb = mix(pc_fragColor.rgb, vec3(1.), zbt);
        `,
      },
    });

    useEffect(() => {
      material.uniforms.uZoomBlur_Center.value.set(center[0], center[1]);
    }, [center]);

    useEffect(() => {
      material.uniforms.uZoomBlur_Strength.value = strength;
    }, [strength]);
    useEffect(() => {
      material.uniforms.uZoomBlur_Transition.value = transition;
    }, [transition]);

    useImperativeHandle(ref, () => {
      return {
        get strength() {
          return material.uniforms.uZoomBlur_Strength.value;
        },
        set strength(val) {
          material.uniforms.uZoomBlur_Strength.value = val;
        },
        get transition() {
          return material.uniforms.uZoomBlur_Transition.value;
        },
        set transition(val) {
          material.uniforms.uZoomBlur_Transition.value = val;
        },
      };
    }, [material]);

    useFrame(({ clock }) => {
      material.uniforms.uTime.value = clock.getElapsedTime();
    });

    return <></>;
  }
);
