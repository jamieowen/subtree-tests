import {
  LoadingManager,
  DefaultLoadingManager,
  TextureLoader,
  WebGLRenderer,
} from 'three';

import {
  DRACOLoader,
  RGBELoader,
  GLTFLoader,
  MeshoptDecoder,
} from 'three-stdlib';
import { KTX2Loader, ktx2Loader } from '@/libs/three/KTX2Loader';

let renderer = new WebGLRenderer();

let decoderPath = '/libs/draco/';
let textureLoader = new TextureLoader();
let dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/libs/draco/gltf/');
dracoLoader.preload();

// let ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('/libs/basis/');
ktx2Loader.detectSupport(renderer);

let gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setKTX2Loader(ktx2Loader);

let hdrLoader = new RGBELoader();

let meshoptDecoder = MeshoptDecoder();
gltfLoader.setMeshoptDecoder(meshoptDecoder);

class ThreeLoader {
  static Events() {
    return Events;
  }

  constructor() {
    this._loader = {
      texture: textureLoader,
      gltf: gltfLoader,
      ktx2: ktx2Loader,
      hdr: hdrLoader,
    };
  }

  load_gltf_url = async (url, onProgress) => {
    return this._loadPromise(url, this._loader.gltf, onProgress);
  };

  load_texture_url = async (url, onProgress) => {
    return this._loadPromise(url, this._loader.texture, onProgress);
  };

  load_ktx2_url = async (url, onProgress) => {
    return this._loadPromise(url, this._loader.ktx2, onProgress);
  };

  load_hdr_url = async (url, onProgress) => {
    return this._loadPromise(url, this._loader.hdr, onProgress);
  };

  _loadPromise = (url, loader, onProgress) => {
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (asset) => {
          resolve(asset);
        },
        (event) => {
          if (onProgress) {
            onProgress(event);
          }
        },
        (err) => {
          console.log('error loading:', url);
          console.log(err);
          reject(err);
        }
      );
    });
  };
}

const threeLoader = new ThreeLoader();
export default threeLoader;
