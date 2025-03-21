

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec3 vPos;
varying float vProgress;
flat varying vec2 vReference;
varying vec4 vRand;

uniform float uTime;
uniform vec3 uPointColor;
uniform float uPointFade;
uniform float uPointOutline;
uniform float uPointAlpha;
uniform sampler2D tMap;

layout(location = 1) out vec4 gNormal;

void main() {
  // Rounded
  #ifdef USE_ROUNDED
    vec2 coord = gl_PointCoord - vec2(0.5);
    if(length(coord) > 0.5) {
      discard;
    }
  #endif

  vec4 color = vec4(uPointColor, 1.0);
  #ifdef HAS_MAP
    color *= texture(tMap, gl_PointCoord);
  #endif

  // Alpha
  // float initialAlpha = clamp(sin(uTime + (vRand.y * 100.) * 0.1) * 0.5 + 0.5, 0., 1.);
  // float maxAlpha = initialAlpha * color.a * uPointAlpha;
  // float alpha = maxAlpha * (1.0 - smoothstep(0.9, 1.0, abs(vProgress * 2.0 - 1.0)));

  // Discard
  // if(alpha < 0.01) discard;
  
  // pc_fragColor = vec4(color, alpha);
  pc_fragColor = vec4(color.rgb, 1.0);

  gNormal = vec4(vNormal, uPointOutline);
  
  
}
