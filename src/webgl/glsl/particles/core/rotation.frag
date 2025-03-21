#define M_PI 3.1415926535897932384626433832795

uniform float uTime;
uniform float uDelta;
uniform float uSpeed;
uniform vec3 uWorldPos;
uniform vec4 uWorldQuat;
uniform sampler2D tShapeFrom;
uniform sampler2D tLifeConfig;



/// insert <setup>

void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float index = resolution.x * gl_FragCoord.y + gl_FragCoord.x;

  vec4 lifeConfig = texture2D(tLifeConfig, uv);
  vec4 life = texture2D(textureLife, uv);
  vec4 rand = texture2D(textureRandom, uv);
  float progress = life.y;
  float needsReset = life.z;
  if (lifeConfig.w != life.w) {
    needsReset = 1.0;
  }
  
  vec4 currPosition = texture2D(texturePosition, uv);
  vec4 currVelocity = texture2D(textureVelocity, uv);
  vec4 currRotation = texture2D(textureRotation, uv);

  vec4 nextRotation = currRotation;

  // Do Reset
  if (needsReset == 1.0) {
    /// insert <reset>
  }

  // Execute
  if (progress > 0.0) {
    /// insert <execute>
  }

  gl_FragColor = vec4(nextRotation);

}