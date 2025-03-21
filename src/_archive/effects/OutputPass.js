import {
  ColorManagement,
  RawShaderMaterial,
  ShaderMaterial,
  UniformsUtils,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  AgXToneMapping,
  ACESFilmicToneMapping,
  NeutralToneMapping,
  SRGBTransfer,
  GLSL3,
} from 'three';
import { Pass, FullScreenQuad } from 'three-stdlib';
import { OutputShader } from './OutputShader';

class OutputPass extends Pass {
  constructor() {
    super();

    //

    const shader = OutputShader;

    this.uniforms = UniformsUtils.clone(shader.uniforms);

    this.material = new ShaderMaterial({
      name: shader.name,
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      // glslVersion: GLSL3,
    });

    this.fsQuad = new FullScreenQuad(this.material);

    // internal cache

    this._outputColorSpace = null;
    this._toneMapping = null;
  }

  render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
    this.uniforms.tDiffuse.value = readBuffer.textures[0];
    this.uniforms.tWorldPos.value = readBuffer.textures[1];
    this.uniforms.tNormal.value = readBuffer.textures[2];
    this.uniforms['toneMappingExposure'].value = renderer.toneMappingExposure;

    // rebuild defines if required

    if (
      this._outputColorSpace !== renderer.outputColorSpace ||
      this._toneMapping !== renderer.toneMapping
    ) {
      this._outputColorSpace = renderer.outputColorSpace;
      this._toneMapping = renderer.toneMapping;

      this.material.defines = {};

      if (ColorManagement.getTransfer(this._outputColorSpace) === SRGBTransfer)
        this.material.defines.SRGB_TRANSFER = '';

      if (this._toneMapping === LinearToneMapping)
        this.material.defines.LINEAR_TONE_MAPPING = '';
      else if (this._toneMapping === ReinhardToneMapping)
        this.material.defines.REINHARD_TONE_MAPPING = '';
      else if (this._toneMapping === CineonToneMapping)
        this.material.defines.CINEON_TONE_MAPPING = '';
      else if (this._toneMapping === ACESFilmicToneMapping)
        this.material.defines.ACES_FILMIC_TONE_MAPPING = '';
      else if (this._toneMapping === AgXToneMapping)
        this.material.defines.AGX_TONE_MAPPING = '';
      else if (this._toneMapping === NeutralToneMapping)
        this.material.defines.NEUTRAL_TONE_MAPPING = '';

      this.material.needsUpdate = true;
    }

    //

    if (this.renderToScreen === true) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear)
        renderer.clear(
          renderer.autoClearColor,
          renderer.autoClearDepth,
          renderer.autoClearStencil
        );
      this.fsQuad.render(renderer);
    }
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }
}

export { OutputPass };
export default OutputPass;
