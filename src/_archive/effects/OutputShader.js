const OutputShader = {
  name: 'OutputShader',

  uniforms: {
    tDiffuse: { value: null },
    tWorldPos: { value: null },
    tNormal: { value: null },
    toneMappingExposure: { value: 1 },
  },

  vertexShader: /* glsl */ `
		// precision highp float;

		// uniform mat4 modelViewMatrix;
		// uniform mat4 projectionMatrix;

		// attribute vec3 position;
		// attribute vec2 uv;

		varying vec2 vUv;


		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `
	
		// precision highp float;

		uniform sampler2D tDiffuse;
		uniform sampler2D tWorldPos;
		uniform sampler2D tNormal;

		// #include <tonemapping_pars_fragment>
		// #include <colorspace_pars_fragment>

		varying vec2 vUv;

		// layout(location = 0) out vec4 pc_fragColor;
    layout(location = 1) out vec4 gNormal;
		layout(location = 2) out vec4 gWorldPos;
		// out vec4 pc_fragColor;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = texel;
			pc_fragColor = texel;
			gWorldPos = texture2D( tWorldPos, vUv );
			gNormal = texture2D( tNormal, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				pc_fragColor.rgb = LinearToneMapping( pc_fragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				pc_fragColor.rgb = ReinhardToneMapping( pc_fragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				pc_fragColor.rgb = OptimizedCineonToneMapping( pc_fragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				pc_fragColor.rgb = ACESFilmicToneMapping( pc_fragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				pc_fragColor.rgb = AgXToneMapping( pc_fragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				pc_fragColor.rgb = NeutralToneMapping( pc_fragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				pc_fragColor = sRGBTransferOETF( pc_fragColor );

			#endif


      

		}`,
};

export { OutputShader };
