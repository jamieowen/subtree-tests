
varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;

uniform float uTime;
uniform float uSpeed;
uniform float uOffset;

uniform sampler2D tMap;

layout(location = 1) out vec4 gNormal;

void main() {

  vec2 coord = vUv;
  vec3 gammaColor = texture2D(tMap, coord.xy).xyz;

  vec3 color = pow(gammaColor, vec3(2.0));
  float gray = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float gammaGray = sqrt(gray);

  // gl_FragColor = vec4(vec3(gammaGray), 0.9);
  pc_fragColor = gl_FragColor;

  gNormal = vec4(vNormal, 1.0);
  // gNormal.xy = normalEncode(vNormal);
  // gNormal.w = 1.0;
  
}