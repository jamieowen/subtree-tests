import { ASSET_TYPES } from '@/services/AssetService/config';
import Env from '@/helpers/Env';
import { getUrlFloat, getUrlBoolean, getUrlString } from '@/helpers/UrlParam';

// **********************************************************************
// URLS
// **********************************************************************
export const fonts = {};

export const models = {};

export const textures = {
  t_grouping_bottle: `/assets/textures-o/3_grouping/bottle.ktx2`, // TODO: Remove
  t_grouping_bottle_c: `/assets/textures-o/3_grouping/bottle-c.ktx2`,
  t_grouping_bottle_cc: `/assets/textures-o/3_grouping/bottle-cc.ktx2`,
  t_grouping_box: `/assets/textures-o/3_grouping/box.ktx2`,
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
  id: 'grouping',
  items: [
    ...Object.entries(fonts).map(([id, url]) => ({ id, url })),
    ...Object.entries(models).map(([id, url]) => ({ id, url })),
    ...Object.entries(textures).map(([id, url]) => ({ id, url })),
    ...Object.entries(sounds).map(([id, url]) => ({ id, url })),
    ...Object.entries(jsons).map(([id, url]) => ({ id, url })),
  ],
};
