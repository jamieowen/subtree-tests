import { FullScreenQuad, Pass } from 'three-stdlib';
import { ShaderMaterial, GLSL3 } from 'three';
import noseFrag from '@/webgl/glsl/effects/nose.frag';
import noseVert from '@/webgl/glsl/effects/nose.vert';

export class NosePass extends Pass {
  constructor(args) {
    super();

    this.material = new ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        tWorldPos: { value: null },
        tNormal: { value: null },
        tDepth: { value: null },

        cameraNear: { value: null },
        cameraFar: { value: null },
        resolution: {
          value: new Vector2(args.width, args.height),
        },

        frequency: { value: 0.05 },
        amplitude: { value: 1.0 },
        time: { value: 0.0 },
      },
      vertexShader: noseVert,
      fragmentShader: noseFrag,
      glslVersion: GLSL3,
    });
    this.fsQuad = new FullScreenQuad(this.material);

    // this.depthRenderTarget = args.depthRenderTarget;
    // this.normalRenderTarget = args.normalRenderTarget;
    this.camera = args.camera;

    // this.depthTexture = new DepthTexture();

    // this.needsSwap = false;
    // this.clear = true;
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }

  render(renderer, writeBuffer, readBuffer) {
    this.material.uniforms.tDiffuse.value = readBuffer.textures[0];
    this.material.uniforms.tWorldPos.value = readBuffer.textures[1];
    this.material.uniforms.tNormal.value = readBuffer.textures[2];

    // this.material.uniforms.tDepth.value = readBuffer.depthTexture;

    this.material.uniforms.cameraNear.value = this.camera.near;
    this.material.uniforms.cameraFar.value = this.camera.far;

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
