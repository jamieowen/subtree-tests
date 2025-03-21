export const vertexShader = (total) => /* glsl */ `
    #define TOTAL_SHELLS ${total}.

    varying vec2 vUv;
    varying float vShellIndex;
    varying vec3 vNormal;
    varying vec4 vNoise;

    attribute float shellIndex;

    uniform float uTime;
    uniform sampler2D tNoise;

    void main() {
        
        float shellId = shellIndex / TOTAL_SHELLS;
        vec3 transformed = position;

        vec2 cUv = transformed.xy * 0.1;
        cUv.x += uTime * 0.25;
        vec4 n = texture2D(tNoise, cUv);

        float wind = n.r;

        float shellLength = 0.005;
        transformed += normal * shellLength * shellIndex;

        float curvature = 0.5;
        float k = pow(shellIndex, curvature);
        
        vec3 shellDirection = mix(vec3(-1., 0., 0.), n.rgb, wind);
        float displacementStrength = wind * 0.1;
        
        transformed += shellDirection * k * displacementStrength;

        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);

        vUv = uv;
        vShellIndex = shellIndex;
        vNormal = normalize(normalMatrix * normal);
        vNoise = n;
    }
`;

export const fragmentShader = (total) => /* glsl */ `
    #define TOTAL_SHELLS ${total}.

    uniform float uTime;
    uniform sampler2D tNoise;

    varying vec2 vUv;
    varying float vShellIndex;
    varying vec3 vNormal;
    varying vec4 vNoise;

    layout(location = 0) out vec4 fragColor;
    layout(location = 1) out vec4 worldPos;

    float saturate(float x) {
        return clamp(x, 0., 1.);
    }

    highp float random(highp vec2 coords) {
          return fract(sin(dot(coords, vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
        float wind = vNoise.r;
        // base on how much away from camera
        float density = 500.;
        float shellCount = TOTAL_SHELLS * 2.;

        vec2 newUV = vUv * density;

        // Center local UV
        vec2 localUV = fract(newUV) * 2. - 1.;

        float localDistanceFromCenter = length(localUV);
        float rand = random(floor(newUV));

        vec4 nn = texture2D(tNoise, vUv);
        float thickness = nn.r * 2.;
        
        float height = vShellIndex / shellCount;

        int outsideThickness = int(localDistanceFromCenter > (thickness * (rand - height)));

        if(outsideThickness == 1 && vShellIndex > 0.) discard;

        // vec3 lightPos = vec3(1., 1., 1.);
        vec3 lightPos = vNoise.rgb;
        float ndotl = saturate(dot(vNormal, normalize(lightPos))) * 0.5 + 0.5;
        ndotl = ndotl * ndotl;

        vec3 col = vec3(1., 0.5, 0.4);

        float occlusionBias = 0.6;
        float attenuation = wind;

        float ao = pow(height, attenuation);
        ao = saturate(ao) + occlusionBias;

        vec3 final = col * ao * ndotl;

        fragColor = vec4(final, 1.);
        worldPos = vec4(vNoise.rgb, 1.);
        // gl_FragColor = vec4(vNoise.rgb, 1.);
    }
`;
