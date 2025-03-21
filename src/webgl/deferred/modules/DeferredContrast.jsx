import brightnessContrast from 'lygia/color/brightnessContrast.glsl';
import posterizeFunc from '@/webgl/glsl/utils/posterize.glsl';
import { urls } from '@/config/assets';
import { useAppStore } from '@/stores/app';

import { getUrlBoolean } from '@/helpers/UrlParam';

export const DeferredMenuFilter = ({
  enabled = false,
  posterize = {
    //
    enabled: false,
    gamma: 0.6,
    numBands: 2,
  },
  stylize = {
    //
    enabled: true,
    mod: 18.0,
    thickness: 1.0,
    color: 0x000000,
  },
  colorize = {
    //
    enabled: true,
    brightness: 1.0,
    contrast: 3,
    // color: 0xc1a16c,
    // color: 0xa6a6a6,
    color: 0x666666,
    //color: 0xf000ff,
  },
}) => {
  // PAPER TEXTURE
  // const texture = useAsset(urls.t_paper);

  const _stylizeColor = useColor(stylize.color);
  const _colorizeColor = useColor(colorize.color);

  // MODULE
  const { refDeferred } = useDeferredModule({
    name: 'DeferredMenuFilter',
    uniforms: {
      // POSTERIZE
      uPosterizeEnabled: {
        value: posterize.enabled,
      },
      uPosterizeGamma: {
        value: posterize.gamma,
      },
      uPosterizeNumBands: {
        value: posterize.numBands,
      },

      // STYLE
      uStylizeEnabled: {
        value: stylize.enabled,
      },
      uStylizeMod: {
        value: stylize.mod,
      },
      uStylizeThickness: {
        value: stylize.thickness,
      },
      uStylizeColor: {
        value: _stylizeColor,
      },

      // COLORIZE
      uColorizeEnabled: {
        value: colorize.enabled,
      },
      uColorizeBrightness: {
        value: colorize.brightness,
      },
      uColorizeContrast: {
        value: colorize.contrast,
      },
      uColorizeColor: {
        value: _colorizeColor,
      },

      // PAPER
      tPaper: {
        value: null,
      },

      // MIXING
      uMenuStrength: {
        value: 1,
      },
    },
    shaderChunks: {
      setup: /*glsl*/ `

        uniform bool uPosterizeEnabled;
        uniform float uPosterizeGamma;
        uniform float uPosterizeNumBands;

        uniform bool uStylizeEnabled;
        uniform float uStylizeMod;
        uniform float uStylizeThickness;
        uniform vec3 uStylizeColor;

        uniform bool uColorizeEnabled;
        uniform float uColorizeBrightness;
        uniform float uColorizeContrast;
        uniform vec3 uColorizeColor;

        uniform sampler2D tPaper;

        uniform float uMenuStrength;

        float luma(vec4 color) {
          return dot(color.rgb, vec3(0.299, 0.587, 0.114));
        }

        ${brightnessContrast}

        ${posterizeFunc}
      `,
      pass: /*glsl*/ `

        if(uMenuStrength > 0.) {
          vec4 dfm_original = pc_fragColor;
          vec4 dfm_color = dfm_original;

          

          // POSTERIZE
          if (uPosterizeEnabled) {
            dfm_color = posterize(dfm_color, uPosterizeGamma, uPosterizeNumBands);
          }
          
          // COLORIZE
          if (uColorizeEnabled) {
            float dfm_grayscale = luma(brightnessContrast(dfm_color, uColorizeBrightness, uColorizeContrast));
            dfm_color = vec4(vec3(dfm_grayscale), 1.0) * vec4(uColorizeColor, 1.0);
          }

          // HATCHING
          vec2 dfm_displacement = vec2(
            (hash(gl_FragCoord.xy) * sin(gl_FragCoord.y * 0.05)) ,
            (hash(gl_FragCoord.xy) * cos(gl_FragCoord.x * 0.05))
          ) * 2.0 /uResolution.xy;

          float dfm_luma = luma(dfm_color);
          float dfm_depth = readDepth(tDepth, vUv);

          // if(dfm_luma <= 0.35 && dfm_depth <= 0.99) {
          //   if (mod((vUv.y + dfm_displacement.y) * uResolution.y , uStylizeMod + fract(uTime * 0.1))  < uStylizeThickness) {
          //     dfm_color = vec4(uStylizeColor, 1.0);
          //   };
          // }

          // if (dfm_luma <= 0.55 && dfm_depth <= 0.99) {
          //   if (mod((vUv.x + dfm_displacement.x) * uResolution.x , uStylizeMod + fract(uTime * 0.1))  < uStylizeThickness) {
          //     dfm_color = vec4(uStylizeColor, 1.0);
          //   };
          // }

          if (dfm_luma <= 0.5 && dfm_depth <= 0.99) {
            if (mod((vUv.x + dfm_displacement.x) * uResolution.y - (vUv.y + dfm_displacement.y) * uResolution.x, uStylizeMod + fract(uTime * 0.1)) <= uStylizeThickness) {
              dfm_color = vec4(uStylizeColor, 1.0);
            };
          }

          if (dfm_luma <= 0.8 && dfm_depth <= 0.99) {
            if (mod((vUv.x + dfm_displacement.x) * uResolution.y + (vUv.y + dfm_displacement.y) * uResolution.x, uStylizeMod + fract(uTime * 0.1)) <= uStylizeThickness) {
              dfm_color = vec4(uStylizeColor, 1.0);
            };
          }


          // PAPER
          // vec4 paper = texture(tPaper, vUv);
          // dfm_color *= paper * 1.0;


          // MIXING
          float mixStrength = uMenuStrength;

          // TODO: Noise transition
          pc_fragColor = mix(dfm_original, vec4(dfm_color.rgb, 1.0), uMenuStrength);
        }
      `,
    },
  });

  // *****************************************************************
  //
  // TAP
  //
  // *****************************************************************

  useFrame(() => {
    refDeferred.current.uniforms.uMenuStrength.value =
      useAppStore.getState().bwMultiplier;
  });

  // const showMenu = useAppStore((state) => state.showMenu);

  // const onMenuUpdate = (v) => {
  //   if (!refDeferred?.current?.uniforms?.uMenuStrength) return;
  //   refDeferred.current.uniforms.uMenuStrength.value = v;
  // };

  // useToggleAnimation({
  //   active: showMenu,
  //   inParams: {
  //     ease: 'power2.out',
  //     duration: 0.2,
  //     onUpdate: onMenuUpdate,
  //   },
  //   outParams: {
  //     ease: 'power2.out',
  //     duration: 0.2,
  //     onUpdate: onMenuUpdate,
  //   },
  // });

  return <></>;
};
