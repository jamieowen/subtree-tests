// https://learnopengl.com/Getting-started/Coordinate-Systems

vec3 worldToNdc (vec3 worldPos, mat4 projectionMatrix, mat4 viewMatrix, float cameraNear, float cameraFar) {
  vec4 clipSpacePos = projectionMatrix * (viewMatrix * vec4(worldPos, 1.0));
  vec3 ndcSpacePos = clipSpacePos.xyz / clipSpacePos.w;
  ndcSpacePos.z /= cameraFar - cameraNear;
  return ndcSpacePos;
}