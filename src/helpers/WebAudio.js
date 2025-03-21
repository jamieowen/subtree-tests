const AudioContext = window.AudioContext || window.webkitAudioContext;
const isIOS = /(iOS|iPod|iPad|iPhone)/i.test(navigator.userAgent);
const targetSampleRate = 44100;

// EXPORTS
export let context;
export let masterGain;
export let analyser;
export let waveform;
export let frequencies;

const _createContext = function () {
  context = new AudioContext();

  if (isIOS && context.sampleRate !== targetSampleRate) {
    const buffer = context.createBuffer(1, 1, targetSampleRate);

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    source.disconnect();

    context.close();
    context = new AudioContext();
  }
};

const unlockAudio = function () {
  return new Promise((resolve) => {
    const buffer = context.createBuffer(1, 1, targetSampleRate);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.onended = () => {
      source.disconnect();
      document.body.removeEventListener('touchstart', unlockAudio);
      document.body.removeEventListener('touchend', unlockAudio);
      resolve();
    };
    source.start(0);
  });
};

const _init = function () {
  // CONTEXT
  _createContext();

  document.body.addEventListener('touchstart', unlockAudio);
  document.body.addEventListener('touchend', unlockAudio);

  // ANALYSER
  analyser = context.createAnalyser();
  analyser.connect(context.destination);
  waveform = new Uint8Array(analyser.frequencyBinCount);
  frequencies = new Uint8Array(analyser.frequencyBinCount);

  // MASTER GAIN
  masterGain = context.createGain();
  masterGain.connect(analyser);
};
if (typeof AudioContext === 'function') {
  _init();
}

let rafId;

const _updateWaveform = function () {
  analyser.getByteTimeDomainData(waveform);
  rafId = window.requestAnimationFrame(_updateWaveform);
};

const _updateFrequencies = function () {
  analyser.getByteFrequencyData(frequencies);
  rafId = window.requestAnimationFrame(_updateFrequencies);
};

const _updateWaveformFrequencies = function () {
  analyser.getByteTimeDomainData(waveform);
  analyser.getByteFrequencyData(frequencies);
  rafId = window.requestAnimationFrame(_updateWaveformFrequencies);
};

export const startAnalyser = function (
  updateWaveform = true,
  updateFrequencies = true
) {
  if (updateWaveform && updateFrequencies) {
    rafId = window.requestAnimationFrame(_updateWaveformFrequencies);
  } else if (updateWaveform) {
    rafId = window.requestAnimationFrame(_updateWaveform);
  } else if (updateFrequencies) {
    rafId = window.requestAnimationFrame(_updateFrequencies);
  }
};

export const stopAnalyser = function () {
  window.cancelAnimationFrame(rafId);
};
