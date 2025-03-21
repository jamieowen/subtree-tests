varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldPos;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vWorldPos = vec3(modelMatrix * vec4(position, 1.0));
  vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  
  gl_Position = vec4( position, 1.0 );
}
