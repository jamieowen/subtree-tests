
varying vec2 vUv;
varying vec3 vvNormal;
varying float vProgress;
flat varying vec2 vReference;
varying vec3 vWorldPos;

uniform float uOutline;
uniform vec3 uFallOff;

layout(location = 1) out vec4 gNormal;

#include "../../utils/range"

void main() {
  gNormal = vec4(vvNormal, uOutline);

  csm_DiffuseColor = vec4(1.);

  #ifdef HAS_FALLOFF
    float padding = uFallOff.z;
    float start = uFallOff.x;
    float end = uFallOff.y;
    
    float st = crange(vWorldPos.y, start - padding, start, 1., 0.);
    float en = crange(vWorldPos.y, end, end + padding, 0., 1.);

    float fallOff = st * en;
    csm_FragColor.a *= fallOff;
    gNormal.a *= fallOff;
  #endif

  // csm_FragColor.a *= crange(vWorldPos.y, uFallOff.x, uFallOff.y, 1., 0.); 
}
