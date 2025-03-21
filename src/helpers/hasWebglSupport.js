export const hasWebGlSupport = function () {
  try {
    const canvas = document.createElement('canvas');
    const has =
      !!window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    return !!has;
  } catch (e) {
    return false;
  }
};
