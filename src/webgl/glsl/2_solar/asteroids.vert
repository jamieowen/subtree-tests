
precision mediump float;

attribute vec2 reference;

varying vec2 vUv;
flat varying vec2 vReference;
varying float vProgress;
varying vec3 vPos;

uniform float uTime;
uniform sampler2D tLifeConfig;
uniform sampler2D uLifeTexture;
uniform sampler2D uVelocityTexture;
uniform sampler2D uPositionTexture;
uniform sampler2D uRotationTexture;
uniform float uPointSize;

#include "../lygia/generative/random"

void main() {
  vec4 lifeConfig = texture2D(tLifeConfig, reference);
  vec4 life = texture2D(uLifeTexture, reference);
  vec4 modelPosition = vec4(position, 0.0);
  vec4 pos = texture2D(uPositionTexture, reference);

  vec3 transformed = position;
  transformed += pos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

  vPos = modelPosition.xyz;
  vUv = uv;
  vReference = reference;
  vProgress = life.y;
  gl_PointSize = uPointSize;

  #ifdef RANDOM_SIZE
  gl_PointSize = (0.25 + random(vReference) * 0.75) * uPointSize;
  #endif
}
