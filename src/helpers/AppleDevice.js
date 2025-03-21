const models = [
  // 13
  {
    type: 'iphone',
    family: '13',
    model: 'iphone13',
    width: 1170,
    height: 2532,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: '13',
    model: 'iphone13mini',
    width: 1080,
    height: 2340,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: '13',
    model: 'iphone13promax',
    width: 1284,
    height: 2778,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: '13',
    model: 'iphone13pro',
    width: 1170,
    height: 2532,
    pixelRatio: 3,
  },

  // 12
  {
    type: 'iphone',
    family: '12',
    model: 'iphone12',
    width: 1170,
    height: 2532,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: '12',
    model: 'iphone12mini',
    width: 1080,
    height: 2340,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: '12',
    model: 'iphone12promax',
    width: 1284,
    height: 2778,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: '12',
    model: 'iphone12pro',
    width: 1170,
    height: 2532,
    pixelRatio: 3,
  },

  // // SE2
  // {
  //   type: 'iphone',
  //   family: 'se',
  //   model: 'iphonese2',
  //   width: 750,
  //   height: 1334,
  //   pixelRatio: 2,
  // },

  // 11
  {
    type: 'iphone',
    family: '11',
    model: 'iphone11promax',
    width: 1242,
    height: 2688,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: '11',
    model: 'iphone11pro',
    width: 1125,
    height: 2436,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: '11',
    model: 'iphone11',
    width: 828,
    height: 1792,
    pixelRatio: 2,
  },

  // XR
  {
    type: 'iphone',
    family: 'xr',
    model: 'iphonexr',
    width: 828,
    height: 1792,
    pixelRatio: 2,
  },

  // XS
  {
    type: 'iphone',
    family: 'xs',
    model: 'iphonexsmax',
    width: 1242,
    height: 2688,
    pixelRatio: 3,
  },
  {
    type: 'iphone',
    family: 'xs',
    model: 'iphonexs',
    width: 1125,
    height: 2436,
    pixelRatio: 3,
  },

  // X
  {
    type: 'iphone',
    family: 'x',
    model: 'iphonex',
    width: 1125,
    height: 2436,
    pixelRatio: 3,
  },

  // 8
  // {
  //   type: 'iphone',
  //   family: '8',
  //   model: 'iphone8plus',
  //   width: 1080,
  //   height: 1920,
  //   pixelRatio: 3,
  // },
  // {
  //   type: 'iphone',
  //   family: '8',
  //   model: 'iphone8',
  //   width: 750,
  //   height: 1334,
  //   pixelRatio: 2,
  // },

  // // 7
  // {
  //   type: 'iphone',
  //   family: '7',
  //   model: 'iphone7plus',
  //   width: 1242,
  //   height: 2208,
  //   pixelRatio: 3,
  // },
  // {
  //   type: 'iphone',
  //   family: '7',
  //   model: 'iphone7',
  //   width: 750,
  //   height: 1334,
  //   pixelRatio: 2,
  // },

  // // SE 1
  // {
  //   type: 'iphone',
  //   family: 'se',
  //   model: 'iphonese',
  //   width: 640,
  //   height: 1136,
  //   pixelRatio: 3,
  // },
];

export const getRenderer = function () {
  const canvas = document.createElement('canvas');
  if (!canvas) {
    return;
  }
  const context =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!context) {
    return;
  }
  const info = context.getExtension('WEBGL_debug_renderer_info');
  if (!info) {
    return;
  }
  const renderer = context.getParameter(info.UNMASKED_RENDERER_WEBGL);

  return renderer;
};

export const getAppleDevice = function () {
  const width = window.screen.availWidth * window.devicePixelRatio;
  const height = window.screen.availHeight * window.devicePixelRatio;
  const pixelRatio = window.devicePixelRatio;

  if (!navigator.userAgent.includes('iPhone')) {
    return {
      type: 'other',
      family: 'other',
      model: 'other',
      width,
      height,
      pixelRatio,
    };
  }

  const model = models.find((model) => {
    return (
      model.width === width &&
      model.height === height &&
      model.pixelRatio === pixelRatio
    );
  });

  if (model) {
    return model;
  }

  return {
    type: 'iphone',
    family: 'other',
    model: 'other',
    width,
    height,
    pixelRatio,
  };
};
