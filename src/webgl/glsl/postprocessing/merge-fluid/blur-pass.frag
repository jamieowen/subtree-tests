

varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform sampler2D tNoise;
uniform sampler2D tDiffusePrev;
uniform sampler2D tToBlur;
uniform sampler2D tToBlurPrev;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uOffset;

#include "../../lygia/generative/snoise"

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(1.411764705882353) * direction;
    vec2 off2 = vec2(3.2941176470588234) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;
    color += texture2D(image, uv) * 0.1964825501511404;
    color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
    color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;

//   return color;
    return color;
}


//float shades = 3.;

// vec3 tint = vec3(.459,.765,1.);

#define R uResolution.xy
#define ss(a,b,t) smoothstep(a,b,t)

float gyroid (vec3 seed) { return dot(sin(seed),cos(seed.yzx)); }

float fbm (vec3 seed, float speed) {
    float result = 0., a = .5;
    float distortion = 0.5;
    vec3 direction = vec3(1,1,1);
    
    for (int i = 0; i < 6; ++i, a /= 2.) {
        seed += direction * uTime * speed * .01 / a;
        seed.z += result*distortion;
        result += gyroid(seed/a)*a;
    }
    return result;
}


vec4 blur(sampler2D image, vec2 uv, vec2 resolution, int radius) {
    vec4 color = vec4(0.0);
    for (int i = -radius; i <= radius; i++) {
        for (int j = -radius; j <= radius; j++) {
            color += texture2D(image, uv + vec2(i, j) / resolution);
        }
    }
    return color / float((radius * 2 + 1) * (radius * 2 + 1));
}


float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t){
   float xx=x+sin(t*fx)*sx;
   float yy=y+cos(t*fy)*sy;
   return 1.0/sqrt(xx*xx+yy*yy);
}

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

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    vec3 sub = vec3(oldValue, newMax, oldMax) - vec3(oldMin, newMin, oldMin);
    return sub.x * sub.y / sub.z + newMin;
}

vec2 range(vec2 oldValue, vec2 oldMin, vec2 oldMax, vec2 newMin, vec2 newMax) {
    vec2 oldRange = oldMax - oldMin;
    vec2 newRange = newMax - newMin;
    vec2 val = oldValue - oldMin;
    return val * newRange / oldRange + newMin;
}

vec3 range(vec3 oldValue, vec3 oldMin, vec3 oldMax, vec3 newMin, vec3 newMax) {
    vec3 oldRange = oldMax - oldMin;
    vec3 newRange = newMax - newMin;
    vec3 val = oldValue - oldMin;
    return val * newRange / oldRange + newMin;
}

float crange(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

vec2 crange(vec2 oldValue, vec2 oldMin, vec2 oldMax, vec2 newMin, vec2 newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

vec3 crange(vec3 oldValue, vec3 oldMin, vec3 oldMax, vec3 newMin, vec3 newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

float map(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

vec2 map(vec2 oldValue, vec2 oldMin, vec2 oldMax, vec2 newMin, vec2 newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

vec3 map(vec3 oldValue, vec3 oldMin, vec3 oldMax, vec3 newMin, vec3 newMax) {
    return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
}

float rangeTransition(float t, float x, float padding) {
    float transition = map(t, 0.0, 1.0, -padding, 1.0 + padding);
    return map(x, transition - padding, transition + padding, 1.0, 0.0);
}

float gaussFunction(vec2 st, vec2 p, float r) {
    return exp(-dot(st-p, st-p)/2./r/r);
}


void main() {
    vec4 color = texture2D(tDiffuse, vUv);

    float pixel = 1. / uResolution.x;
    vec2 noiseUV = vUv * 2.;
    noiseUV.x += uTime * 0.1;
    noiseUV.y += uTime * 0.1;
    vec4 noise = texture2D(tNoise, noiseUV);
    
    vec4 toBlur = texture2D(tToBlur, vUv);
    //vec4 toBlurPrev = texture2D(tToBlurPrev, vUv);

    //vec2 motionVector = toBlur.xy - toBlurPrev.xy;

    float value = toBlur.r;
    float threshold = 0.5;
    value = value > threshold ? 1.0 : 0.0;

    // Apply dilation
    //value = dilation(vUv, 5.0);

    // Convert to binary again if needed
    //value = value > 0.5 ? 1.0 : 0.0;

    // // float blurred = blur(tToBlur, vUv, uResolution, 4).r;
    // float blurred = blur13(tToBlur, vUv, uResolution, vec2(4.)).r;
    // // float bl2 = toBlurPrev.r;
    vec2 fbmCoords = vUv + toBlur.xy * uTime * 0.02; 
    float shape = fbm(vec3(fbmCoords, 0.), 0.01);
    

    // Adjust blob edge based on noise
    float edgeWidth = 0.2; // Width of the transition zone
    float edge = smoothstep(0.5 - edgeWidth, 0.5 + edgeWidth, value * shape);
    
    // float n = mix(0., noise.r, blurred) * noise.r;
    // n = smoothstep(
    //    noise.r, 1., rangeTransition(noise.r, shape, blurred)
    // );
    // n = mix(shape, n, blurred);
    // n = mix(n * shape, n, blurred);
    // n = mix(0., n, blurred);
    
    // float shades = 3.;
    // float layers = 2.;

    // float gradient = fract(edge * layers);    
    // float shade = round(pow(gradient, 4.)*shades)/shades;

    // vec3 c = p.xyz;

    // vec2 texCoord = gl_FragCoord.xy / textureSize(particleTexture, 0);

    // float density = 0.0;
    // float maxDensity = 9.0;
    // int radius = 4;
    // for(int dy = -radius; dy <= radius; dy++) {
    //     for(int dx = -radius; dx <= radius; dx++) {
    //         vec2 offset = vec2(dx, dy) / vec2(textureSize(tToBlur, 0));
    //         density += texture2D(tToBlur, vUv + offset).r;
    //     }
    // }

    // density = clamp(density / maxDensity, 0.0, 1.0);

    // vec3 dc = mix(vec3(0), vec3(1), density); // Blue to red gradient
    // gl_FragColor = vec4(dc, 1.0);


    // gl_FragColor = vec4(vec3(blurred), 1.);
    gl_FragColor = vec4(vec3(toBlur.rgb), 1.);
}
