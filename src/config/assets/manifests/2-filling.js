import { ASSET_TYPES } from '@/services/AssetService/config';
import Env from '@/helpers/Env';
import { getUrlFloat, getUrlBoolean, getUrlString } from '@/helpers/UrlParam';

// **********************************************************************
// URLS
// **********************************************************************
export const fonts = {};

export const models = {
  m_bottle_cap: `/assets/models-o/2_filling/cap.glb`,
};

export const images = {
  i_filling_intro: `/assets/images-next/filling-intro.webp`,
  i_filling_loop: `/assets/images-next/filling-loop.webp`,
  i_filling_result0: `/assets/images-next/filling-result/cap0.webp`,
  i_filling_result1: `/assets/images-next/filling-result/cap1.webp`,
  i_filling_result2: `/assets/images-next/filling-result/cap2.webp`,
  i_filling_result3: `/assets/images-next/filling-result/cap3.webp`,
  i_filling_result4: `/assets/images-next/filling-result/cap4.webp`,
  i_filling_result5: `/assets/images-next/filling-result/cap5.webp`,
};

export const textures = {
  // t_filling_nozzle: `/assets/textures-o/2_filling/nozzle.ktx2`,
  t_filling_belt: `/assets/textures-o/2_filling/belt/belt.ktx2`,
  t_filling_pour: `/assets/textures-o/2_filling/pour.ktx2`,
  t_filling_capping: `/assets/textures-o/2_filling/capping.ktx2`,

  t_filling_bottle_cap: `/assets/textures-o/2_filling/bottle/cap.ktx2`,
  t_filling_bottle_shadow: `/assets/textures-o/2_filling/bottle/shadow.ktx2`,
  t_filling_bottle_body: `/assets/textures-o/2_filling/bottle/body.ktx2`,
  t_filling_bottle_liquid: `/assets/textures-o/2_filling/bottle/liquid.ktx2`,
  t_filling_bottle_foam: `/assets/textures-o/2_filling/bottle/foam.ktx2`,
  t_filling_bottle_logo: `/assets/textures-o/2_filling/bottle/logo.ktx2`,
  t_filling_bottle_mask: `/assets/textures-o/2_filling/bottle/maskk.ktx2`,

  t_filling_line_horizontal: `/assets/textures-o/2_filling/lines/filling_line_horizontal-higher.ktx2`,
  t_filling_line_vertical: `/assets/textures-o/2_filling/lines/filling_line_vertical.ktx2`,
};

export const jsons = {};

export const sounds = {
  sfx_interlude01: '/assets/sounds-o/2_filling/SFX_Interlude01.aac',
  sfx_conveyer: '/assets/sounds-o/2_filling/SFX_Conveyer.aac',
  sfx_spout01: '/assets/sounds-o/2_filling/SFX_Spout01.aac',
  sfx_spout02: '/assets/sounds-o/2_filling/SFX_Spout02.aac',
  sfx_spout03: '/assets/sounds-o/2_filling/SFX_Spout03.aac',
  sfx_fillbottle01: '/assets/sounds-o/2_filling/SFX_FillBottle01.aac',
  sfx_fillbottle02: '/assets/sounds-o/2_filling/SFX_FillBottle02.aac',
  sfx_bottlecap: '/assets/sounds-o/2_filling/SFX_BottleCap.aac',
};

const videos = {
  v_filling: `/assets/videos/Tran1.mp4`,
  v_filling_bg: `/assets/videos/BG2.mp4`,
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
  id: 'filling',
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
