
precision mediump float;

attribute vec2 reference;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;
flat varying vec2 vReference;
varying float vProgress;
varying vec3 vPos;
varying vec3 vClipPos;

varying vec4 vRand;

uniform float uTime;
uniform sampler2D uLifeTexture;
uniform sampler2D uVelocityTexture;
uniform sampler2D uPositionTexture;
uniform sampler2D uRotationTexture;
uniform sampler2D uRandomTexture;
uniform float uPointSize;

#include "../../lygia/animation/easing/sineOut"
#include "../../utils/quaternionToMatrix4"
#include "../../lygia/generative/random"

void main() {
  vec4 life = texture2D(uLifeTexture, reference);
  vec4 modelPosition = vec4(position, 0.0);
  vec4 pos = texture2D(uPositionTexture, reference);
  vec4 rand = texture2D(uRandomTexture, reference);

  vec3 transformed = position;
  transformed += pos.xyz;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vWorldPos = vec3(modelMatrix * vec4(transformed, 1.0));
  vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  vPos = modelPosition.xyz;
  vUv = uv;
  vReference = reference;
  vProgress = life.y;
  vRand = rand;

  // Point Size
  gl_PointSize = uPointSize;

  #ifdef RANDOM_SIZE
    gl_PointSize = ((0.25 + rand.x * 0.75) * uPointSize);
  #endif

  float sizeProgress = 1.0 - smoothstep(0.9, 1.0, abs(life.y * 2.0 - 1.0));
  gl_PointSize *= sizeProgress;
}
