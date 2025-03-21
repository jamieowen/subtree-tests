#include "oklab2rgb.hlsl"
#include "rgb2sgb.hlsl"

/*
contributors: Bjorn Ottosson (@bjornornorn)
description: oklab to sRGB https://bottosson.github.io/posts/oklab/
use: <float3\float4> oklab2srgb(<float3|float4> oklab)
*/

#ifndef FNC_OKLAB2SRGB
#define FNC_OKLAB2SRGB
float3 oklab2srgb(const in float3 oklab) { return rgb2srgb(oklab2rgb(oklab)); }
float4 oklab2srgb(const in float4 oklab) { return float4(oklab2srgb(oklab.xyz), oklab.a); }
#endif
