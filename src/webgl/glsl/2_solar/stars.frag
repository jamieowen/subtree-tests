

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vPos;
varying float vProgress;
flat varying vec2 vReference;

uniform float uTime;
uniform vec3 uPointColor;

layout(location = 1) out vec4 gNormal;
layout(location = 2) out vec4 gOutline;

void main() {

  // if (vProgress == 0.) {
  //   discard;
  // }

  // Out
  pc_fragColor = vec4(uPointColor, 1.0);

  // Alpha
  pc_fragColor.a = 1.0 - smoothstep(0.5, 1.0, abs(vProgress * 2.0 - 1.0));

  // pc_fragColor.rgb /= pc_fragColor.a;

  #ifdef USE_ROUNDED
  vec2 coord = gl_PointCoord - vec2(0.5);
  if(length(coord) > 0.5) {
    discard;
  }
  #endif

  if (vProgress <= 0. || vProgress >= 1.) {
    discard;
  }



  // gNormal = vec4(vNormal, 0.0);
  gNormal = gNormal;
  gOutline = vec4(0.0);
  
}
