varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vEye;

void main() {
    vec4 fPos = vec4(position, 1.0);
    vec4 modelPos = modelMatrix * fPos;
    vec4 viewPos = viewMatrix * modelPos;

      

    gl_Position = projectionMatrix * viewPos;

    vUv = uv;
    // vWorldPos = modelPos.xyz;
    vWorldPos = position;
    vViewPosition = viewPos.xyz;
    vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
    vEye = viewPos.xyz;

    // vec3 r = reflect( vEye, vNormal );
    // float m = 2. * sqrt(
    //     pow( r.x, 2. ) +
    //     pow( r.y, 2. ) +
    //     pow( r.z + 1., 2. )
    // );
    // vN = r.xy / m + .5;
}
