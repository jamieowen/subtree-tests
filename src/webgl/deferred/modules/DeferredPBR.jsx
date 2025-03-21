import { useEffect } from 'react';

export const DeferredPBR = forwardRef(
  ({ bands = 2, ambient = 1, toon = true, specular = false }, ref) => {
    const { refDeferred } = useDeferredModule({
      name: 'DeferredPBR',
      uniforms: {
        uDeferredLighting_Bands: {
          value: bands,
        },
        uDeferredLighting_Ambient: {
          value: ambient,
        },
        pointLights: {
          value: [
            {
              position: new Vector3(),
              color: new Color(),
              distance: 0,
              decay: 0,
              intensity: 0,
              alpha: 0,
            },
          ],
        },
      },
      defines: {
        DEFERRED_PL_AMOUNT: 1,
      },
      shaderChunks: {
        setup: /*glsl*/ `
            struct PointLightDeferred {
                vec3 position;
                vec3 color;
                float distance;
                float decay;
                float intensity;
                float alpha;
            };

            uniform float uDeferredLighting_Bands;
            uniform float uDeferredLighting_Ambient;
            uniform PointLightDeferred pointLights[DEFERRED_PL_AMOUNT];
            uniform mat3 normalMatrix;

            ${disneyPBRShader}

            vec3 orthogonal(vec3 v) {
                return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
            }
      `,
        pass: /*glsl*/ `
            vec4 _tNormal = texture(tNormal, vUv);
            // vec3 N = _tNormal.rgb;
            vec3 N = normalDecode(_tNormal.rg);
            vec3 V = normalize(uCameraPosition - worldPosition.xyz);
            // vec3 X = vec3(1, 0, 0); // Tangent vector (for anisotropy)
            // vec3 Y = vec3(0, 1, 0); // Bitangent vector (for anisotropy)
            // vec3 X = normalize(normalMatrix * vec3(1., 0., 0.));
            // vec3 Y = normalize(cross(N, X) * 1.0);
            // vec3 X = normalize(orthogonal(N));
            // vec3 Y = normalize(cross(N, X));

            // Calculate the derivatives of the fragment position with respect to screen space
            vec3 dPosdx = dFdx(worldPosition.xyz);
            vec3 dPosdy = dFdy(worldPosition.xyz);

            // Calculate the derivatives of the texture coordinates with respect to screen space
            vec2 dUVdx = dFdx(vUv);
            vec2 dUVdy = dFdy(vUv);

            // Calculate the tangent and bitangent
            vec3 tangent = normalize(dPosdx * dUVdy.t - dPosdy * dUVdx.t);
            vec3 bitangent = normalize(dPosdy * dUVdx.s - dPosdx * dUVdy.s);

            // Orthogonalize the tangent relative to the normal
            tangent = normalize(tangent - N * dot(N, tangent));
            bitangent = normalize(bitangent - N * dot(N, bitangent));

            vec3 lighting = pc_fragColor.rgb;

            for(int i = 0; i < DEFERRED_PL_AMOUNT; i++) {
              PointLightDeferred light = pointLights[i];

              vec3 L = normalize(light.position - worldPosition.xyz);
              vec3 lightColor = light.color * light.intensity;

              lighting += BRDF(L, V, N, tangent, bitangent) * lightColor;
            }

            pc_fragColor = vec4(lighting, 1.0);
            // pc_fragColor = vec4(V, 1.0);

        `,
      },
    });

    return null;
  }
);

const disneyPBRShader = /*glsl*/ `
  
  const float metallic = 0.2;
  const float subsurface = 2.9;
  const float specular = 0.;
  const float roughness = 1.;
  const float specularTint = 0.0;
  const float anisotropic = 1.0;
  const float sheen = 1.;
  const float sheenTint = .10;
  const float clearcoat = 0.1;
  const float clearcoatGloss = 0.1;

//   const float metallic = 0.34;
// const float subsurface = 0.5;
// const float specular = 0.2;
// const float roughness = 1.;
// const float specularTint = 0.2;
// const float anisotropic = 1.0;
// const float sheen = 0.5;
// const float sheenTint = 1.;
// const float clearcoat = 1.0;
// const float clearcoatGloss = 1.0;

  const float PI = 3.14159265358979323846;

  float sqr(float x) { return x * x; }

  float SchlickFresnel(float u) {
      float m = clamp(1.0 - u, 0.0, 1.0);
      float m2 = m * m;
      return m2 * m2 * m; // pow(m,5)
  }

  float GTR1(float NdotH, float a) {
      if (a >= 1.0) return 1.0 / PI;
      float a2 = a * a;
      float t = 1.0 + (a2 - 1.0) * NdotH * NdotH;
      return (a2 - 1.0) / (PI * log(a2) * t);
  }

  float GTR2(float NdotH, float a) {
      float a2 = a * a;
      float t = 1.0 + (a2 - 1.0) * NdotH * NdotH;
      return a2 / (PI * t * t);
  }

  float GTR2_aniso(float NdotH, float HdotX, float HdotY, float ax, float ay) {
      return 1.0 / (PI * ax * ay * sqr(sqr(HdotX / ax) + sqr(HdotY / ay) + NdotH * NdotH));
  }

  float smithG_GGX(float NdotV, float alphaG) {
      float a = alphaG * alphaG;
      float b = NdotV * NdotV;
      return 1.0 / (NdotV + sqrt(a + b - a * b));
  }

  float smithG_GGX_aniso(float NdotV, float VdotX, float VdotY, float ax, float ay) {
      return 1.0 / (NdotV + sqrt(sqr(VdotX * ax) + sqr(VdotY * ay) + sqr(NdotV)));
  }

  vec3 mon2lin(vec3 x) {
      return vec3(pow(x.r, 2.2), pow(x.g, 2.2), pow(x.b, 2.2));
  }

  vec3 BRDF(vec3 L, vec3 V, vec3 N, vec3 X, vec3 Y) {
      vec3 baseColor = vec3(1.);
      float NdotL = dot(N, L);
      float NdotV = dot(N, V);
      if (NdotL < 0.0 || NdotV < 0.0) return vec3(0.0);

      vec3 H = normalize(L + V);
      float NdotH = dot(N, H);
      float LdotH = dot(L, H);

      vec3 Cdlin = mon2lin(baseColor);
      float Cdlum = 0.3 * Cdlin.r + 0.6 * Cdlin.g + 0.1 * Cdlin.b; // luminance approx.

      vec3 Ctint = Cdlum > 0.0 ? Cdlin / Cdlum : vec3(1.0); // normalize lum. to isolate hue+sat
      vec3 Cspec0 = mix(specular * 0.08 * mix(vec3(1.0), Ctint, specularTint), Cdlin, metallic);
      vec3 Csheen = mix(vec3(1.0), Ctint, sheenTint);

      // Diffuse fresnel - go from 1 at normal incidence to 0.5 at grazing
      // and mix in diffuse retro-reflection based on roughness
      float FL = SchlickFresnel(NdotL), FV = SchlickFresnel(NdotV);
      float Fd90 = 0.5 + 2.0 * LdotH * LdotH * roughness;
      float Fd = mix(1.0, Fd90, FL) * mix(1.0, Fd90, FV);

      // Based on Hanrahan-Krueger BRDF approximation of isotropic BSSRDF
      // 1.25 scale is used to (roughly) preserve albedo
      // Fss90 used to "flatten" retroreflection based on roughness
      float Fss90 = LdotH * LdotH * roughness;
      float Fss = mix(1.0, Fss90, FL) * mix(1.0, Fss90, FV);
      float ss = 1.25 * (Fss * (1.0 / (NdotL + NdotV) - 0.5) + 0.5);

      // Specular
      float aspect = sqrt(1.0 - anisotropic * 0.9);
      float ax = max(0.001, sqr(roughness) / aspect);
      float ay = max(0.001, sqr(roughness) * aspect);
      float Ds = GTR2_aniso(NdotH, dot(H, X), dot(H, Y), ax, ay);
      float FH = SchlickFresnel(LdotH);
      vec3 Fs = mix(Cspec0, vec3(1.0), FH);
      float Gs;
      Gs = smithG_GGX_aniso(NdotL, dot(L, X), dot(L, Y), ax, ay);
      Gs *= smithG_GGX_aniso(NdotV, dot(V, X), dot(V, Y), ax, ay);

      // Sheen
      vec3 Fsheen = FH * sheen * Csheen;

      // Clearcoat (ior = 1.5 -> F0 = 0.04)
      float Dr = GTR1(NdotH, mix(0.1, 0.001, clearcoatGloss));
      float Fr = mix(0.04, 1.0, FH);
      float Gr = smithG_GGX(NdotL, 0.25) * smithG_GGX(NdotV, 0.25);

      return ((1.0 / PI) * mix(Fd, ss, subsurface) * Cdlin + Fsheen)
            * (1.0 - metallic)
            + Gs * Fs * Ds + 0.25 * clearcoat * Gr * Fr * Dr;
  }
`;
