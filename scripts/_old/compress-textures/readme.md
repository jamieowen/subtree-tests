# compress-textures

## Texture compressor utility

Compresses all .jpg and .png images to .basis to .basis and .ktx pvrtc.

## Installation

### Basis cli

Dependencies

```
brew install cmake
brew install ffmpeg
```

Installing Basis Universal

```
cd scripts/assets/compress-textures
git clone https://github.com/BinomialLLC/basis_universal
cd basis_universal
cmake CMakeLists.txt
make
```

Copying basisu to the global programs folder (on MacOS)

```
cp bin_osx/basisu
mv bin_osx/basisu /usr/local/bin
```

### Ktx cli

```
npm install texture-compressor -g
```

## Usage

Compress all images in a folder. The compressed files will be at the same folder than the original ones.

```
node index.js [root_folder]
```

A match string can be provided as a third argument. When provided, only file names that match it, will be compressed.

```
node index.js [root_folder][match_string]
```

### Scale images

Create half-size versions of images.

```
node scale.js [root_folder] [match_string]
```

### Image Data

Here you can find another utility to export image data (it is, the sizes) from a full folder.
When compressing textures, they are re-sized to fit compressed texture needs.
Original image data is sometimes needed.

```
node scripts/assets/compress-textures/sizes-map.js [images_source_folder] [json_target_folder]
```

```
node scripts/assets/compress-textures/sizes-map.js public/img src/core
```

Will create a file `src/core/data.json` where file names are mapped to image data.
