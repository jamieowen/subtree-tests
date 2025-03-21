/*
contributors: Patricio Gonzalez Vivo
description: power of 3
use: pow3(<float|vec2|vec3|vec4> v)
*/

#ifndef FNC_POW3
#define FNC_POW3

float pow3(const in float v) { return v * v * v; }
vec2 pow3(const in vec2 v) { return v * v * v; }
vec3 pow3(const in vec3 v) { return v * v * v; }
vec4 pow3(const in vec4 v) { return v * v * v; }

#endif
