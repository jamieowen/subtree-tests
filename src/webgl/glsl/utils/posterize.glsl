vec4 posterize (vec4 color, float gamma, float numColors) {
  vec3 c = pow(color.rgb, vec3(gamma, gamma, gamma));
  c = c * numColors;
  c = floor(c);
  c = c / numColors;
  c = pow(c, vec3(1.0/gamma));
  return vec4(c, 1.0);
}