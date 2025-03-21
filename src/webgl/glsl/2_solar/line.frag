
varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;
uniform float uAmount;

#include "../lygia/generative/fbm"

void main() {

  vec2 coord = vUv;
  coord += fbm(vUv + uTime * uSpeed) * uAmount;
  vec4 color = texture2D(uTexture, coord);
  csm_DiffuseColor = color;
}