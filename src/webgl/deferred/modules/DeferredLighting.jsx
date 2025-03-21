import { useEffect } from 'react';

export const DeferredLighting = forwardRef(
  ({ bands = 2, ambient = 1, toon = true, specular = false }, ref) => {
    const { refDeferred } = useDeferredModule({
      name: 'DeferredLighting',
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

        
        uniform float uDeferredLighting_Bands;
        uniform float uDeferredLighting_Ambient;

        struct PointLightDeferred {
          vec3 position;
          vec3 color;
          float distance;
          float decay;
          float intensity;
          float alpha;
        };

        uniform PointLightDeferred pointLights[DEFERRED_PL_AMOUNT];

     

        #define saturate( a ) clamp( a, 0.0, 1.0 )
        float pow2( const in float x ) { return x*x; }
        vec3 pow2( const in vec3 x ) { return x*x; }
        float pow3( const in float x ) { return x*x*x; }
        float pow4( const in float x ) { float x2 = x*x; return x2*x2; }

        // from three.js lights_pars_begin.glsl
        float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

          // based upon Frostbite 3 Moving to Physically-based Rendering
          // page 32, equation 26: E[window1]
          // https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
          float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );

          if ( cutoffDistance > 0.0 ) {

            distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );

          }

          return distanceFalloff;

        }

        // float toonSteps = 2.;
      `,
        pass: phongShader,
      },
    });

    useEffect(() => {
      refDeferred.current.uniforms.uDeferredLighting_Ambient.value = ambient;
    }, [ambient]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredLighting_Bands.value = bands;
    }, [bands]);

    useEffect(() => {
      if (toon) {
        refDeferred.current.defines.DEFERRED_LIGHTING_TOON = 1;
      } else {
        delete refDeferred.current.defines.DEFERRED_LIGHTING_TOON;
      }
    }, [toon]);

    useEffect(() => {
      if (specular) {
        refDeferred.current.defines.DEFERRED_LIGHTING_SPECULAR = 1;
      } else {
        delete refDeferred.current.defines.DEFERRED_LIGHTING_SPECULAR;
      }
    }, [specular]);

    useImperativeHandle(
      ref,
      () => ({
        get ambient() {
          return refDeferred.current.uniforms.uDeferredLighting_Ambient.value;
        },
        set ambient(val) {
          refDeferred.current.uniforms.uDeferredLighting_Ambient.value = val;
        },
      }),
      [refDeferred]
    );

    return <></>;
  }
);

const phongShader = /*glsl*/ `
  // DOC: https://learnopengl.com/Advanced-Lighting/Deferred-Shading
  vec4 _tNormal = texture(tNormal, vUv);
  // vec3 Normal = _tNormal.rgb;
  vec3 Normal = normalDecode(_tNormal.rg);
  vec3 WorldPos = worldPosition.xyz;

  vec4 _tDiffuse = texture(tDiffuse, vUv);
  vec3 Diffuse = _tDiffuse.rgb;
  float Specular = _tDiffuse.a;

  vec3 eyeDir = vec3(0) - uCameraPosition;
  vec3 viewDir = normalize(uCameraPosition - WorldPos);

  // AMBIENT
  vec3 lighting = vec3(1.);
  float ambient = uDeferredLighting_Ambient;
  lighting *= ambient;
  // specular = vec3(0.0);

  
  
  for(int i = 0; i < DEFERRED_PL_AMOUNT; i++) {
      PointLightDeferred light = pointLights[i];
      
      vec3 lightVector = light.position - WorldPos;
      vec3 lightDir = normalize(lightVector);
      float lightDist = length(lightVector);

      float attenuation = getDistanceAttenuation(lightDist, light.distance, light.decay);

      // DIFFUSE
      // TODO: replace w cosine
      float normalFalloff = max(dot(Normal, lightDir), 0.0) * 0.5 + 0.5;
      // normalFalloff = 1.;
      // float ndotl = (max(dot(Normal, lightDir), 0.0) * 0.5 + 0.5);
      // ndotl = ndotl * ndotl;
      float lightIntensity = light.intensity * normalFalloff * attenuation;
      vec3 lightColor = light.color;
      
      
      // SPECULAR
      
      // vec3 specular = spec * lightColor;
      // specular += 

      // vec3 halfwayDir = normalize(lightDir + viewDir);
      // float spec = pow(max(dot(Normal, halfwayDir), 0.0), 16.0);
      // vec3 specular = lightColor * spec * Specular;
      // // vec3 fragmentColor = vec3(_UnlitColor); 

      // TOON   
      vec3 diffuse = vec3(lightIntensity);
      #ifdef DEFERRED_LIGHTING_TOON
        diffuse = quantizeColor(diffuse, uDeferredLighting_Bands);
        // specular = quantizeColor(specular, uDeferredLighting_Bands);
      #endif

      // ACCUMULATE
      // lighting += (diffuse + specular) * light.intensity;
      // FIXME: Only works for toon lighting
      lighting += (diffuse * light.color * light.alpha);
      
      // SPECULAR
      #ifdef DEFERRED_LIGHTING_SPECULAR
        vec3 reflectDir = reflect(-lightDir, Normal);  
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 10.);
        lighting = mix(lighting, vec3(1000.0), spec);
      #endif
  }

  
  // ao = step(0.85, ao);
  // float aoStepped = step(0.925, ao);
  // float aoStepped = step(0.85, ao);
  // lighting = mix(lighting * 0.75, lighting, aoStepped);
  // lighting = mix(lighting * 0.75, lighting, ao);
  

  pc_fragColor *= vec4(lighting, 1.0);

  // float diff = step(0.2, length(lighting - Diffuse.rgb));
  // float diff = length(lighting - Diffuse.rgb);
  // float dep = texture(tDepth, vUv).r;
  // pc_fragColor.rgb = vec3(dep);

  // DEBUG LIGHTING
  // float ss = step(vUv.x, 0.5);
  // pc_fragColor.rgb = mix(pc_fragColor.rgb, vec3(aoStepped), ss);
  
`;
