import { Howl } from 'howler';
import Track from '../Track';

// Matches HTML5 MediaElement API
export default class Sound extends Track {
  constructor(
    url,
    options = { concurrent: 1, interrupt: false, onload, sprite: {} }
  ) {
    super();
    // this.url = url

    const handleLoad = () => {
      // console.log('Howl.handleload', url);
      if (typeof options.onload === 'function') {
        options.onload.call(this);
      }
    };
    // console.log('Howl', url);
    this.obj = new Howl({
      src: [url],
      ...options,
      onload: handleLoad,
    });
    // this.volume = 0;
    // this.play();
    // this.loop = true;

    this.interrupt = options.interrupt;
    // this.concurrent = concurrent
    // this.soundIDs = []
    // this._idIndex = -1

    this.bindEvents();
  }

  load() {
    return new Promise((resolve) => {
      this.obj.once('load', resolve);
      this.obj.load();
    });
  }

  destroy() {
    this.obj.unload();
  }

  // addId(id) {
  //   if (this.soundIDs.length < this.concurrent) {
  //     this.soundIDs.push(id)
  //   }
  // }

  // get singleId() {
  //   return this.concurrent === 1
  // }

  // get currentId() {
  //   return this.soundIDs[this._idIndex] || undefined
  // }

  // get nextId() {
  //   this._idIndex = this._idIndex++ % this.concurrent
  //   return this.soundIDs[this._idIndex] || undefined
  // }

  // play = () => {
  //   var id = this.nextId
  //   if (id) {
  //     this.obj.play(id)
  //   } else {
  //     var id = this.obj.play()
  //     this.addId(id)
  //   }

  //   return id
  // }

  play = (options) => {
    if (typeof options === 'undefined') {
      options = {};
    }

    if (!this.obj) {
      return;
    }

    if (this.interrupt) {
      this.obj.stop();
    }

    if (options.playbackRate) {
      this.obj.rate(options.playbackRate);
    }

    this.obj.play(options.id);
  };

  pause = () => {
    this.obj.pause(this.currentId);
  };

  stop = () => {
    this.obj.stop(this.currentId);
  };

  fade = (to, duration) => {
    // console.log(this.url, to, duration)
    this.obj.fade(this.volume, to, duration);
  };

  fadeOutToStop = (duration = 300) => {
    this.obj.fade(this.volume, 0, duration);
    this.obj.once('fade', () => {
      this.obj.stop();
    });
  };

  fadeOutToPause = (duration = 300) => {
    this.obj.fade(this.volume, 0, duration);
    this.obj.once('fade', () => {
      this.obj.pause();
    });
  };

  get volume() {
    return this.obj.volume(this.currentId);
  }

  set volume(val) {
    this.obj.volume(val);
  }

  get muted() {
    return this.obj.muted;
  }

  set muted(val) {
    this.obj.mute(val, this.currentId);
  }

  get currentTime() {
    return this.obj.seek();
  }

  set currentTime(val) {
    this.obj.seek(val, this.currentId);
  }

  get duration() {
    return this.obj.duration();
  }

  get paused() {
    return !this.obj.playing();
  }

  get rate() {
    return this.obj.rate();
  }

  set rate(val) {
    this.obj.rate(val);
  }

  get loop() {
    return this.obj.loop();
  }

  set loop(val) {
    this.obj.loop(val);
  }
}
