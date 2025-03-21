varying vec2 vUv;

uniform float uTime;
uniform float uMovementSpeed;
uniform float uSkyDepth;
uniform float uScale;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec2 uMouse;
uniform sampler2D tNoise;
uniform float uOffset;

layout(location = 1) out vec4 gNormal;
layout(location = 2) out vec4 gOutline;

const highp float NOISE_GRANULARITY = 2./255.0;
highp float random(highp vec2 coords) {
    return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
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

void main() {
    vec2 uv = vUv * uScale + uOffset;

    vec2 mouse = uMouse * 0.5;
    float d = length(uv - uMouse);

    float speed = uMovementSpeed;
    float s = swirl(tNoise, uv, vec2(1., .5), vec2(speed, speed * -2.), 0.5, true);
    // s -= uTime * speed;
    // s += uTime * speed;

    // vec2 mouse = uMouse * 0.5 - 0.5;
    


    vec4 noise = texture(tNoise, uv + s);
    
    vec3 color = mix(uColor1, uColor2, st.y);
    color += noise.r * -noise.g * uSkyDepth;
    color += mix(-NOISE_GRANULARITY, NOISE_GRANULARITY, random(vUv));
    
    pc_fragColor = vec4(color, 1.0);
    // pc_fragColor = vec4(vUv, 1., 1.0);
    // pc_fragColor = vec4(vec3(d), 1.0);

    
    gNormal = gNormal;
    gOutline = gOutline;
    
    
}