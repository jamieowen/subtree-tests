import * as critical from './manifests/0-critical';
import * as cleaning from './manifests/1-cleaning';
import * as filling from './manifests/2-filling';
import * as grouping from './manifests/3-grouping';

export const urls = {
  ...critical.urls,
  ...cleaning.urls,
  ...filling.urls,
  ...grouping.urls,
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
  ...cleaning.fonts,
  ...filling.fonts,
  ...grouping.fonts,
};
export const models = {
  ...critical.models,
  ...cleaning.models,
  ...filling.models,
  ...grouping.models,
};
export const textures = {
  ...critical.textures,
  ...cleaning.textures,
  ...filling.textures,
  ...grouping.textures,
};
export const sounds = {
  ...critical.sounds,
  ...cleaning.sounds,
  ...filling.sounds,
  ...grouping.sounds,
};

export const manifests = {
  critical: critical.manifest,
  cleaning: cleaning.manifest,
  filling: filling.manifest,
  grouping: grouping.manifest,
};

export {
  //
  critical,
  cleaning,
  filling,
  grouping,
};

export default {
  critical,
  cleaning,
  filling,
  grouping,
};
