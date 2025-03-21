precision mediump float;

varying vec2 vUv;
varying float vProgress;
varying float vIndex;

attribute float index;

uniform vec2 uResolution;
uniform float uTime;
uniform float uScaleFactor;
uniform sampler2D tPosition;



mat2 rot2D(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}


void main() {
  vUv = uv;
  vIndex = index;

  // tPos
  float row = floor(index / uResolution.y);
  float col = mod(index, uResolution.x);
  vec2 coord = vec2(col, row) / uResolution;
  vec4 data = texture2D(tPosition, coord);

  vProgress = data.w;

  vec3 modelPosition = position;

  
  // Scale
  // float scaleP = smoothstep(0.0, 0.8, vProgress);
  // scaleP = sineOut(scaleP);
  // scaleP = map(scaleP, 0.0, 1.0, 2.0, 0.5);
  // float scale = scaleP;
  // float scale = sineOut(vProgress) * uScaleFactor + smoothstep(0.3, 1.0, vProgress) * uScaleFactor;
  // float scale = exponentialOut(vProgress) * uScaleFactor;
  float scale = 0.5;
  modelPosition *= scale;

  
  // modelPosition.x += sin(uTime) * uv.x;
  // modelPosition.xy *= rot2D(0.5);
  
  // Translate
  modelPosition += data.xyz;



  // vProgress = 1. - vProgress;
  csm_Position = modelPosition.xyz;
}
