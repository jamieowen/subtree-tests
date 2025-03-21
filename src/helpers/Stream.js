const resOptions = [
  // {
  //   width: 3840,
  //   height: 2160,
  // },
  // {
  //   width: 1920,
  //   height: 1080,
  // },
  // {
  //   width: 1280,
  //   height: 720,
  // },
  // {
  //   width: 800,
  //   height: 600,
  // },
  {
    width: 640,
    height: 480,
  },
  {
    width: 640,
    height: 360,
  },
  {
    width: 320,
    height: 240,
  },
];

let successIdx = null;
let tryIdx = -1;

export const getStream = async function (facingMode, audio) {
  // Check if has support
  const supported = navigator.mediaDevices;
  if (!supported) {
    throw 'support';
  }

  // Get next res to try
  tryIdx++;
  if (successIdx !== null) {
    tryIdx = successIdx;
  }
  if (successIdx === null && tryIdx > resOptions.length - 1) {
    throw 'stream';
  }
  const res = resOptions[tryIdx];
  // console.log(tryIdx, successIdx, res.width, res.height)

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audio === undefined ? false : audio,
      video: facingMode
        ? {
            ...res,
            // width: { min: 320, exact: 1280, max: 1920 },
            // height: { min: 240, exact: 720, max: 1080 },
            facingMode,
          }
        : false,
    });
    successIdx = tryIdx;
    return {
      stream,
      res,
    };
  } catch (err) {
    return getStream();
  }
};
