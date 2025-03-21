
varying vec2 vUv;
varying float vProgress;
flat varying vec2 vReference;

uniform sampler2D tMask;

vec2 rotateUV(vec2 uv, float rotation)
{
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

void main() {


  // Darken
  csm_DiffuseColor.rgb -= smoothstep(0.8, 1.0, vProgress);

  // Mask
  vec4 mask = texture2D( tMask, vUv );
  float testA = mask.r;


  float testB = smoothstep(0.8, 1.0, vProgress) * 0.5;
  if (testA < testB) {
    discard;
  }

  // Out
  csm_DiffuseColor;


}
