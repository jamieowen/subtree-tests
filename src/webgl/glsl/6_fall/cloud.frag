
varying vec2 vUv;
varying vec3 vWorldPos;
varying float vProgress;
flat varying vec2 vReference;

uniform sampler2D uTexture;

layout(location = 1) out vec4 gNormal;


void main() {
  csm_DiffuseColor = texture2D(uTexture, vUv);
  csm_DiffuseColor.a *= 1.0 - smoothstep(0.8, 1.0, vProgress);

  // gNormal = vec4(1.0);
  gNormal = gNormal;
}
