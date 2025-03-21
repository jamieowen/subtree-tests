precision mediump float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform float uDelta;
uniform vec3 uMouse;

uniform sampler2D tLife;
uniform sampler2D tPosition;
uniform sampler2D tVelocity;
uniform sampler2D tBuffer;

void main() {

  float count = uResolution.x * uResolution.y;

  vec4 lifeData = texture2D(tLife, vUv);
  float startTime = lifeData.x;
  float lifeTime = lifeData.y;
  
  
  float progress = (uTime - startTime) / lifeTime;
  float progressClamped = clamp(progress, 0., 1.);
  vec3 pos = texture2D(tPosition, vUv).xyz;



  vec3 lastPos = texture2D(tBuffer, vUv).xyz;

  vec3 to = texture2D(tVelocity, vUv).xyz;
  vec3 velocity = (to - lastPos) * 4.;
  // vec3 velocity = vec3(0., 2. + quarticIn(voronoi2d(vUv)) * 4., 0.);

  vec3 diff = uDelta * velocity;

  vec3 nextPos = pos;
  
  if (progress > 0.1) {
    nextPos = lastPos + diff;

    // Mouse push
    // float len = length(uMouse - lastPos);
    // vec3 dir = normalize(uMouse - lastPos);
    // dir.z *= 0.;
    // float force = 0.1 / max(len, 0.00000001);
    // nextPos += -dir * force * sineIn(len);
  }

  // gl_FragColor = vec4(progress, 0., 0., 1.);
  gl_FragColor = vec4(nextPos, progressClamped);
}