precision mediump float;
#include "../lygia/math/map"
#include "../lygia/generative/fbm"

varying vec2 vUv;
varying float vProgress;
varying float vIndex;

uniform float uTime;
uniform sampler2D tMask;
uniform sampler2D tGas;



void main() {

  // float p = 1. - vProgress;
 
  // Darken
  // csm_DiffuseColor.rgb -= smoothstep(0.6, 0.8, vProgress);

  // // Mask
  // vec4 mask = texture2D( tMask, rotateUV(vUv, vIndex) );
  // float testA = mask.r;


  // float testB = smoothstep(0.4, 1.0, vProgress) * 0.5;
  // if (testA < testB) {
  //   discard;
  // }

  float alpha = map(abs(vUv.y - 1.), 0.1, 0.4, 0.0, 1.0);

  vec2 coord = vec2(vUv.x, vUv.y + uTime * 1.);

  float distortionScale = 1.0;
  float distortionAmount = 1.0;
  vec2 distortionCoord = vec2(sin(uTime) + cos(uTime), 1.0);

  // coord.x = mix(coord.x, cnoise2(distortionCoord * distortionScale), distortionAmount);
  coord.y = fbm(coord) * 1.3;

  vec4 gas = texture2D( tGas, coord );
  csm_DiffuseColor.rgba = gas.rgba;

  csm_DiffuseColor.a *= alpha;

  if (csm_DiffuseColor.r < 0.1) {
    discard;
  }

  // Out
  csm_DiffuseColor;


}