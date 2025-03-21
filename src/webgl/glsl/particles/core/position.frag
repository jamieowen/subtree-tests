uniform float uTime;
uniform float uDelta;
uniform float uSpeed;
uniform vec3 uWorldPos;
uniform vec4 uWorldQuat;
uniform sampler2D tShapeFrom;
uniform sampler2D tLifeConfig;

/// insert <setup>

#include "../../lygia/generative/random"

void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float index = resolution.x * gl_FragCoord.y + gl_FragCoord.x;

  vec4 lifeConfig = texture2D(tLifeConfig, uv);
  vec4 life = texture2D(textureLife, uv);
  vec4 rand = texture2D(textureRandom, uv);
  float progress = life.y;
  float needsReset = life.z;
  float id = lifeConfig.w;
  if (lifeConfig.w != life.w) {
    needsReset = 1.0;
  }
  
  vec4 currPosition = texture2D(texturePosition, uv);
  vec4 currVelocity = texture2D(textureVelocity, uv);

  vec4 nextPosition = currPosition;

  // Reset
  if (needsReset == 1.0) {
    vec4 iterationRandom = random4(vec2(index, uTime));
    vec2 st = iterationRandom.xy;
    vec4 fromPosition = texture2D(tShapeFrom, st);
    nextPosition = vec4(fromPosition.xyz, uTime);

    /// insert <reset>
  }

  /// insert <pre_execute>

  // Execute
  if (needsReset == 0.0 && progress > 0.0) {
    nextPosition += currVelocity * uDelta;
    
    /// insert <execute>
  }

  gl_FragColor = vec4(nextPosition);

}