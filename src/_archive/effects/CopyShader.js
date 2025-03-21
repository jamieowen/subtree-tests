/**
 * Full-screen textured quad shader
 */

const CopyShader = {
  name: 'CopyShader',

  uniforms: {
    tDiffuse: { value: null },
    tWorldPos: { value: null },
    tNormal: { value: null },
    opacity: { value: 1.0 },
  },

  vertexShader: /* glsl */ `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		uniform float opacity;

		uniform sampler2D tDiffuse;
		uniform sampler2D tWorldPos;
		uniform sampler2D tNormal;

		varying vec2 vUv;

		// layout(location = 0) out vec4 pc_fragColor;
    layout(location = 1) out vec4 gNormal;
		layout(location = 2) out vec4 gWorldPos;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;

      pc_fragColor = opacity * texel;
			gWorldPos = texture2D( tWorldPos, vUv );
			gNormal = texture2D( tNormal, vUv );


		}`,
};

export { CopyShader };
