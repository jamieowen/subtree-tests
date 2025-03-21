varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform sampler2D tBlurred;
uniform vec2 uResolution;
uniform vec2 uOffset;

// https://www.shadertoy.com/view/mtfBRr

void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    vec2 st = gl_FragCoord.xy / uResolution;

    gl_FragColor = vec4(color.rgb, 1.);
}
