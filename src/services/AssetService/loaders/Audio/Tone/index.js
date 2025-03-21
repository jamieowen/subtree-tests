import * as Tone from 'tone';
import gsap from 'gsap';
import EventEmitter from '@/helpers/EventEmitter';
import AudioService from '@/services/AudioService';

const Events = {
  LOAD: 'load',
  END: 'end',
  PLAY: 'play',
  PAUSE: 'pause',
  STATE: 'state',
};

// Matches HTML5 MediaElement API
export default class ToneAudioTrack {
  constructor(url, options = { onload }) {
    Object.assign(this, EventEmitter, {
      Events: Events,
    });

    this.url = url;
    this.options = options;

    const onload = () => {
      if (typeof options.onload === 'function') {
        options.onload.call(this);
      }
      this.emit(Events.LOAD, this);
    };

    this.obj = new Tone.Player({
      url,
      onload,
    }).connect(AudioService.vol);

    AudioService.addPlayer(this.obj);
  }

  getCopy() {
    let copy = new ToneAudioTrack(this.url, this.options);
    return copy;
  }

  load() {
    return this.obj.load();
  }

  destroy() {
    this.obj.dispose();
  }

  play = (options) => {
    if (typeof options === 'undefined') {
      options = {};
    }

    if (!this.obj) {
      return;
    }

    if (this.interrupt) {
      this.obj.seek(0);
    }

    if (options.playbackRate) {
      this.obj.playbackRate = options.playbackRate;
    }

    try {
      this.obj.start(this.obj.now() + 0.0001);
    } catch (err) {
      console.warn(err);
    }
  };

  pause = () => {
    try {
      this.obj.stop();
    } catch (err) {
      console.warn(err);
    }
  };

  start = (opts) => {
    this.play(opts);
  };

  stop = () => {
    try {
      this.obj.stop();
      this.obj.seek(0);
    } catch (err) {
      console.warn(err);
    }
  };

  fade = (to, duration) => {
    gsap.to(this.obj.volume, { value: to, duration });
  };

  fadeOutToStop = (duration) => {
    gsap.to(this.obj.volume, {
      value: -100,
      duration,
      onComplete: () => {
        this.stop();
      },
    });
  };

  fadeOutToPause = (duration) => {
    gsap.to(this.obj.volume, {
      value: -100,
      duration,
      onComplete: () => {
        this.pause();
      },
    });
  };

  get volume() {
    return this.obj.volume.value;
  }

  set volume(val) {
    this.obj.volume.value = (1.0 - val) * -40;
  }

  get muted() {
    return this.obj.mute;
  }

  set muted(val) {
    this.obj.mute = val;
  }

  get currentTime() {
    // return this.obj.immediate()
    return this.obj.now();
  }

  set currentTime(val) {
    this.obj.seek(val);
  }

  get duration() {
    return this.obj.loopEnd || 0.1;
  }

  get paused() {
    return this.obj.state == 'stopped';
  }

  get rate() {
    return this.obj.playbackRate;
  }

  set rate(val) {
    this.obj.playbackRate = val;
  }

  get loop() {
    return this.obj.loop;
  }

  set loop(val) {
    this.obj.loop = val;
  }
}
