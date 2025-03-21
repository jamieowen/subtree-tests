varying vec2 vUv;
varying vec3 vWorldPos;
uniform vec3 uLightPosition;

uniform sampler2D tNormal;
uniform sampler2D tAO;
uniform sampler2D tMap;

float saturate(float x) {
    return clamp(x, 0.0, 1.0);
}

vec3 gammaCorrect(vec3 col) {
    return pow(col, vec3(.4545));
}

void main() {
    vec4 color = texture2D(tMap, vUv);
    float ao = texture2D(tAO, vUv).r;

    // Dark
    vec3 col1 = vec3(0.576, 0.553, 0.467);
    // Surface
    vec3 col2 = vec3(0.804, 0.769, 0.651);
    
    vec3 final = color.rgb;
    #ifdef HAS_AO
        final = mix(final * 0.5, final, ao); 
    #endif

    // gl_FragColor = vec4(max(vec3(0.), color.rgb), 1.0);
    gl_FragColor = vec4(gammaCorrect(final), 1.0);
    // gl_FragColor = vec4(vUv, 1., 1.);

    // #include <tonemapping_fragment>
    // gl_FragColor = vec4(vUv, 1., 1.);
}