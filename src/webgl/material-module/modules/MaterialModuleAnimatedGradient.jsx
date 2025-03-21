import pnoise from '@/webgl/glsl/lygia/generative/pnoise.glsl';
import luma from '@/webgl/glsl/lygia/color/luma.glsl';
import { urls } from '@/config/assets';

export const MaterialModuleAnimatedGradient = memo(
  forwardRef(
    (
      {
        color1 = 0xffffff,
        color2 = 0x000000,
        color3 = 0x000000,
        mixFunc = `screenPosition.y;`,
        blend = '',
        speed = 0.1,
      },
      ref
    ) => {
      // mixFunc = `'crange(vWorldPos.z, 0., 100., 0., 1.)'`

      // const tNoise = useTexture(urls.t_noise_green);

      // COLOR
      const _color1 = useColor(color1);
      const _color2 = useColor(color2);
      const _color3 = useColor(color3);

      const { material } = useMaterialModule({
        name: 'MaterialModuleAnimatedGradient',
        uniforms: {
          uAGradient_Color1: { value: _color1 },
          uAGradient_Color2: { value: _color2 },
          uAGradient_Color3: { value: _color3 },
          uAGradient_Speed: { value: speed },
          // tNoise: { value: tNoise },
        },
        fragmentShader: {
          setup: /*glsl*/ `
          uniform vec3 uAGradient_Color1;
          uniform vec3 uAGradient_Color2;
          uniform vec3 uAGradient_Color3;
          uniform float uAGradient_Speed;
          uniform sampler2D tNoise;

          ${pnoise}
          ${luma}
          
        `,
          main: /*glsl*/ `
          vec2 uv = vec2 (0.5 * st.x, 1.0 * st.y);
          vec3 rep = vec3(1.2, 3.4, 5.6) * 0.5 + 0.5;
          float value1 = 0.5 + 0.5 * pnoise(vec3 (1.5 * uv, uAGradient_Speed * uTime), rep);
          float value2 = 0.5 + 0.5 * pnoise(vec3 (1.5 * uv, uAGradient_Speed * (uTime - 10.0)), rep);

          // vec4 noise1 = texture(tNoise, 1.5 * uv + uAGradient_Speed * uTime);
          // value1 = 0.5 + 0.5 * noise1.r;

          float value = 1.0 * smoothstep(0.0, 1.0, value1) + 0.0 * smoothstep(0.0, 1.0, value2);
          value = clamp(value, 0.0, 1.0);

          float midpoint = 0.5;
          if (value >= 0.0 && value < midpoint) {
            pc_fragColor.rgb ${blend}= mix(uAGradient_Color1, uAGradient_Color2, value / midpoint);
          } 
          else if (value >= midpoint && value <= 1.0) {
            pc_fragColor.rgb ${blend}= mix(uAGradient_Color2, uAGradient_Color3, (value - midpoint) / (1.0 - midpoint));
          }


          // pc_fragColor.rgb = vec3(pnoise(vec3 (1.5 * uv, uAGradient_Speed * uTime), rep));
          // pc_fragColor.rgb = noise1.rgb;
        `,
        },
      });

      useEffect(() => {
        material.uniforms.uAGradient_Color1.value = _color1;
      }, [_color1]);

      useEffect(() => {
        material.uniforms.uAGradient_Color2.value = _color2;
      }, [_color2]);

      useEffect(() => {
        material.uniforms.uAGradient_Color3.value = _color3;
      }, [_color3]);

      useEffect(() => {
        material.uniforms.uAGradient_Speed.value = speed;
      }, [speed]);

      useImperativeHandle(
        ref,
        () => ({
          get color1() {
            return material.uniforms.uAGradient_Color1.value;
          },
          set color1(val) {
            material.uniforms.uAGradient_Color1.value = val;
          },
          get color2() {
            return material.uniforms.uAGradient_Color2.value;
          },
          set color2(val) {
            material.uniforms.uAGradient_Color2.value = val;
          },
          get color3() {
            return material.uniforms.uAGradient_Color3.value;
          },
          set color3(val) {
            material.uniforms.uAGradient_Color3.value = val;
          },
          get speed() {
            return material.uniforms.uFlowMap_Speed.value;
          },
          set speed(val) {
            material.uniforms.uFlowMap_Speed.value = val;
          },
        }),
        [material]
      );

      return <></>;
    }
  )
);
