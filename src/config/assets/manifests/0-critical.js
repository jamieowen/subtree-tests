import { ASSET_TYPES } from '@/services/AssetService/config';
import Env from '@/helpers/Env';

// **********************************************************************
// URLS
// **********************************************************************
export const fonts = {};

export const models = {};

export const images = {
  i_cleaning_intro: `/assets/images-next/cleaning-intro.webp`,
};

export const textures = {
  // t_grain1: `/assets/textures-o/0_misc/grain1-hq.ktx2`,
  // t_grain2: `/assets/textures-o/0_misc/grain2-hq.ktx2`,
  t_noise_green: `/assets/textures-o/0_misc/noise-simplex-uastc.ktx2`,
  // t_noise_rough: `/assets/textures-o/0_misc/noise_rough-uastc.ktx2`,
};

export const sounds = {
  mx_introvideo: '/assets/sounds-o/0_critical/MX_IntroVideo.aac',
  sfx_introvideo: '/assets/sounds-o/0_critical/SFX_IntroVideo.aac',
  sfx_buttonclick: '/assets/sounds-o/0_critical/SFX_ButtonClick.aac',

  mx_gameloop: '/assets/sounds-o/0_critical/MX_GameLoop.aac',
  sfx_countdown: '/assets/sounds-o/0_critical/SFX_Countdown.aac',
  sfx_start: '/assets/sounds-o/0_critical/SFX_Start.aac',

  sfx_pointget: '/assets/sounds-o/0_critical/SFX_PointGet.aac',
  sfx_showresult: '/assets/sounds-o/0_critical/SFX_ShowResult.aac',
};

export const urls = {
  ...fonts,
  ...models,
  ...images,
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
    ...Object.entries(images).map(([id, url]) => ({ id, url })),
    ...Object.entries(textures).map(([id, url]) => ({ id, url })),
    ...Object.entries(sounds).map(([id, url]) => ({ id, url })),
  ],
};
