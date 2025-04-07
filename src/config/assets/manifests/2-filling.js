import { ASSET_TYPES } from '@/services/AssetService/config';
import Env from '@/helpers/Env';
import { getUrlFloat, getUrlBoolean, getUrlString } from '@/helpers/UrlParam';

// **********************************************************************
// URLS
// **********************************************************************
export const fonts = {};

export const models = {};

export const textures = {
  t_filling_belt: `/assets/textures-o/2_filling/belt.ktx2`,
  t_filling_nozzle: `/assets/textures-o/2_filling/nozzle.ktx2`,
  t_filling_pour: `/assets/textures-o/2_filling/pour.ktx2`,

  t_filling_bottle_cap: `/assets/textures-o/2_filling/bottle/cap.ktx2`,
  t_filling_bottle_shadow: `/assets/textures-o/2_filling/bottle/shadow.ktx2`,
  t_filling_bottle_body: `/assets/textures-o/2_filling/bottle/body.ktx2`,
  t_filling_bottle_liquid: `/assets/textures-o/2_filling/bottle/liquid.ktx2`,
  t_filling_bottle_foam: `/assets/textures-o/2_filling/bottle/foam.ktx2`,
  t_filling_bottle_logo: `/assets/textures-o/2_filling/bottle/logo.ktx2`,
  t_filling_bottle_mask: `/assets/textures-o/2_filling/bottle/maskk.ktx2`,
};

export const jsons = {};

export const sounds = {
  sfx_interlude01: '/assets/sounds/2_filling/SFX_Interlude01.ogg',
  sfx_conveyer: '/assets/sounds/2_filling/SFX_Conveyer.ogg',
  sfx_spout01: '/assets/sounds/2_filling/SFX_Spout01.ogg',
  sfx_spout02: '/assets/sounds/2_filling/SFX_Spout02.ogg',
  sfx_spout03: '/assets/sounds/2_filling/SFX_Spout03.ogg',
  sfx_fillbottle01: '/assets/sounds/2_filling/SFX_FillBottle01.ogg',
  sfx_fillbottle02: '/assets/sounds/2_filling/SFX_FillBottle02.ogg',
  sfx_bottlecap: '/assets/sounds/2_filling/SFX_BottleCap.ogg',
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
  id: 'filling',
  items: [
    ...Object.entries(fonts).map(([id, url]) => ({ id, url })),
    ...Object.entries(models).map(([id, url]) => ({ id, url })),
    ...Object.entries(textures).map(([id, url]) => ({ id, url })),
    ...Object.entries(sounds).map(([id, url]) => ({ id, url })),
    ...Object.entries(jsons).map(([id, url]) => ({ id, url })),
  ],
};
