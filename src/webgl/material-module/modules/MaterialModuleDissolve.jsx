import { urls } from '@/config/assets';

export const MaterialModuleDissolve = memo(
  forwardRef(
    (
      {
        progress = 1,
        thickness = 0.05,
        color = 0xffffff,
        scale = 1.0,
        direction = 'y',
      },
      ref
    ) => {
      const tNoise = useAsset(urls.t_noise_green);
      tNoise.wrapS = tNoise.wrapT = RepeatWrapping;

      const _color = useColor(color);

      const { material } = useMaterialModule({
        name: 'MaterialModuleDissolve',
        uniforms: {
          tDissolve_Noise: { value: tNoise },

          uDissolve_Progress: { value: progress },
          uDissolve_Thickness: { value: thickness },
          uDissolve_Color: { value: _color },
          uDissolve_Scale: { value: scale },
        },
        vertexShader: {
          setup: /*glsl*/ `
            varying float vDissolve;
          `,
          main: /*glsl*/ `
            vDissolve = color_1.g;
          `,
        },
        fragmentShader: {
          setup: /*glsl*/ `
            uniform float uDissolve_Progress;
            uniform float uDissolve_Thickness;
            uniform vec3 uDissolve_Color;
            uniform sampler2D tDissolve_Noise;
            uniform float uDissolve_Scale;

            varying float vDissolve;
          `,
          main: /*glsl*/ `

            vec2 duv = vPosition.xy;
            duv *= (1.0 / uDissolve_Scale);
            duv.x += uTime * 0.1;
            duv.y += uTime * 0.05;
            vec4 noise = texture2D(tDissolve_Noise, duv);

            // float verticalGradient = vDissolve;
            float verticalGradient = crange(vPosition.y, 0.0, vBoxHeight, 0.0, 1.0);
            float noiseValue = mix(noise.r, 1.0 - verticalGradient, 0.5);
            
            float p = 1.0 - pow(uDissolve_Progress, 0.8);
            float alpha = step(p, noiseValue);
            float border = step(p - uDissolve_Thickness, noiseValue) - alpha;
            
            pc_fragColor.a = alpha + border;

            if (pc_fragColor.a < 0.01) {
              discard;
            }

            pc_fragColor.rgb = mix(pc_fragColor.rgb, uDissolve_Color, border);


          `,
        },
      });

      useEffect(() => {
        material.uniforms.uDissolve_Progress.value = progress;
      }, [progress]);

      useEffect(() => {
        material.uniforms.uDissolve_Thickness.value = thickness;
      }, [thickness]);

      useEffect(() => {
        material.uniforms.uDissolve_Color.value = _color;
      }, [_color]);

      useEffect(() => {
        material.uniforms.uDissolve_Scale.value = scale;
      }, [scale]);

      useImperativeHandle(
        ref,
        () => ({
          get progress() {
            return material.uniforms['uDissolve_Progress'].value;
          },
          set progress(val) {
            material.uniforms['uDissolve_Progress'].value = val;
          },
          get thickness() {
            return material.uniforms['uDissolve_Thickness'].value;
          },
          set thickness(val) {
            material.uniforms['uDissolve_Thickness'].value = val;
          },
          get scale() {
            return material.uniforms['uDissolve_Scale'].value;
          },
          set scale(val) {
            material.uniforms['uDissolve_Scale'].value = val;
          },
        }),
        [material]
      );

      return <></>;
    }
  )
);
