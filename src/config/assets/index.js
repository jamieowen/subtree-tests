import * as critical from './manifests/0-critical';
import * as main from './manifests/1-main';

export const urls = {
  ...critical.urls,
  ...main.urls,
};

const objectFlip = (obj) => {
  const ret = {};
  Object.keys(obj).forEach((key) => {
    ret[obj[key]] = key;
  });
  return ret;
};

export const ids = objectFlip(urls);

export const fonts = {
  ...critical.fonts,
  ...main.fonts,
};
export const models = {
  ...critical.models,
  ...main.models,
};
export const textures = {
  ...critical.textures,
  ...main.textures,
};
export const sounds = {
  ...critical.sounds,
  ...main.sounds,
};

export const manifests = {
  critical: critical.manifest,
  main: main.manifest,
};

export {
  //
  critical,
  main,
};

export default {
  critical,
  main,
};
