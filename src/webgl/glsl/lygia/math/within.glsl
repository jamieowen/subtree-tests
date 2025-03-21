/*
contributors: Johan Ismael
description: Similar to step but for an interval instead of a threshold. Returns 1 is x is between left and right, 0 otherwise
use: within(<float> _min, <float|vec2|vec3|vec4> maxVal, <float|vec2|vec3|vec4> x)
*/

#ifndef FNC_WITHIN
#define FNC_WITHIN
float within(in float x, in float _min, in float _max) {
    return step(_min, x) * (1. - step(_max, x));
}

float within(in vec2 x, in vec2 _min, in vec2 _max) {
    vec2 rta = step(_min, x) * (1. - step(_max, x));
    return rta.x * rta.y;
}

float within(in vec3 x, in vec3 _min, in vec3 _max) {
    vec3 rta = step(_min, x) * (1. - step(_max, x));
    return rta.x * rta.y * rta.z;
}

float within(in vec4 x, in vec4 _min, in vec4 _max) {
    vec4 rta = step(_min, x) * (1. - step(_max, x));
    return rta.x * rta.y * rta.z * rta.w;
}
#endif