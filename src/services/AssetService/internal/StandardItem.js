// import { ASSET_TYPE_CONFIG, guessLoaderTypeFromUrl } from '../config/assetType'

import AudioLoader from '../loaders/AudioLoader';
import ImageLoader from '../loaders/ImageLoader';
import ThreeLoader from '../loaders/ThreeLoader';
import FontLoader from '../loaders/FontLoader';
import VideoLoader from '../loaders/VideoLoader';
import JsonLoader from '../loaders/JsonLoader';
import XHRLoader from '../loaders/XHRLoader';
import { ASSET_TYPES } from '../config';
import EventEmitter from '@/helpers/EventEmitter';
import {
  EquirectangularReflectionMapping,
  LinearFilter,
  RepeatWrapping,
} from 'three';

/*
regExp
loader:  must be: function(url:String, onProgress:eventHandler) -returns 'load complete' promise
 */
export const ASSET_TYPE_CONFIG = {
  [ASSET_TYPES.OTHER]: {
    loader: XHRLoader.load_xhr_url,
    processor: (item, asset) => {},
  },

  // [ASSET_TYPES.JSON]: {
  //   regExp: /\.(json)$/i,
  //   loader: XHRLoader.load_xhr_url,
  //   processor: (item, asset) => {},
  // },
  [ASSET_TYPES.JSON]: {
    regExp: /\.(json)$/i,
    loader: JsonLoader.load_json,
    processor: (item, asset) => {},
  },

  [ASSET_TYPES.VIDEO]: {
    regExp: /\.(mp4|webm)$/i,
    argIsItem: true,
    loader: VideoLoader.load_video_item,
    processor: (item, asset) => {},
  },

  [ASSET_TYPES.FONT]: {
    regExp: /\.(ttf|woff|otf|woff2)$/i,
    argIsItem: true,
    loader: FontLoader.load_font_item,
    processor: (item, asset) => {},
  },

  [ASSET_TYPES.AUDIO]: {
    regExp: /\.(mp3|acc|wav|ogg|aac)$/i,
    argIsItem: true,
    loader: AudioLoader.load_audio_url,
    processor: (item, asset) => {},
  },

  // [ASSET_TYPES.IMAGE]: {
  //   regExp: /\.(jpg|png|gif|webp)$/i,
  //   loader: ImageLoader.load_image_url,
  //   processor: (item, asset) => {},
  // },

  [ASSET_TYPES.GLTF]: {
    regExp: /\.(gltf|glb)$/i,
    loader: ThreeLoader.load_gltf_url,
    processor: (item, asset) => {},
  },

  [ASSET_TYPES.TEXTURE]: {
    // regExp: /\.(jpg\?gl|bmp\?gl|png\?gl|gif\?gl|webp\?gl)$/i,
    regExp: /\.(jpg|png|gif|webp)$/i,
    loader: ThreeLoader.load_texture_url,
    processor: (item, asset) => {
      const o = item.options || {};
      if (o) {
        if (o.mipmap === false) {
          asset.magFilter = LinearFilter;
          asset.minFilter = LinearFilter;
          asset.needsUpdate = true;
        }
        if (o.magFilter) {
          asset.magFilter = o.magFilter;
        }
        if (o.minFilter) {
          asset.minFilter = o.minFilter;
        }
        if (o.wrapS) {
          asset.wrapS = o.wrapS;
        }
        if (o.repeat) {
          asset.repeat.set(o.repeat[0], o.repeat[1]);
        }

        // asset.flipY = !!o.flipY

        asset.needsUpdate = true;
      }
    },
  },

  [ASSET_TYPES.TEXTURE_KTX2]: {
    regExp: /\.(basis|ktx|ktx2)$/i,
    loader: ThreeLoader.load_ktx2_url,
    processor: (item, asset) => {
      const o = item.options || {};
      if (o) {
        if (o.mipmap === false) {
          asset.magFilter = LinearFilter;
          asset.minFilter = LinearFilter;
          asset.needsUpdate = true;
        }
        if (o.magFilter) {
          asset.magFilter = o.magFilter;
        }
        if (o.minFilter) {
          asset.minFilter = o.minFilter;
        }
        if (o.wrapS) {
          asset.wrapS = o.wrapS;
        }
        if (o.repeat) {
          asset.repeat.set(o.repeat[0], o.repeat[1]);
        }

        asset.needsUpdate = true;
      }
    },
  },

  [ASSET_TYPES.TEXTURE_HDR]: {
    regExp: /\.(hdr)$/i,
    loader: ThreeLoader.load_hdr_url,
    processor: (item, asset) => {
      asset.mapping = EquirectangularReflectionMapping;
    },
  },
};

export const guessLoaderTypeFromUrl = (url) => {
  const map = ASSET_TYPE_CONFIG;
  for (const k of Object.keys(map)) {
    if (map[k].regExp?.test(url)) {
      return k;
    }
  }

  return 'OTHER';
};

export const EVENTS = {
  ITEM_COMPLETE: 'ITEM_COMPLETE',
  ITEM_PROGRESS: 'ITEM_PROGRESS',
};

export class StandardItem {
  static get EVENTS() {
    return EVENTS;
  }

  get EVENTS() {
    return EVENTS;
  }

  /*
  item = asset-url |  {url:asset-url, type:asset-type, options:{} }
   */
  constructor(item) {
    Object.assign(this, EventEmitter);

    // detect viable url, type
    if (!this.constructor.isViableItem(item, true)) {
      return;
    }

    const url = typeof item === 'string' ? item : item.url || item.id;
    const type = item.type || guessLoaderTypeFromUrl(url);

    this.url = url;
    this.id = item.id || url;
    this.type = type;
    this.options = item.options || undefined;

    this.asset = null;

    this.totalBytes = 1;
    this.loadedBytes = 0;
    this.queued = false;
    this.started = false;
    this.complete = false;
  }

  get progress() {
    return this.complete
      ? 1
      : Math.min(this.loadedBytes / this.totalBytes, 0.99);
  }

  loadItem = () => {
    // console.log('StandardItem.loadItem', this.url);
    return new Promise((resolve, reject) => {
      if (this.asset) {
        resolve();
      }
      if (!this.started) {
        const o = ASSET_TYPE_CONFIG[this.type];
        this.started = true;
        const url = o.argIsItem ? this : this.url;
        o.loader(url, this.onLoadProgess).then((asset) => {
          this._setComplete(asset);
          resolve();
        });
      }
    });
  };

  onLoadProgess = (e) => {
    this.loadedBytes = e.loaded;
    this.totalBytes = e.total || e.loaded * 0.99;
    // console.log('StandardItem.onLoadProgress', this.url, this.progress);
    this.emit(EVENTS.ITEM_PROGRESS, this);
  };

  _setComplete = (asset) => {
    // console.log("StandardItem._setComplete", this.url);
    this.asset = asset;
    this.complete = true;
    ASSET_TYPE_CONFIG[this.type].processor(this, asset);
    this.emit(EVENTS.ITEM_COMPLETE, this);
  };

  // STATIC

  static getItemId(item, throwError = false) {
    const id = typeof item === 'string' ? item : item.id || item.url;
    if (!id && throwError) {
      console.error('no id provided in manifest item:', item);
    }
    return id;
  }

  static isViableItem(item, throwError = false) {
    const url = typeof item === 'string' ? item : item.url || item.id;
    if (!url) {
      if (throwError) {
        console.error('no url provided in manifest item:', item);
      }
      return false;
    }
    const type = item.type || guessLoaderTypeFromUrl(url);

    if (!type || !ASSET_TYPES[type]) {
      if (throwError) {
        console.log(
          'manifest item has unsupported type. check supported asset types. item:',
          item,
          type
        );
      }
      return false;
    }

    // console.log('StandardItem.isViableItem', item, url, type);

    return true;
  }
}

export default StandardItem;
