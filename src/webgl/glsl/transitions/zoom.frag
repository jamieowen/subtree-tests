
varying vec2 vUv;

uniform float mixRatio;

uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;

uniform vec2 uResolution;
uniform float uTime;

uniform float uFishEyeStrength;
uniform float uBlurStrength;

#define focusDetail 7
#define RADIALBLUR_KERNELSIZE 32

#include "../utils/zoom-blur.glsl"
#include "../utils/fisheye.glsl"
#include "../lygia/filter/radialBlur.glsl"


void main() {

  vec2 st = vUv;

  float p = mixRatio;
  float pFrom = smoothstep(0.0, 0.5, p);
  float pTo = smoothstep(0.5, 1.0, p);
  float pMix = smoothstep(0.35, 0.65, p);

  vec2 stFrom = fisheyeSt(st, pFrom, uFishEyeStrength);
  vec2 stTo = fisheyeSt(st, 1.0 - pTo, uFishEyeStrength);

  // vec3 cFrom = zoomBlur(tDiffuse2, stFrom, vec2(0.5,0.5), pFrom * 0.15).rgb;
  // vec3 cTo = zoomBlur(tDiffuse1, stTo, vec2(0.5,0.5), (1.0 - pTo) * 0.15).rgb;

  vec3 cFrom;
  if (p > 0. && p < 1.) {
    cFrom = radialBlur(tDiffuse2, stFrom, vec2(0.5,0.5), pFrom * uBlurStrength).rgb;
  } else {
    cFrom = texture2D(tDiffuse2, stFrom).rgb;
  }

  vec3 cTo;
  if (p > 0. && p < 1.) {
    cTo = radialBlur(tDiffuse1, stTo, vec2(0.5,0.5), (1.0 - pTo) * uBlurStrength).rgb;
  } else {
    cTo = texture2D(tDiffuse1, stTo).rgb;
  }

  vec3 c = mix(cFrom, cTo, pMix);
  // vec3 c = texture2D(tDiffuse1, st).rgb;
  // vec3 c = zoomBlur(tDiffuse2, st, vec2(0.5,0.5), 0.2).rgb;

  gl_FragColor = vec4(c, 1.0);

  // gl_FragColor = radialBlur(tDiffuse2, vUv, vUv - 0.5, 1.0);
  // gl_FragColor = zoomBlur(tDiffuse2, vUv, vec2(0.5,0.5), 0.1);

}

