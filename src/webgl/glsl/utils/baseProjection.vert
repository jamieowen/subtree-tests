varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    vUv = uv;
    vWorldPos = vec3(modelMatrix * vec4(position, 1.0));
    vPosition = position;
    vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
}
