float zoomBlurRandom(vec3 scale,float seed) {
  return fract(sin(dot(gl_FragCoord.xyz+seed, scale)) * 43758.5453 + seed);
}

#define ZOOM_BLUR_LEVEL 10.

vec4 zoomBlur(sampler2D tex, vec2 st, vec2 center, float strength) {
  	vec4 color = vec4(0.0);

	float total = 0.0;
	vec2 toCenter = center - st;
	float offset = zoomBlurRandom(vec3(12.9898,78.233,151.7182),0.0);

	for (float t = 0.0; t <= ZOOM_BLUR_LEVEL; t++) {
		float percent = (t + offset) / ZOOM_BLUR_LEVEL;
		float weight = 4.0 * (percent - percent * percent);
		vec4 samp = texture2D(tex, st + toCenter * percent * strength);

		samp.rgb *= samp.a;
		color += samp * weight;
		total += weight;
	}

	vec4 o = color / total;
	o /= o.a + 0.00001;

	return o;
}