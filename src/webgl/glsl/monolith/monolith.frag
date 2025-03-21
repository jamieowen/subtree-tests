varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vEye;

uniform sampler2D tScene;
uniform sampler2D tScenePrev;
uniform sampler2D tNoise;
uniform sampler2D tPattern;
uniform sampler2D tMatcap;


uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uTime;

layout(location = 1) out vec4 gNormal;

float opSmoothUnion( float d1, float d2, float k ) {
    float h = max(k-abs(d1-d2),0.0);
    return min(d1, d2) - h*h*0.25/k;
}

float swirl(sampler2D tex, vec2 st, vec2 scale, vec2 speed, float smoothness, bool invertXY) {
    vec2 uv0 = st;
    vec2 uv1 = st;
    if(invertXY == true) {
        uv0 = (st * scale.x) + vec2(uTime * speed.x, 0.);
        uv1 = (st * scale.y) + vec2(0.0, -uTime * speed.y);
    } else {
        uv0 = (st * scale.x) + vec2(uTime * speed.x);
        uv1 = (st * scale.y) - vec2(-uTime * speed.y);
    }

    vec4 sw1 = texture2D(tex, uv0);
    vec4 sw2 = texture2D(tex, uv1);

    return opSmoothUnion(sw1.r, sw2.r, smoothness);
}

float sdCircle( vec2 p, float r ) {
    return length(p) - r;
}

vec2 matCapUV(in vec3 eye, in vec3 normal) {
  vec3 r = reflect(eye, normal);
  float m = 2.82842712474619 * sqrt(r.z + 1.0);
  vec2 vN = r.xy / m + .5;
  return vN;
}

#include ../lygia/lighting/fresnel.glsl

void main() {

    // vec2 st = gl_FragCoord.xy / uResolution.xy;
    
    vec2 uv = vUv;
    // uv.y *= 5.;

    float scale = 1.;
    float speed = 0.1;
    float noise = swirl(tNoise, uv, vec2(scale, -scale), vec2(-speed, speed), 0.5, false);
    float noise2 = swirl(tNoise, -uv, vec2(scale, -scale), vec2(speed, -speed), 0.9, true);
    float noise3 = swirl(tNoise, uv, vec2(noise, -noise2), vec2(speed, -speed), 0.9, true);

    // float time = uTime;
    // float t = abs(sin((time)));
    
    // vec2 nUV = vUv;

    // vec2 pUV = vUv;
    // pUV *= 1.;

    // vec3 lightPos = vec3(noise, noise2, noise3);
    // // vec3 norm = texture2D(tPattern, pUV).rgb;
    // // float ndotl = clamp(dot(norm.rgb, normalize(lightPos)), 0., 1.) * 0.5 + 0.5;
    // // ndotl = ndotl * ndotl;
    
    // float m = smoothstep(0., 1., vUv.y * noise);
    // float m2 = smoothstep(0., 1., vUv.y * noise2);
    
    // vec3 base = mix(uColor1, uColor2, m);
    // base = mix(base, mix(base, uColor3, noise), smoothstep(0., t, vUv.y));

    // vec3 color = base;

    // vec2 mm = vec2(uMouse.x, 1. - uMouse.y);
    // float d2 = 1. - sign(sdCircle(st - mm, 0.1 * noise3));
    // float d = pow(1. - distance(st, mm), 6.);
    // d *= mix(noise3, pow(noise3, -noise2 * 4.), pow(d2, 10. * noise2));
    
    // // vec4 sceneCurr = texture2D(tScene, st);
    // // vec4 scenePrev = texture2D(tScenePrev, st);
    // // vec4 scene = max(sceneCurr, scenePrev);
    // color = mix(color, 1. - color, clamp(d, 0., 1.));

    // // vec3 uFresnelColor = vec3(1., 0., 0.);
    // // float fresnelIntensity = 1.;
    // // float fresnelTerm = (1.0 - -min(dot(vViewPosition, normalize(vNormal)), 0.0));    

    // // vec3 final = color + vec3(1., 0., 1.) * fresnelTerm;
    
    // vec3 r = reflect(vEye, vNormal);
    // float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );
    // vec2 vN = r.xy / m + .5;

    
    

    vec3 uFresnelColor = vec3(1., 0., 1.);
    float fresnelIntensity = 1.;
    float fresnelTerm = (1.0 - -min(dot(vEye, vNormal), 0.0));        

    // vec4 color = texture2D(tMatcap, vN + (noise * fresnelTerm));
    // vec4 color = texture2D(tMatcap, matCapUV(vEye, vNormal) + (noise2 * fresnelTerm));
    vec4 color = texture2D(tMatcap, matCapUV(vEye, normalize(vNormal)));

    // vec3 final = color.rgb + uFresnelColor * fresnelTerm;
    vec3 final = color.rgb;
    
    gl_FragColor = vec4(final, 1.0);
    // gl_FragColor = vec4(mix(uColor1, uColor2, vUv.x * vUv.y), 1.0);

    gNormal = vec4(vNormal, 1.0);
}