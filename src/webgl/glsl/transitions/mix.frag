
varying vec2 vUv;

uniform float mixRatio;
uniform float threshold;

uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform sampler2D tMixTexture;
// uniform sampler2D tFx;

void main() {


  // FX
  vec2 uv = vUv;

  // vec3 noiseMap = texture2D(tFx, uv).rgb;
  // vec3 nNoiseMap = noiseMap * 2.0 - 1.0;
  // uv = uv * 2.0 - 1.0;
  // uv *= mix(vec2(1.0), abs(nNoiseMap.rg), .6);
  // uv = (uv + 1.0) / 2.0;


  // MIX
  if (mixRatio == 0.0) {
    gl_FragColor = texture2D( tDiffuse2, uv );
    return;
  } 

  if (mixRatio == 1.0) {
    gl_FragColor = texture2D( tDiffuse1, uv );
    return;
  }

  vec4 texel1 = texture2D( tDiffuse1, uv );
  vec4 texel2 = texture2D( tDiffuse2, uv );

  vec4 transitionTexel = texture2D( tMixTexture, uv );
  // float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
  // float mixf = clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);
  float mixf = smoothstep(0., threshold, transitionTexel.r);

  gl_FragColor = mix( texel1, texel2, mixf );

  // gl_FragColor = transitionTexel;

}

