precision mediump float;

uniform vec2 uMouse;
uniform sampler2D tImage;
uniform sampler2D tDepth;
uniform float uStrength;

varying vec2 vUv;

vec4 linearTosRGB( in vec4 value ) {
  return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}


void main() {
  vec4 depthDistortion = texture2D(tDepth, vUv);
  float parallaxMult = 0.5 - depthDistortion.r;

  vec2 parallax = (uMouse) * parallaxMult * uStrength;

  vec4 original = texture2D(tImage, (vUv + parallax));

  gl_FragColor = linearTosRGB(original);
}