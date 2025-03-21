# AssetService

multi-type asset manifest loader and asset provider service.

## Features

- simple manifests, with ability to add per asset configuration
- item/asset ids can be urls or other strings
- auto detect loader types via url extension  
  (texture load vs image load detected with url param eg: require("/img.jpg")+"?gl"
- manifests support multiple item types.
  - images (png, jpg, gif, webp)
  - textures(basis, png, jpg, gif)
  - audio (mp3, wav, ogg)
  - video (mp4, webm) -WIP
  - font (ttf, otf, woff, woff2) -WIP
  - three file formats (gltf, glb, bin, obj, hdr...)
  - **other manifests**
- can easily extend/add new loaders and new supported types/extensions
- can easily turn off loaders and supported types per project when not required
- separate apis for load triggers vs load listening.
  - can listen for mainfest-loaded, mainfest-progress from before a manifest is triggered to load

## Documentation

### Example

#### Basic

```js
import Assets from '@/services/MultiAssetService';
import { AUDIO, IMAGE, MY_MANIFEST } from '@/config/manifest';

Assets.subscribeManifestProgress(MY_MANIFEST, (manifest) => {
  this.progress = manifest.progress;
});

Assets.loadManifest(MY_MANIFEST).then(() => {
  const myAudio = Assets.getAsset(AUDIO.woof);
  myAudio.play();
  const myImage = Assets.getAsset(IMAGE.dog);
});

// per item loading

const result = await Assets.loadItem({
  id: 'my-image',
  url: require('@/assets/img/2.png'),
});

console.log(result.asset);
```

#### Sample Items/Ids/urls

```js
// can use simple urls
export const IMAGE = {
  dog: require('@/assets/imgs/dog.jpg'),
  cat: require('@/assets/imgs/cat.png'),
};

// can use per item configuration options
export const THREE_ITEMS = {
  [TEXTURE.BG_BLACK]: {
    id: TEXTURE.BG_BLACK,
    type: ASSET_TYPES.TEXTURE_BASIS,
    url: require('@/assets/gl/black.basis'),
    options: { flipY: true, mipmap: true },
  },

  // FOWL
  [GLTF.FOWL]: require('@/assets/gl/Fowl.glb'),
  [TEXTURE.ENV]: `${require('@/assets/gl/env.png')}?gl`, // "?gl" = auto detect texture vs image load
};
```

#### Sample Manifest

```js
// three
export const MANIFEST_THREE = {
  id: MANIFEST_ID.THREE,
  items: [
    THREE_ITEMS[TEXTURE.BG_BLACK],
    THREE_ITEMS[GLTF.FOWL],
    THREE_ITEMS[TEXTURE.ENV],
  ],
};

export const MANIFEST_MAIN = {
  id: MANIFEST_ID.MAIN,
  items: [
    // image
    IMAGE.dog,
    IMAGE.cat,

    // audio
    AUDIO.woof,
    AUDIO.meow,

    // three manifest
    MANIFEST_THREE,
  ],
};
```

#### Sample Load

```js
import MultiAssetService from '@/services/MultiAssetService';
import {
  MANIFEST_CRITICAL,
  MANIFEST_MAIN,
  MANIFEST_SECONDARY,
} from '@/config/manifest';

async function initApp() {
  await MultiAssetService.loadManifest(MANIFEST_CRITICAL);
  await MultiAssetService.loadManifest(MANIFEST_MAIN);
  await MultiAssetService.loadManifest(MANIFEST_SECONDARY);
}
```

## MultiAssetService

multi-type asset manifest loader and asset provider service.

### _Methods_

**loadManifest(manifest)** -> promise  
adds all items in the manifest to the active global load queue.  
note: manifests can be triggered to load multiple times, but will only load once.  
multiple manifests can have identical items, but the items will only load once.

**getAsset(id)**  
Get an asset by id . (for most cases ids=urls)

**getManifestLoaded( manifestOrId )** -> bool  
**getManifestProgress( manifestOrId )** -> (0>1)

**getItemLoaded( itemOrId )** -> bool  
**getItemProgress( itemOrId )** -> (0>1)

### _Abstracted Events_

use the abstracted event system where possible,  
designed for ease of use. can listen before items/manifests are load-triggered

**subscribeManifestLoaded( manifestOrId , callback)** -> unsubscribe()  
callback receives StandardManifest as event  
**subscribeManifestProgress( manifestOrId , handler)** -> unsubscribe()  
handler receives StandardManifest as event

**subscribeItemLoaded( itemOrId , callback)** -> unsubscribe()  
callback receives StandardItem as event  
**subscribeItemProgress( itemOrId , handler)** -> unsubscribe()  
handler receives StandardItem as event

### _Events_

ITEM_COMPLETE -> StandardItem  
ITEM_PROGRESS -> StandardItem ( use StandardItem.progress )

MANIFEST_COMPLETE -> StandardManifest  
MANIFEST_PROGRESS -> StandardManifest ( use StandardManifest.progress )

## Asset type support Configuration

src/services/MultiAssetService/config/assetType.js

#### _ASSET_TYPE_CONFIG_

add or remove/comment out entries in this object to enable/disable type support

#### Sample ASSET_TYPE_CONFIG

```js
export const ASSET_TYPE_CONFIG = {
  [ASSET_TYPES.AUDIO]: {
    regExp: /\.(mp3|acc|wav|ogg)$/i,
    loader: AudioLoader.load_audio_url,
    processor: (item, asset) => {},
  },
};
```

each **ASSET_TYPE_CONFIG** entry has:  
**regExp** - used to auto detect asset type  
**loader** - function used to load single item. function interface:

```
loader(url:string, onProgress:function({total:bytes, loaded:bytes})) -> promise
```

**processor** - function called after an asset has loaded  
 to enable any post-load configuration via manifest item options

```
processor((item: StandardItem), (asset: any))
```

**argIsItem** boolean, (optional), indicates loader takes item instead of url:

```
loader(item: StandardItem, onProgress:function) => promise
```

## Loaders

currently supported loaders found at  
src/services/MultiAssetService/loaders

## Manifests

for basic convention use
@/config/manifest.js

## Ids/Urls/Items

for basic convention use:  
@/services/MultiAssetService/config/url
audio.js, image.js..
