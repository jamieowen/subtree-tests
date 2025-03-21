export const MaterialModuleFresnel = memo(
  ({ intensity = 1, color = 0xffffff }) => {
    const { material } = useMaterialModule({
      name: 'MaterialModuleFresnel',
      uniforms: {
        uFresnelColor: { value: new Color(color) },
        uFresnelIntensity: { value: intensity },
      },
      vertexShader: {
        setup: /*glsl*/ `
          varying vec3 vEye;
        `,
        main: /*glsl*/ ` 
          vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          vEye = normalize(worldPos - cameraPosition);
          vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
        `,
      },
      fragmentShader: {
        setup: /*glsl*/ `
            uniform vec3 uFresnelColor;
            uniform float uFresnelIntensity;

            varying vec3 vEye;
        `,
        main: /*glsl*/ `
            float fresnelPower = 2.;
            float fresnelTerm = pow((1.0 - -min(dot(vEye, normalize(vNormal)), 0.0)), fresnelPower) * uFresnelIntensity;

            vec3 final = mix(pc_fragColor.rgb, uFresnelColor, fresnelTerm);

            pc_fragColor.rgb = final;
        `,
      },
    });

    return null;
  }
);
