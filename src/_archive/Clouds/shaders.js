import { patchShaders } from 'gl-noise';

export const vertexShader = /*glsl*/ `
    varying vec2 vUv;
    // varying vec3 vWorldPos;
    varying vec3 vPos;
    varying float vInstanceId;

    // attribute float instanceId;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

        vUv = uv;
        
        vPos = position;
        // vWorldPos = (modelMatrix * pp).rgb;
        // vInstanceId = instanceId;
    }
`;

export const fragmentShader = patchShaders(/*glsl*/ `
    #define PI 3.141596
    varying vec2 vUv;
    varying vec3 vPos;
    // varying vec3 vWorldPos;
    // varying float vInstanceId;

    uniform sampler2D tMask;
    uniform sampler2D tNormal;
    uniform sampler2D tNoise;
    uniform vec2 uResolution;
    uniform float uTime;


    // uniform mat4 uTrackerWorldMatrix;

    uniform vec3 uLightPosition;
    uniform vec3 uAttenuation;
    uniform vec3 uAmbientColor;
    uniform vec3 uLightColor;

    // uniform vec3 uBBMin;
    // uniform vec3 uBBMax;

    // uniform vec3 uTrackerPosition;

    vec2 scaleUV(vec2 uv, vec2 scale, vec2 origin) {
        vec2 st = uv - origin;
        st /= scale;
        return st + origin;
    }

    vec3 radialBlur( sampler2D map, vec2 uv, float size, float quality ) {
        vec3 color = vec3(0.);

        const float tau = PI * 2.0;
        const float direction = 8.0;

        vec2 radius = size / vec2(1024.0);
        float test = 1.0;

        for ( float d = 0.0; d < tau ; d += tau / direction ) {
            vec2 t = radius * vec2( cos(d), sin(d));
            for ( float i = 1.0; i <= 100.0; i += 1.0 ) {
                if (i >= quality) break;
                color += texture2D( map, uv + t * i / quality ).rgb ;
            }
        }

        return color / ( quality * direction);
    }

    // vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {
    //     float sliceSize = 1.0 / size;                         // space of 1 slice
    //     float slicePixelSize = sliceSize / size;              // space of 1 pixel
    //     float sliceInnerSize = slicePixelSize * (size - 1.0); // space of size pixels
    //     float zSlice0 = min(floor(texCoord.z * size), size - 1.0);
    //     float zSlice1 = min(zSlice0 + 1.0, size - 1.0);
    //     float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
    //     float s0 = xOffset + (zSlice0 * sliceSize);
    //     float s1 = xOffset + (zSlice1 * sliceSize);
    //     vec4 slice0Color = texture2D(tex, vec2(s0, texCoord.y));
    //     vec4 slice1Color = texture2D(tex, vec2(s1, texCoord.y));
    //     float zOffset = mod(texCoord.z * size, 1.0);
    //     return mix(slice0Color, slice1Color, zOffset);
    // }

    vec2 computeSliceOffset(float slice, float slicesPerRow, vec2 sliceSize) {
        return sliceSize *
        vec2(
            mod(slice, slicesPerRow),
            floor(slice / slicesPerRow)
        );
    }

    // vec3 inverseMatrixTransform(vec3 p) {
    //     return (inverse(uTrackerWorldMatrix) * vec4(p, 1.0)).xyz;
    // }

    float sdSphere(vec3 p) {
        // return length(p) * length(fwidth(uv));
        return length(p);
    }

    float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
        vec3 sub = vec3(oldValue, newMax, oldMax) - vec3(oldMin, newMin, oldMin);
        return sub.x * sub.y / sub.z + newMin;
    }

    float map(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
        return clamp(range(oldValue, oldMin, oldMax, newMin, newMax), min(newMin, newMax), max(newMin, newMax));
    }

    float opSmoothUnion( float d1, float d2, float k ) {
        float h = max(k-abs(d1-d2),0.0);
        return min(d1, d2) - h*h*0.25/k;
    }

    float opSmoothSubtraction( float d1, float d2, float k ) {
        return -opSmoothUnion(d1,-d2,k);
        
        //float h = max(k-abs(-d1-d2),0.0);
        //return max(-d1, d2) + h*h*0.25/k;
    }

    float opSmoothIntersection( float d1, float d2, float k ) {
        return -opSmoothUnion(-d1,-d2,k);

        //float h = max(k-abs(d1-d2),0.0);
        //return max(d1, d2) + h*h*0.25/k;
    }

    void main() {   
        float eps = 0.01;
        vec3 p = vPos;

        vec4 mask = texture2D(tMask, vUv);

        if(mask.r < eps) {
            discard;
        }

        float noiseScale = 13.;
        vec2 noiseUV = vUv * noiseScale;
        noiseUV.x += uTime * 0.15;
        noiseUV.y -= uTime * 0.15;
        vec4 noise = texture2D(tNoise, noiseUV);
        
        float noiseUVInfluence = 0.3;
        vec2 normUV = scaleUV(
            vUv, 
            vec2(1.) + (noise.rg * noiseUVInfluence), 
            vec2(0.5)
        );

        vec4 norm = texture2D(tNormal, normUV);
        vec2 st = (gl_FragCoord.xy / uResolution.xy);
        vec3 lightDir = vec3(uLightPosition - p);
        
        float d = length(uLightPosition);
        vec3 n = normalize(norm.rgb * 2.0 - 1.0);
        vec3 l = normalize(lightDir);
        
        float lightIntensity = 0.4;
        vec4 lightColor = vec4(uLightColor, lightIntensity);
        float dd = max(dot(n, l), 0.0);
        vec3 diff = (lightColor.rgb * lightColor.a) * dd;

        float ambientIntensity = 1.;
        vec3 ambient = vec3(1.) * ambientIntensity;    
        float attenuation = 1.0 / (uAttenuation.x + (uAttenuation.y * d) + (uAttenuation.z * d * d));
        
        vec3 intensity = ambient + diff * attenuation;
        vec3 base = vec3(0.2);
        vec3 final = base + diff.rgb * intensity;

        // vec3 whiteYellow = vec3(0.914, 0.871, 0.725);
        vec3 whiteYellow = vec3(0.98);
        // vec3 darkBlue = vec3(0.298, 0.475, 0.553);
        // vec3 darker = vec3(0.988, 0.969, 0.925);
        vec3 darker = vec3(0.588, 0.714, 0.678);

        // vec3 outlineColor = vec3(0.851, 0.8, 0.69);
        vec3 outlineColor = vec3(0.298, 0.475, 0.553);

        float colorRamp = pow(length(final.rgb), 2.);
        final.rgb = mix(darker, whiteYellow, colorRamp);

        // Fake ao based on normal map
        float aoFactor = (pow(1. - dd, 8.) - 0.25);
        // Accuentuates cloud highlights
        aoFactor = mix(aoFactor, n.r, 0.25);
        // Deepen shadows, a lower smoothstep value deepens it
        aoFactor = smoothstep(0.1, 0.5, aoFactor);

        final.rgb = mix(final.rgb, outlineColor, aoFactor);

        float a = mask.r;

        if(a < eps) {
            discard;
        } 

        gl_FragColor = vec4(final, a);
    }
`);
