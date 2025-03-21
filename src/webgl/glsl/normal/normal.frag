varying vec3 vNormal;

void main() {
  vec3 color = vec3(vNormal);

  gl_FragColor = vec4(color, 1.0);
}
