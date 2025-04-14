import { ASSET_TYPES } from '@/services/AssetService/config';
import Env from '@/helpers/Env';
import { getUrlFloat, getUrlBoolean, getUrlString } from '@/helpers/UrlParam';

// **********************************************************************
// URLS
// **********************************************************************
export const fonts = {};

export const models = {};

export const images = {
  i_cleaning_loop: `/assets/images-next/cleaning-loop.webp`,
  i_cleaning_result: `/assets/images-next/cleaning-result2.webp`,
};

export const textures = {
  // j_bottle_0: `/assets/spritesheets-o/cleaning_bottle/data-0.json`,
  // t_bottle_0: `/assets/spritesheets-o/cleaning_bottle/data-0.ktx2`,
  t_cleaning_bottle: `/assets/textures-o/1_cleaning/cleaning_bottle.ktx2`,
  t_cleaning_nozzle: `/assets/textures-o/1_cleaning/cleaning_nozzle.ktx2`,

  t_hanger_railback: `/assets/textures-o/1_cleaning/HangerRailback.ktx2`,
  t_hanger_railfront: `/assets/textures-o/1_cleaning/HangerRailFront.ktx2`,
  t_hanger_back: `/assets/textures-o/1_cleaning/HangerSingleBack.ktx2`,
  t_hanger_front: `/assets/textures-o/1_cleaning/HangerSinglefront.ktx2`,
};

export const jsons = {};

export const sounds = {
  sfx_dragscreen: '/assets/sounds-o/1_cleaning/SFX_DragScreen.aac',
  sfx_washbottle01: '/assets/sounds-o/1_cleaning/SFX_WashBottle01.aac',
  sfx_washbottle02: '/assets/sounds-o/1_cleaning/SFX_WashBottle02.aac',
  sfx_washbottle03: '/assets/sounds-o/1_cleaning/SFX_WashBottle03.aac',
};

const videos = {
  v_cleaning_bg: `/assets/videos/BG1.mp4`,
};

export const urls = {
  ...fonts,
  ...models,
  ...images,
  ...textures,
  ...sounds,
  ...videos,
};

// **********************************************************************
// MANIFEST
// **********************************************************************
export const manifest = {
  id: 'cleaning',
  items: [
    ...Object.entries(fonts).map(([id, url]) => ({ id, url })),
    ...Object.entries(models).map(([id, url]) => ({ id, url })),
    ...Object.entries(images).map(([id, url]) => ({ id, url })),
    ...Object.entries(textures).map(([id, url]) => ({ id, url })),
    ...Object.entries(sounds).map(([id, url]) => ({ id, url })),
    ...Object.entries(jsons).map(([id, url]) => ({ id, url })),
    ...Object.entries(videos).map(([id, url]) => ({ id, url })),
  ],
};
