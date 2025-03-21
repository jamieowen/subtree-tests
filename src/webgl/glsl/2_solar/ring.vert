varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;

uniform float uTime;
uniform float uStrength;
uniform float uWidth;
uniform float uSpeed;
uniform float uOffset;

#include "../lygia/math/map"
#include "../lygia/generative/fbm"
#include "../lygia/generative/snoise"
#include "../lygia/generative/pnoise"
#include "../lygia/animation/easing/quadraticInOut"

#define PI 3.1415926538

void main() {


  vec3 p = position;

  // Bulge
  float t = fract(uTime * uSpeed + uOffset);
  // t = quadraticInOut(t);

  float bPos = sin(smoothstep(-uWidth + t, uWidth + t, uv.x) * PI);
  float bStr = uStrength;
  bStr = (1. - smoothstep((0.5 - uWidth) * 0.5, 0.5, abs(uv.x - 0.5))) * uStrength;

  bStr *= snoise(fract(uTime * 0.1) * uv * 5.0);
  // bStr *= pnoise(uTime * vec2(uv.x * 0.5, uv.y) * 0.1, vUv);

  p += normal * bPos * bStr;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );

  vUv = uv;
  vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  vWorldPos = vec3(modelMatrix * vec4(position, 1.0));
}
