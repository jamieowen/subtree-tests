varying vec2 vUv;

uniform float uMixRatio;
uniform float uTime;
uniform float uRange;
uniform vec3 uStartPosition;

uniform float uCameraNearCurr;
uniform float uCameraFarCurr;
uniform mat4 uCameraProjectionMatrixCurr;
uniform mat4 uCameraProjectionMatrixInverseCurr;
uniform mat4 uCameraMatrixWorldCurr;

uniform float uCameraNearNext;
uniform float uCameraFarNext;
uniform mat4 uCameraProjectionMatrixNext;
uniform mat4 uCameraProjectionMatrixInverseNext;
uniform mat4 uCameraMatrixWorldNext;


uniform sampler2D tTransition;
uniform sampler2D tNoise;
uniform sampler2D tDiffuseCurr;
uniform sampler2D tDiffuseNext;
uniform sampler2D tDepthCurr;
uniform sampler2D tDepthNext;

#define PI 3.14159265359

// TODO: 

#include ../utils/range.glsl
#include ../utils/swirl.glsl
#include ../utils/transformUV.glsl
#include ../utils/map.glsl

vec4 getRGB(sampler2D tDiffuse, vec2 uv, float angle, float amount) {
    vec2 offset = vec2(cos(angle), sin(angle)) * amount;
    vec4 r = texture2D(tDiffuse, uv + offset);
    vec4 g = texture2D(tDiffuse, uv);
    vec4 b = texture2D(tDiffuse, uv - offset);
    return vec4(r.r, g.g, b.b, g.a);
}

float shockDist(vec2 uv, float x, float y) {
	return sqrt(pow(abs(uv.x - x), 2.)+ pow(abs(uv.y - y),2.));
}

float shockwave(float rawX, float r) {
	float x = rawX;
	float shock = sin(x*r-PI)/(x*r-PI);
    float shockTime = 0.8;
	float squareFunction = ceil(x/1e10)-ceil((x-shockTime)/1e10);
	return shock*squareFunction;
}

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}

float readDepthCurr( sampler2D depthTexture, vec2 coord ) {
    float fragCoordZ = texture( depthTexture, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, uCameraNearCurr, uCameraFarCurr );
    return viewZToOrthographicDepth( viewZ, uCameraNearCurr, uCameraFarCurr );
}

vec4 readWorldPosFromDepthCurr( sampler2D depthTexture, vec2 coord ) {
    // depth
    float fragCoordZ = texture( depthTexture, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, uCameraNearCurr, uCameraFarCurr );
    float depth = viewZToOrthographicDepth( viewZ, uCameraNearCurr, uCameraFarCurr );

    // world position
    float clipW = uCameraProjectionMatrixCurr[2][3] * viewZ + uCameraProjectionMatrixCurr[3][3];
    vec4 clipPosition = vec4( ( vec3( coord, depth ) - 0.5 ) * 2.0, 1.0 );
    clipPosition *= clipW;
    vec4 viewPosition = uCameraProjectionMatrixInverseCurr * clipPosition;
    return uCameraMatrixWorldCurr * vec4( viewPosition.xyz, 1.0 );
}

float readDepthNext( sampler2D depthTexture, vec2 coord ) {
    float fragCoordZ = texture( depthTexture, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, uCameraNearNext, uCameraFarNext );
    return viewZToOrthographicDepth( viewZ, uCameraNearNext, uCameraFarNext );
}

vec4 readWorldPosFromDepthNext( sampler2D depthTexture, vec2 coord ) {
    // depth
    float fragCoordZ = texture( depthTexture, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, uCameraNearNext, uCameraFarNext );
    float depth = viewZToOrthographicDepth( viewZ, uCameraNearNext, uCameraFarNext );

    // world position
    float clipW = uCameraProjectionMatrixNext[2][3] * viewZ + uCameraProjectionMatrixNext[3][3];
    vec4 clipPosition = vec4( ( vec3( coord, depth ) - 0.5 ) * 2.0, 1.0 );
    clipPosition *= clipW;
    vec4 viewPosition = uCameraProjectionMatrixInverseNext * clipPosition;
    return uCameraMatrixWorldNext * vec4( viewPosition.xyz, 1.0 );
}

layout(location = 1) out vec4 gNormal;

float rangeTransition(float t, float x, float padding) {
    float transition = map(t, 0.0, 1.0, -padding, 1.0 + padding);
    return map(x, transition - padding, transition + padding, 1.0, 0.0);
}

void main() {  
    vec2 uv = vUv;
    
    // vec4 worldPosition = readWorldPosFromDepth(tDepthCurr, vUv);
    vec4 texelWorldCurr = readWorldPosFromDepthCurr(tDepthCurr, uv);
    vec4 texelWorldNext = readWorldPosFromDepthNext(tDepthNext, uv);
    vec4 texelDepthCurr = texture2D(tDepthCurr, uv);
    vec4 texelDepthNext = texture2D(tDepthNext, uv);

    float t = uMixRatio;
    


    vec4 texelCurr = texture2D(tDiffuseCurr, uv);
    // Persist mesh, just mix between input / output
    // if(texelWorldCurr.w == 0.0) {
    //     vec4 texelCurr = texture2D(tDiffuseCurr, uv);
    //     vec4 texelNext = texture2D(tDiffuseNext, uv);
    //     gl_FragColor = mix(texelCurr, texelNext, t);
    //     return;
    // }
    
    float distFromStartPosCurr = length(texelWorldCurr.xyz - uStartPosition);
    float distFromStartPosNext = length(texelWorldNext.xyz - uStartPosition);
    
    float dist = min(distFromStartPosCurr, distFromStartPosNext);
    float distNormalized = crange(dist, 0., uRange, 0., 1.);
    
    // vec2 worldUV = texelWorldCurr.xz;
    // float maxLength = 4.;    
    // vec2 dir = worldUV - vec2(0.);
    // float r = length(dir);
    // float angle = atan(worldUV.x, worldUV.y) / PI;
    // worldUV = vec2(r / maxLength, angle);

    // Sample transition texture with world UV
    // float speed = 0.01;
    // float noise = swirl(tNoise, worldUV, vec2(1., .5), vec2(speed, -speed * 2.), 0.5, true);
    // float swirled = swirl(tTransition, worldUV, vec2(0.5 + noise, 0.5 + noise * 0.5), vec2(speed, -speed * 2.), 0.5, true);
    // float swirledNoNoise = swirl(tTransition, worldUV, vec2(1., .5), vec2(speed * 2., -speed * 2.), 0.5, true);

    // Larger range means quicker movement and smaller ring
    float range = uRange;
    float innerRange = crange(dist, -1., range, 0., 1.);

    // Multiply by progress to avoid ring becoming too large on huge geometry
    float ringRadius = 0.4 * (1. - t);
    
    vec2 toonUV = min(texelWorldCurr.xz, texelWorldNext.xz) / 8.;
    
    float toon = texture2D(tTransition, toonUV).r;
    float showInside = rangeTransition(t, innerRange, ringRadius * smoothstep(0., 1.0, t));

    float ring = smoothstep(1., 0.9 * toon, showInside);
    ring *= smoothstep(0.85 * toon, 0.9, showInside);

    showInside += step(toon, ring);
    
    showInside *= crange(t, 0.0, 0.1, 0.0, 1.0);    
    showInside -= ring;

    vec3 outside = (texture2D(tDiffuseCurr, uv)).rgb;
    vec3 inside = (texture2D(tDiffuseNext, uv)).rgb;
    
    // Apply ring
    inside += ring;
    
    // Mix inside / outside
    vec3 final = mix(outside, inside, clamp(showInside, 0.0, 1.0));
    gl_FragColor = vec4(final.rgb, 1.);
    
    //gl_FragColor = vec4(vec3(toon), 1.);
    
//    gl_FragColor = vec4(vec3(ring), 1.);
    
}