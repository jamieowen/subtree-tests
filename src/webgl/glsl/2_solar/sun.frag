
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform float uAmount;

uniform sampler2D tMap;
uniform sampler2D tNoise;

#include "../lygia/generative/snoise"

void main() {

  vec2 coord = vUv;
  vec3 noise = snoise3(vPosition + uTime * uSpeed) * uAmount;
  coord.xy += noise.xy;
  vec4 color = texture2D(tMap, coord.xy);


  csm_DiffuseColor = vec4(color.xyz, 1.0);
}