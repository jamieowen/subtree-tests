import numpy as np
import imageio
import os
from noise import pnoise3

def fbm(x, y, z, octaves, persistence, lacunarity, base=0):
    amplitude = 2.0
    frequency = 2.0
    max_value = 0
    total = 0
    for i in range(octaves):
        total += pnoise3(x * frequency, y * frequency, z * frequency, base=base) * amplitude
        max_value += amplitude
        amplitude *= persistence
        frequency *= lacunarity
    return total / max_value

def generate_fbm_volume(size, octaves=8, persistence=0.5, lacunarity=2.0):
    volume = np.zeros((size, size, size))
    base = 0

    for x in range(size):
        for y in range(size):
            for z in range(size):
                nx, ny, nz = x / size, y / size, z / size
                volume[x][y][z] = fbm(nx, ny, nz, octaves, persistence, lacunarity, base)

    # Normalize the volume (optional based on use case)
    volume = (volume - np.min(volume)) / (np.max(volume) - np.min(volume))
    return volume

# Create a directory for the output images if it does not exist
output_dir = 'fbm_images'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Generate a 64x64x64 fBm texture
size = 64
fbm_volume = generate_fbm_volume(size)

# Save slices as images (for visualization)
for i in range(size):
    image_path = os.path.join(output_dir, f'fbm_slice_{i}.png')
    imageio.imwrite(image_path, (fbm_volume[i] * 255).astype(np.uint8))

print(f"Images have been saved to {output_dir}/")
