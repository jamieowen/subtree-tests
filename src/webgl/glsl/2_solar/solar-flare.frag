precision mediump float;
#include "../lygia/math/map"
#include "../lygia/generative/fbm"
#include "../lygia/generative/cnoise"
#include "../lygia/animation/easing/sineOut"

varying vec2 vUv;
flat varying vec2 vReference;
varying float vProgress;
// varying vec3 vNormal;

uniform float uTime;
uniform float uDelta;
uniform vec2 uDistortionSpeed;
uniform vec2 uDistortionAmount;
uniform vec2 uScrollSpeed;
uniform vec3 uColor;

uniform sampler2D uSolarTexture;

layout(location=1) out vec4 gNormal;
layout(location=3) out vec4 gOutline;

void main() {

  vec2 coord = vUv;

  // Distort
  coord += fbm(vUv + (uTime + vProgress + vReference) * uDistortionSpeed) * uDistortionAmount;

  // Scroll
  coord += uTime * -uScrollSpeed;

  vec4 texture = texture2D( uSolarTexture, coord );

  // Progress
  // float p = 1.0 - vProgress;
  // float alpha = 1.0;
  // if (p < 0.5) {
  //   alpha = step(vUv.y, (p * 2.));
  // } else {
  //   alpha = step(1. - vUv.y, 1. - (p * 2. - 1.));
  // }
  // texture *= alpha;

  float outProgress = sineOut(vProgress);
  texture.a *= 1.0 - outProgress;

  if (texture.a < 0.1) {
    discard;
  }

  csm_DiffuseColor = texture;
  csm_DiffuseColor.rgb *= uColor;

  gNormal = vec4(vec3(1.0), 0.0);
  gOutline = vec4(0.0);

}