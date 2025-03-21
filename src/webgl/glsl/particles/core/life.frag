uniform float uTime;
uniform float uDelta;
uniform float uSpeed;
uniform sampler2D tLifeConfig;

void main() {

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float index = resolution.x * gl_FragCoord.y + gl_FragCoord.x;

  // Data
  vec4 lifeConfig = texture2D(tLifeConfig, uv);
  vec4 life = texture2D(textureLife, uv);

  float startTime = lifeConfig.x;
  float lifeTime = lifeConfig.y;
  float loop = lifeConfig.z;
  float id = lifeConfig.w;

  float remainingTime = life.x;
  float needsReset = life.z;
  float prevId = life.w;

  if (prevId != id) {
    needsReset = 1.0;
  }
  

  // ************************************************************
  // Remainig Time
  // ************************************************************

  // tick
  remainingTime -= uDelta;

  // reset
  if (needsReset == 1.0) {
    if (loop == 1.0) {
      remainingTime = lifeTime - mod(uTime - startTime, lifeTime);
    } else {
      remainingTime = lifeTime;
    }
    needsReset = 0.0;
  }

  // not started
  if (startTime > uTime) {
    remainingTime = lifeTime;
  }

  // progress
  float progress = (lifeTime - remainingTime) / lifeTime;
  if (lifeTime == 0.) {
    progress = 0.;
  }

  // need reset
  if (remainingTime <= 0.0 && loop == 1.0) {
    needsReset = 1.0;
  }

  gl_FragColor = vec4(remainingTime, progress, needsReset, id);

  
}