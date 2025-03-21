varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

void main() {
  vUv = uv;
  vPosition = position.xyz;
  csm_Position = position.xyz;
}
