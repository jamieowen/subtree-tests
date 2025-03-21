// import AudioTrack from './Audio'

class AudioLoader {
  constructor() {
    // mobile audio activation
    // this.mobileActivate = true
    // this._unlocked = false
    this.sounds = [];
  }

  load_audio_url = (item, onProgress) => {
    return new Promise(async (resolve) => {
      const onload = function () {
        resolve(this);
      };
      const AudioTrack = (await import('./Audio/Howler')).default;
      const audio = new AudioTrack(item.url, { ...item.options, onload });
    });
  };

  //
  // ///UTILS
  // addAudioUnlock = () => {
  //   if (this.mobileActivate && !this._unlocked) {
  //       document.body.addEventListener('click', this._unlockAudio) // android
  //       document.body.addEventListener('touchstart', this._unlockAudio) // ios
  //    }
  // }
  //
  // //TODO - what is this , required for mobile playback?
  // _unlockAudio = () => {
  //   if (this._unlocked) return
  //
  //   Object.keys(this.sounds).forEach(sound => {
  //     let s = this.sounds[sound]
  //     s.volume = 1
  //     s.muted = false
  //   })
  //
  //   document.body.removeEventListener('click', this._unlockAudio) // android
  //   document.body.removeEventListener('touchstart', this._unlockAudio) // ios
  //
  //   this._unlocked = true
  // }
}

const audioLoader = new AudioLoader();
export default audioLoader;
