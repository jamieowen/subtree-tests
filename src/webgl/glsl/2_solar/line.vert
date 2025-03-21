varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;
uniform float uAmount;

#include "../lygia/generative/fbm"

void main() {
  vUv = uv;
  csm_Position = position.xyz;
  csm_Position += fbm(vUv + uTime * uSpeed) * uAmount;
}
