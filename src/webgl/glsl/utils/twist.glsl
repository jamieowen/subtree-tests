
vec3 twist (vec3 p, float time, float factor) {
  float theta = sin( time + p.y ) / 2.0 * factor;
  float c = cos( theta );
  float s = sin( theta );
  mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );
  vec3 transformed = p * m;
  return transformed;
}
