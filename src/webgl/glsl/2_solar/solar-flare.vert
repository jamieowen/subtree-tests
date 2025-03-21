precision mediump float;

attribute vec2 reference;

varying vec2 vUv;
flat varying vec2 vReference;
varying float vProgress;

uniform float uTime;
uniform float uDelta;

uniform sampler2D uLifeTexture;
uniform sampler2D uVelocityTexture;
uniform sampler2D uPositionTexture;
uniform sampler2D uRotationTexture;

#include "../lygia/animation/easing/sineOut"
#include "../utils/quaternionToMatrix4"

void main() {
  vUv = uv;
  vReference = reference;

  vec4 life = texture2D(uLifeTexture, reference);
  vProgress = life.y;

  vec4 modelPosition = vec4(position, 0.0);
  
  // Scale
  // float scale = sineOut(vProgress) * uScaleFactor;
  modelPosition *= clamp(vProgress, 0.0, 1.0);

  // Rotate
  vec4 rot = texture2D(uRotationTexture, reference);
  modelPosition *= quaternionToMatrix4(rot);

  // Translate
  vec4 pos = texture2D(uPositionTexture, reference);
  modelPosition += vec4(pos.xyz, 0.0);

  csm_Position = modelPosition.xyz;
}
