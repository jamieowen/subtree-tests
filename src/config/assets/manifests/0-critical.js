import { ASSET_TYPES } from '@/services/AssetService/config';
import Env from '@/helpers/Env';

// **********************************************************************
// URLS
// **********************************************************************
export const fonts = {};

export const models = {};

export const textures = {
  // t_grain1: `/assets/textures-o/0_misc/grain1-hq.ktx2`,
  // t_grain2: `/assets/textures-o/0_misc/grain2-hq.ktx2`,
  t_noise_green: `/assets/textures-o/0_misc/noise-simplex-uastc.ktx2`,
  // t_noise_rough: `/assets/textures-o/0_misc/noise_rough-uastc.ktx2`,
};

export const sounds = {
  // sfx_bgm: '/assets/sounds-o/bgm.mp3',
};
export const urls = {
  ...fonts,
  ...models,
  ...textures,
  ...sounds,
};

// **********************************************************************
// MANIFEST
// **********************************************************************
export const manifest = {
  id: 'critical',
  items: [
    ...Object.entries(fonts).map(([id, url]) => ({ id, url })),
    ...Object.entries(models).map(([id, url]) => ({ id, url })),
    ...Object.entries(textures).map(([id, url]) => ({ id, url })),
    ...Object.entries(sounds).map(([id, url]) => ({ id, url })),
  ],
};
