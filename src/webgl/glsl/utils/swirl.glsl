#include ./sdfOperations.glsl

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