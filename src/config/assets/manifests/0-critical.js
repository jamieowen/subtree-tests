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
  mx_introvideo: '/assets/sounds/0_critical/MX_IntroVideo.ogg',
  sfx_introvideo: '/assets/sounds/0_critical/SFX_IntroVideo.ogg',
  sfx_buttonclick: '/assets/sounds/0_critical/SFX_ButtonClick.ogg',

  mx_gameloop: '/assets/sounds/0_critical/MX_GameLoop.ogg',
  sfx_countdown: '/assets/sounds/0_critical/SFX_Countdown.ogg',
  sfx_start: '/assets/sounds/0_critical/SFX_Start.ogg',

  sfx_pointget: '/assets/sounds/0_critical/SFX_PointGet.ogg',
  sfx_showresult: '/assets/sounds/0_critical/SFX_ShowResult.ogg',
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
