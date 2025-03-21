import baseVert from '@/webgl/glsl/utils/baseProjection.vert';
import { urls } from '@/config/assets';
import { useFrame } from '@react-three/fiber';
import { RepeatWrapping } from 'three';

export default function CometTrail({ ...props }) {
  const tNoise = useTexture(urls.t_noise);
  tNoise.wrapS = tNoise.wrapT = RepeatWrapping;

  const shader = useMemo(
    () => ({
      vertexShader: baseVert,
      fragmentShader: /*glsl*/ `
        precision highp float;
        varying vec2 vUv;

        uniform sampler2D tNoise;
        uniform float uTime;

        layout (location = 1) out vec4 gNormal;
        layout (location = 2) out vec4 gWorldPos;

        vec3 blendNegation(vec3 base, vec3 blend) {
            return vec3(1.0)-abs(vec3(1.0)-base-blend);
        }
        vec3 blendPhoenix(vec3 base, vec3 blend) {
            return min(base, blend)-max(base, blend)+vec3(1.0);
        }
        vec3 blendPhoenix(vec3 base, vec3 blend, float opacity) {
            return (blendPhoenix(base, blend) * opacity + base * (1.0 - opacity));
        }

        float blendLinearDodge(float base, float blend) {
            return min(base+blend, 1.0);
        }
        vec3 blendLinearDodge(vec3 base, vec3 blend) {
            return min(base+blend, vec3(1.0));
        }
        vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
            return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
        }

        float blendLinearBurn(float base, float blend) {
            return max(base+blend-1.0, 0.0);
        }
        vec3 blendLinearBurn(vec3 base, vec3 blend) {
            return max(base+blend-vec3(1.0), vec3(0.0));
        }
        vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
            return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
        }

        float blendLinearLight(float base, float blend) {
            return blend<0.5?blendLinearBurn(base, (2.0*blend)):blendLinearDodge(base, (2.0*(blend-0.5)));
        }
        vec3 blendLinearLight(vec3 base, vec3 blend) {
            return vec3(blendLinearLight(base.r, blend.r), blendLinearLight(base.g, blend.g), blendLinearLight(base.b, blend.b));
        }
        vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
            return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
        }

        void main() {
            vec2 uv = vUv;

            // Step 1: Remap to -1 to 1
            vec2 remappedUV = vUv * 2.0 - 1.0;
            uv = abs(remappedUV);
            // Step 2: Absolute (+ square root bc thats whats shown in video?)
            uv = abs(mix(
                vec2(sqrt(uv.x), sqrt(uv.y)), 
                uv, 
                0.9
            ));
            
            // Step 3: Subtract x
            uv.x = uv.x -= 0.5;

            // Step 4: Vector maximum width 0
            uv = max(uv, vec2(0.0));

            // Step 5: Vector length
            float d = length(uv);
            //d = mix(d, sqrt(d), 0.25);

            // Step 6: Remap uv x to gradient (should be lighter)
            float gradientX = mix(0.1, .5, vUv.x);

            // Step 6: d - gradient
            // The shape should become a bit more defined here
            d -= gradientX;

            // Step 7: back to absolute node
            vec2 noiseUV = remappedUV;

            // Step 8: animate x offset, sample noise
            noiseUV.y *= 0.75;
            noiseUV.y += uTime * 0.5;
            noiseUV.x += uTime * 1.4;

            vec4 noise = texture2D(tNoise, noiseUV);

            // Step 9: factor map, remapped uv.x gradient
            float remappedX = mix(1., 0.3, vUv.x);
            
            // Step 10: linear light mix a, b
            // Option 1:
            // vec2 lightMix = remappedUV * noise.br;
            // vec3 lightMix = blendNegation(
            //     vec3(remappedUV, 0.),
            //     vec3(noise.rb, 0.)
            // );
            // Option 2: 
            // vec3 lightMix = blendPhoenix(
            //     vec3(remappedUV, 0.),
            //     vec3(noise.rb, 0.),
            //     remappedX
            // );

            vec3 lightMix = blendLinearLight(
                vec3(remappedUV, 0.),
                vec3(noise.rgb),
                remappedX
            );

            // Step 11: Result
            float flame = 1. - blendLinearDodge(length(lightMix), d);

            // Custom
            vec2 noiseUV2 = vUv;
            noiseUV2.x += uTime * 0.5;
            noiseUV2.y *= noise.r;
            vec4 noise2 = texture2D(tNoise, noiseUV2);
            flame = mix(flame, flame * noise2.r, remappedX);

            float layers = 2.;
            float shades = 4.;
            float gradient = fract(flame * layers);
            float shade = round(gradient * shades) / shades;
            
            float a = step(0.1, flame);
            if(a < 0.01) discard;

            vec3 color = mix(vec3(0.7, 0.2, 0.2), vec3(1.0, 1., 0.), mix(flame, shade, 1. - vUv.x));
            color = mix(color, vec3(1., 0., 0.), pow(1. - remappedX, 2.));

            pc_fragColor = vec4(color, a);

            gNormal = vec4(0.0, 0.0, 1.0, 1.0);
            gWorldPos = vec4(0.0, 0.0, 0.0, 1.0);
        }
    `,
      uniforms: {
        uTime: { value: 0 },
        tNoise: { value: tNoise },
      },
      transparent: true,
    }),
    []
  );

  useFrame(({ clock }) => {
    shader.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh rotation={[Math.PI / -2, 0, 0]}>
      <planeGeometry args={[4, 1]} />
      <shaderMaterial args={[shader]} />
    </mesh>
  );
}
