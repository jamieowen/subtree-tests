import { Howl } from 'howler';
import Track from '../Track';
import { AudioLoader } from 'three-stdlib';
import { listener } from '@/contexts/listener';

const loader = new AudioLoader();

// Matches HTML5 MediaElement API
export default class Sound extends Track {
  constructor(url, options = { onload }) {
    super();
    // this.url = url

    const handleLoad = () => {
      if (typeof options.onload === 'function') {
        options.onload.call(this);
      }
    };

    this.obj = new PositionalAudio(listener);

    loader.load(url, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0);
      sound.play();
      handleLoad();
    });

    this.bindEvents();
  }

  load() {
    // return new Promise((resolve) => {
    //   this.obj.once('load', resolve);
    //   this.obj.load();
    // });
  }

  destroy() {
    this.obj.stop();
  }

  play = (options) => {
    this.obj.play();
  };

  pause = () => {
    this.obj.pause();
  };

  stop = () => {
    this.obj.stop();
  };

  fade = (to, duration) => {
    let o = { volume: this.obj.getVolume() };
    return gsap.to(o, {
      volume: to,
      duration,
      onUpdate: () => {
        this.obj.setVolume(o.volume);
      },
    });
  };

  fadeOutToStop = (duration = 300) => {
    this.fade(0, duration).then(() => {
      this.obj.stop();
    });
  };

  fadeOutToPause = (duration = 300) => {
    this.fade(0, duration).then(() => {
      this.obj.pause();
    });
  };

  get volume() {
    return this.obj.getVolume();
  }

  set volume(val) {
    this.obj.setVolume(val);
  }

  // get muted() {
  //   return this.obj.muted;
  // }

  // set muted(val) {
  //   this.obj.mute(val, this.currentId);
  // }

  // get currentTime() {
  //   return this.obj.context.currentTime - this.obj.startTime + audioPrevTime;
  // }

  // set currentTime(val) {
  //   this.obj.seek(val, this.currentId);
  // }

  // get duration() {
  //   return this.obj.duration();
  // }

  get paused() {
    return !this.obj.isPlaying;
  }

  get rate() {
    return this.obj.getPlaybackRate();
  }

  set rate(val) {
    this.obj.setPlaybackRate(val);
  }

  get loop() {
    return this.obj.getLoop();
  }

  set loop(val) {
    this.obj.setLoop(val);
  }
}
