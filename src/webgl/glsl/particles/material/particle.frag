
varying vec2 vUv;
varying vec3 vvNormal;
varying float vProgress;
flat varying vec2 vReference;
varying vec3 vWorldPos;

layout(location = 1) out vec4 gNormal;

void main() {
  pc_fragColor = vec4(1.);
  gNormal = vec4(1.0);
}
