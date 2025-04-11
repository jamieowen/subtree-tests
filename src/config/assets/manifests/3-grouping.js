import { ASSET_TYPES } from '@/services/AssetService/config';
import Env from '@/helpers/Env';
import { getUrlFloat, getUrlBoolean, getUrlString } from '@/helpers/UrlParam';

// **********************************************************************
// URLS
// **********************************************************************
export const fonts = {};

export const models = {};

export const images = {
  i_grouping_intro: `/assets/images-next/grouping-intro.webp`,
  i_grouping_loop: `/assets/images-next/grouping-loop.webp`,
  i_grouping_result: `/assets/images-next/grouping-result.webp`,
  i_ending: `/assets/images-next/ending.webp`,
};

export const textures = {
  t_grouping_bottle: `/assets/textures-o/3_grouping/bottle.ktx2`, // TODO: Remove
  t_grouping_bottle_c: `/assets/textures-o/3_grouping/bottle-c.ktx2`,
  t_grouping_bottle_cc: `/assets/textures-o/3_grouping/bottle-cc.ktx2`,
  t_grouping_box: `/assets/textures-o/3_grouping/box.ktx2`,
};

export const jsons = {};

export const sounds = {
  sfx_interlude02: '/assets/sounds-o/3_grouping/SFX_Interlude02.aac',
  sfx_cratecatch01: '/assets/sounds-o/3_grouping/SFX_CrateCatch01.aac',
  sfx_cratecatch02: '/assets/sounds-o/3_grouping/SFX_CrateCatch02.aac',
  sfx_cratecatch03: '/assets/sounds-o/3_grouping/SFX_CrateCatch03.aac',
  sfx_cratecatch04: '/assets/sounds-o/3_grouping/SFX_CrateCatch04.aac',
  sfx_cratecatch05: '/assets/sounds-o/3_grouping/SFX_CrateCatch05.aac',
};

const videos = {
  v_grouping: `/assets/videos/Tran2.mp4`,
  v_grouping_bg: `/assets/videos/BG3.mp4`,
  v_ending: `/assets/videos/OutroV2.mp4`,
};

export const urls = {
  ...fonts,
  ...images,
  ...models,
  ...textures,
  ...sounds,
  ...videos,
};

// **********************************************************************
// MANIFEST
// **********************************************************************
export const manifest = {
  id: 'grouping',
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
