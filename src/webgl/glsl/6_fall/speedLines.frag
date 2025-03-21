varying vec2 vUv;

uniform sampler2D tMap;
uniform sampler2D tNoise;

uniform float uTime;
uniform float uDown;

layout(location = 1) out vec4 gNormal;
layout(location = 2) out vec4 gOutline;

void main() {
  float speed = 2.;
  vec2 uv = vUv;
  uv.x *= 3.;
  uv.x -= uTime * 0.05;

  float ad = uDown * 1.2;
  float t = fract(uTime * 1. + uDown);
  uv.y /= 4.;
  uv.y += t;
  
  vec2 noiseUV = vUv;
  noiseUV.y *= .25;
  noiseUV.x -= uTime * .1;
  noiseUV.y += uTime * .7;

  vec4 noise = texture2D(tNoise, noiseUV * 4.);
  vec4 color = texture2D(tMap, uv);
  
  if (color.r > 0.5) {
    discard;
  }
  
  float alpha = smoothstep(1., 0.9, vUv.y);
  alpha = mix(alpha, alpha - noise.g * 2., 1. - uDown);
  // vec3 final = vec3(1.) - color.rgb;
  vec3 final = vec3(1.) - color.rgb;
  
  gl_FragColor = vec4(1.0 - final, max(alpha, 0.));

  // gNormal = vec4(0.,0.,1.,0.);
  gNormal = gNormal;
  gOutline = gOutline;
}