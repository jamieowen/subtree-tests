varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor;
uniform sampler2D tMap;

void main() {
  gl_FragColor = vec4(uColor, 1.0);
}