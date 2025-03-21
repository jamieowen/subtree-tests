import { RepeatWrapping, GLSL3, FloatType } from 'three';
import { GPUComputationRenderer } from './GPUComputationRenderer';

export const capitalize = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default class SimulatorClass {
  constructor(gl, width, height, variableData) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.variableData = variableData;
    this.gpuCompute = new GPUComputationRenderer(this.width, this.height, gl);

    this.generateVariables();

    const error = this.gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }
  }

  generateVariables() {
    Object.entries(this.variableData).map(([key, variable]) => {
      variable.name = key
        .split('_')
        .map((k) => capitalize(k))
        .join('_');

      this.setUpDynamicVariable(variable);
    });
    Object.values(this.variableData).forEach((variable) =>
      this.mapDependencies(variable)
    );
  }

  mapDependencies(variable) {
    if (!variable.dependencies) variable.dependencies = [];
    this.gpuCompute.setVariableDependencies(variable.instance, [
      variable.instance,
      ...variable.dependencies.map((d) => this.variableData[d].instance),
    ]);
  }

  setUpDynamicVariable(variable) {
    if (!variable.shader) {
      variable.shader = this.generateDefaultSimulationShader(variable.name);
    }

    variable.dt = this.gpuCompute.createTexture();

    const texture = variable.dt.image.data;

    if (variable.data) {
      variable.size = variable.data(0).length;

      for (let i = 0; i < texture.length; i += variable.size) {
        const [x, y, z, w] = variable.data(i);

        texture[i + 0] = x;
        texture[i + 1] = y;
        texture[i + 2] = z;
        texture[i + 3] = w;
      }
    }

    variable.instance = this.gpuCompute.addVariable(
      `texture${variable.name}`,
      variable.shader,
      // variable.dt
      variable.dt.clone()
    );

    variable.instance.wrapS = RepeatWrapping;
    variable.instance.wrapT = RepeatWrapping;
    variable.instance.glslVersion = GLSL3;
    variable.type = FloatType;

    if (this.gl.capabilities.isWebGL2 === false) {
      this.gpuCompute.setDataType(HalfFloatType);
      variable.type = HalfFloatType;
    }

    variable.instance.material.uniforms = {
      uTime: { value: 0 },
      uDelta: { value: 0 },
      ...variable.instance.material.uniforms,
      ...variable.uniforms,
      uDefaultTexture: {
        value: variable.dt.clone(),
        // value: variable.dt,
      },
    };
  }

  generateDefaultSimulationShader(name) {
    return /*glsl*/ `
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                vec4 self = texture2D(texture${name}, uv);    

                gl_FragColor = self;
            }
        `;
  }

  updateVariables(t, d) {
    if (!this.variableData) return;

    Object.values(this.variableData).forEach((variable) => {
      variable.instance.material.uniforms['uTime'].value = t;
      variable.instance.material.uniforms['uDelta'].value = d;
    });
  }

  compute(t, d) {
    this.updateVariables(t, d);
    this.gpuCompute.compute();
  }

  getCurrentTexture(name) {
    const variable = Object.values(this.variableData).find(
      (v) => v.name === name
    );

    if (!variable) return console.error(`Can't find variable ${name}`);

    this.gpuCompute.getCurrentRenderTarget(variable.instance).texture;
  }

  getTexture(name) {
    const variable = Object.values(this.variableData).find(
      (v) => v.name === name
    );

    if (!variable) return console.error(`Can't find variable ${name}`);

    return {
      current: this.gpuCompute.getCurrentRenderTarget(variable.instance)
        ?.texture,
      previous: this.gpuCompute.getAlternateRenderTarget(variable.instance)
        ?.texture,
    };
  }

  getRenderTarget(name) {
    const variable = Object.values(this.variableData).find(
      (v) => v.name === name
    );

    if (!variable) return console.error(`Can't find variable ${name}`);

    return {
      current: this.gpuCompute.getCurrentRenderTarget(variable.instance),
      previous: this.gpuCompute.getAlternateRenderTarget(variable.instance),
    };
  }

  getVariable(name) {
    const variable = Object.values(this.variableData).find(
      (v) => v.name === name
    );

    if (!variable) return console.error(`Can't find variable ${name}`);

    return variable;
  }

  getReferenceFloat32Array() {
    const ref = [];
    for (let iw = 0; iw < this.width; iw++) {
      for (let ih = 0; ih < this.height; ih++) {
        ref.push(iw / this.width, ih / this.height);
      }
    }
    return Float32Array.from(ref);
  }

  // TODO: remove as its in useSimulator
  applyToShader(shader) {
    const key = shader.userData ? 'userData' : 'uniforms';
    if (!shader.uniforms) shader.uniforms = {};
    shader[key]['uTime'] = { value: null };
    shader[key]['uDelta'] = { value: null };

    Object.values(this.variableData).forEach((variable) => {
      shader[key][`u${variable.name}Texture`] = { value: null };
      shader[key][`uPrev${variable.name}Texture`] = { value: null };
    });
  }

  updateShader(shader) {}

  dispose() {
    Object.values(this.variableData).map((variable) => {
      variable.dt.dispose();
      variable.instance.initialValueTexture.dispose();
      variable.instance.material.dispose();
      variable.instance.renderTargets.forEach((target) => {
        target.dispose();
      });
    });
    this.gpuCompute.dispose();
  }
}
