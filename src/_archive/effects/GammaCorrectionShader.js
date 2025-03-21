/**
 * Gamma Correction Shader
 * http://en.wikipedia.org/wiki/gamma_correction
 */

const GammaCorrectionShader = {
  name: 'GammaCorrectionShader',

  uniforms: {
    tDiffuse: { value: null },
  },

  vertexShader: /* glsl */ `

		out vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		uniform sampler2D tDiffuse;

		in vec2 vUv;

		layout(location = 0) out vec4 pc_fragColor;
    layout(location = 1) out vec4 gNormal;
		layout(location = 2) out vec4 gWorldPos;

		void main() {

			vec4 tex = texture2D( tDiffuse, vUv );

			pc_fragColor = sRGBTransferOETF( tex );
			gNormal = vec4(0.0);
			gWorldPos = vec4(0.0);
			// pc_fragColor = gl_FragColor;

		}`,
};

export { GammaCorrectionShader };
