import mergeFrag from '@/webgl/glsl/postprocessing/merge-fluid/merge-fluid.frag';
import vert from '@/webgl/glsl/utils/baseProjection.vert';
import { ShaderMaterial } from 'three';
import { FullScreenQuad, Pass } from 'three-stdlib';
import { smokeRT } from '../../../components/webgl/Smoke/Smoke';

export default class MergeFluidPass extends Pass {
  constructor(args) {
    super();

    this.material = new ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        tBlurred: { value: null },
        uResolution: {
          value: new Vector2(args.width, args.height),
        },
      },
      vertexShader: vert,
      fragmentShader: mergeFrag,
    });

    this.fsQuad = new FullScreenQuad(this.material);
    this.camera = args.camera;
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }

  render(renderer, writeBuffer, readBuffer) {
    this.material.uniforms.tDiffuse.value = readBuffer.texture;
    // const blurred = smokeRT.getState().RT;

    // this.material.uniforms.tToBlur.value = toBlur;
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
