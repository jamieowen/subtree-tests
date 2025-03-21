
varying vec2 vUv;

uniform float uTime;
uniform float uDelta;
uniform vec3 uStrength;
uniform vec2 uScrollSpeed;
uniform vec2 uOffset;

#include "../lygia/generative/curl"

void main() {
  vec3 n = curl(vec3(vUv + uOffset + uTime * uScrollSpeed, 1.0)) * uStrength.xyz;
  gl_FragColor = vec4(n, 1.0);
}