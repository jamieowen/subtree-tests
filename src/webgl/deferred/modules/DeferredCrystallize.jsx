//import baseVert from '@/webgl/glsl/utils/baseProjection.vert';
// import { useEffect } from 'react';
// import {
//   ClampToEdgeWrapping,
//   Data3DTexture,
//   FloatType,
//   LinearFilter,
//   RedFormat,
// } from 'three';

// import { backFBO } from '../../objects/Monolith';
// import { perlin3 } from '../../utils/perlin';

// import cnoise from '@/webgl/glsl/lygia/generative/cnoise.glsl';
// import { useFrame } from '@react-three/fiber';

// export const DeferredCrystallize = forwardRef((_, ref) => {
//   const tVolume = suspend(async () => {
//     const size = 128;
//     const width = size;
//     const height = size;
//     const depth = size;

//     const data = new Float32Array(width * height * depth);
//     generatePerlin(data, width, height, depth);

//     const tVolume = new Data3DTexture(data, width, height, depth);
//     tVolume.format = RedFormat;
//     tVolume.type = FloatType;
//     tVolume.minFilter = LinearFilter;
//     tVolume.magFilter = LinearFilter;
//     tVolume.wrapS = ClampToEdgeWrapping;
//     tVolume.wrapT = ClampToEdgeWrapping;

//     tVolume.unpackAlignment = 1;

//     tVolume.needsUpdate = true;

//     return tVolume;
//   }, []);

//   const { refDeferred } = useDeferredModule({
//     name: 'DeferredCrystallize',
//     uniforms: {
//       tBack: {
//         value: null,
//       },
//       tVolume: {
//         value: tVolume,
//       },
//     },
//     shaderChunks: {
//       setup: /*glsl*/ `
//         precision highp float;
//         precision highp sampler3D;

//         uniform sampler2D tBack;
//         uniform sampler3D tVolume;

//         ${cnoise}

//         float map( in vec3 p ){
//           return texture(tVolume, p).r;
//           // return cnoise(p);
//         }

//         float applySoftLightToChannel( float base, float blend ) {
//           return ((blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend)));
//         }
//         vec4 softLight(vec4 base, vec4 blend) {
//           vec4 soft = vec4(
//             applySoftLightToChannel( base.r, blend.r ),
//             applySoftLightToChannel( base.g, blend.g ),
//             applySoftLightToChannel( base.b, blend.b ),
//             applySoftLightToChannel( base.a, blend.a )
//           );
//           return soft;
//         }

//         vec3 gammaCorrect(vec3 col) {
//     return pow(col, vec3(.4545));
//         }
//       `,
//       pass: /*glsl*/ `
//           float bb = 10.;
//           //float bb = 3.5;
//           vec3 boundingBox = vec3(bb);
//           float d = sqrt(bb * bb * bb);
//           //float d = pow(length(uv - vec2(0.5)), 10.);

//           vec4 front = texture(tWorldPos, uv);
//           vec4 back = texture(tBack, uv);
//           vec4 normal = texture(tNormal, uv);

//           vec3 dir = back.xyz - front.xyz;
//           float ld = length(dir);

//           dir = refract(dir, normalize(normal.xyz), .2);
//           dir = normalize(dir);

//           vec3 fStep = .01 * dir / (ld / d);
//           // fStep += .001 *noise(gl_FragCoord.xy);
//           float n = 0.;
//           vec3 p = back.xyz;

//           float t = 0.;
//           for(int i=0; i< 200; i++){
//             float dd = length(p.xyz - front.xyz);

//             if(dd > ld) {
//               break;
//             }

//             p = front.xyz + float(i) * fStep;
//             float v = map(p / boundingBox + 1.25 / boundingBox);
//             v = clamp(v, 0., 1.);
//             n += smoothstep(.25, .75, v) / 2.;
//             n += v;

//             t += 0.01;
//             n -=.01;
//           }
//           n /= d;

//           n *= 1. - smoothstep(.5, 1., ld / d);
//           n *= 4.;

//           vec4 diffuse = texture(tDiffuse, uv);
//           float a = clamp(ld,0.,1.);

//           float mask = step(0.01, a);

//           // vec3 darkColor = vec3(1., 0., 0.);
//           vec3 darkColor = vec3(0.761, 0.255, 0.169);
//           // vec3 darkColor = vec3(0, 0.745, 0.839);
//           //vec3 lightColor = vec3(0.,0., 1.);
//           // vec3 lightColor = vec3(0.278, 0.098, 0.0784
//           vec3 lightColor = vec3(0.439, 1, 0.871);

//           vec3 final = mix(darkColor, lightColor, n);
//           final.rgb += vec3( ld/10.);
//           final.rgb += .5 *color.rgb * a;
//           float rim = clamp(1. - .5 * ld, 0., 1.);
//           //float rim = smoothstep(.5,1.,(1.-ld));
//           //
//           final.rgb += lightColor * rim * a;
//           final.rgb = mix(vec3(0.), final.rgb, a);

//           final.rgb = softLight(vec4(final, 1.), diffuse).rgb;
//           pc_fragColor.rgb = mix(diffuse.rgb, final, mask);

//           // pc_fragColor.rgb = vec3(front.rgb);

//       `,
//     },
//   });

//   // const FBO = backFBO();

//   // useEffect(() => {
//   //   if (!FBO) return;
//   //   console.log(FBO);
//   //   refDeferred.current.uniforms.tBack.value = FBO.textures[2];
//   // }, [FBO]);
//   useFrame(() => {
//     if (!backFBO.getState()) return;

//     refDeferred.current.uniforms.tBack.value = backFBO.getState().textures[0];
//   }, 0);

//   useImperativeHandle(
//     ref,
//     () => {
//       return refDeferred.current;
//     },
//     [refDeferred]
//   );

//   return <></>;
// });
