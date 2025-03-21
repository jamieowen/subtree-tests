const FilmShader = {
  name: 'FilmShader',

  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
    intensity: { value: 0.5 },
    grayscale: { value: false },
  },

  vertexShader: /* glsl */ `

		out vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		#include <common>

		uniform float intensity;
		uniform bool grayscale;
		uniform float time;

		uniform sampler2D tDiffuse;
		uniform sampler2D tWorldPos;
		uniform sampler2D tNormal;


		in vec2 vUv;

		layout(location = 0) out vec4 pc_fragColor;
    	layout(location = 1) out vec4 gNormal;
		layout(location = 2) out vec4 gWorldPos;

		void main() {

			vec4 base = texture2D( tDiffuse, vUv );

			float noise = rand( fract( vUv + time ) );

			vec3 color = base.rgb + base.rgb * clamp( 0.1 + noise, 0.0, 1.0 );

			color = mix( base.rgb, color, intensity );

			if ( grayscale ) {

				color = vec3( luminance( color ) ); // assuming linear-srgb

			}

			pc_fragColor = vec4( color, base.a );
			gWorldPos = texture2D( tWorldPos, vUv );
			gNormal = texture2D( tNormal, vUv );

		}`,
};

export { FilmShader };
