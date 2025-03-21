import blurFrag from '@/webgl/glsl/postprocessing/merge-fluid/blur-pass.frag';
import vert from '@/webgl/glsl/utils/baseProjection.vert';
import { ShaderMaterial } from 'three';
import { FullScreenQuad, Pass } from 'three-stdlib';
import { smokeRT } from '../../../components/webgl/Smoke/Smoke';

export default class BlurPass extends Pass {
  constructor(args) {
    super();

    this.material = new ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },

        tToBlur: { value: null },
        tToBlurPrev: { value: null },
        // uNear: { value: null },
        // uFar: { value: null },
        uTime: { value: 0 },
        uResolution: {
          value: new Vector2(args.width, args.height),
        },
      },
      vertexShader: vert,
      fragmentShader: blurFrag,
    });

    this.fsQuad = new FullScreenQuad(this.material);
    this.camera = args.camera;
    this.renderToScreen = false;
    this.tNoise = args.tNoise;
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }

  render(renderer, writeBuffer, readBuffer) {
    this.material.uniforms.tDiffuse.value = readBuffer.texture;

    const { RTCurr, RTPrev } = smokeRT.getState();

    this.material.uniforms.tToBlur.value = RTCurr;
    this.material.uniforms.tToBlur.value = RTCurr;

    this.material.uniforms.tToBlurPrev.value = RTPrev;
    // this.material.uniforms.uNear.value = this.camera.near;
    // this.material.uniforms.uFar.value = this.camera.far;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }
}
