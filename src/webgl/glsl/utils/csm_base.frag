
varying vec2 vUv;

uniform sampler2D uTexture;

void main() {
  csm_DiffuseColor = texture2D(uTexture, vUv);
}