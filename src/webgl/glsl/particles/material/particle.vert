precision mediump float;

attribute vec2 reference;
attribute float index;

varying vec2 vUv;
varying vec3 vvNormal;
varying vec3 vWorldPos;
flat varying vec2 vReference;
varying float vIndex;
varying float vProgress;

uniform float uTime;

uniform sampler2D uLifeTexture;
uniform sampler2D uVelocityTexture;
uniform sampler2D uPositionTexture;
uniform sampler2D uRotationTexture;

#include "../../lygia/animation/easing/sineOut"
#include "../../utils/quaternionToMatrix4"


void main() {
  vUv = uv;
  vReference = reference;
  vIndex = index;

  vec4 life = texture2D(uLifeTexture, reference);
  vProgress = life.y;

  
  vec4 transformed = vec4(position, 1.0);
  // vec3 transformed = position;

  // Scale
  // transformed *= clamp(vProgress, 0.0, 1.0);
  
  // Rotate
  vec4 rot = texture2D(uRotationTexture, reference);
  transformed *= quaternionToMatrix4(rot);

  // Translate
  vec4 pos = texture2D(uPositionTexture, reference);
  transformed += vec4(pos.xyz, 0.0);

  vWorldPos = (modelMatrix * vec4(transformed.xyz, 1.0)).xyz;

  

  // csm_Position = transformed.xyz;
  vec4 mvPosition = modelViewMatrix * transformed;
  gl_Position = projectionMatrix * mvPosition;
  // vvNormal = csm_Normal;

}
