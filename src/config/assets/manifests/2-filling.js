import { ASSET_TYPES } from '@/services/AssetService/config';
import Env from '@/helpers/Env';
import { getUrlFloat, getUrlBoolean, getUrlString } from '@/helpers/UrlParam';

// **********************************************************************
// URLS
// **********************************************************************
export const fonts = {};

export const models = {};

export const textures = {
  // t_filling_bottle: `/assets/textures-o/2_filling/bottle.ktx2`,
  t_filling_bottle25: `/assets/textures-o/2_filling/25.ktx2`,
  t_filling_bottle50: `/assets/textures-o/2_filling/50.ktx2`,
  t_filling_bottle75: `/assets/textures-o/2_filling/75.ktx2`,
  t_filling_bottle100: `/assets/textures-o/2_filling/100.ktx2`,
  t_filling_belt: `/assets/textures-o/2_filling/belt.ktx2`,
  t_filling_cap: `/assets/textures-o/2_filling/cap.ktx2`,
  t_filling_shadow: `/assets/textures-o/2_filling/shadow.ktx2`,
  t_filling_nozzle: `/assets/textures-o/2_filling/nozzle.ktx2`,
};

export const jsons = {};

export const sounds = {};

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
  id: 'filling',
  items: [
    ...Object.entries(fonts).map(([id, url]) => ({ id, url })),
    ...Object.entries(models).map(([id, url]) => ({ id, url })),
    ...Object.entries(textures).map(([id, url]) => ({ id, url })),
    ...Object.entries(sounds).map(([id, url]) => ({ id, url })),
    ...Object.entries(jsons).map(([id, url]) => ({ id, url })),
  ],
};
