import { ShaderMaterial } from 'three';
import normalVert from '@/webgl/glsl/normal/normal.vert';
import normalFrag from '@/webgl/glsl/normal/normal.frag';

const normalShader = {
  uniforms: {},
  vertexShader: normalVert,
  fragmentShader: normalFrag,
};

export const CustomNormalMaterial = new ShaderMaterial(normalShader);

export default CustomNormalMaterial;
