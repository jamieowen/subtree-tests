class ForceLandscape {
  constructor(ele) {
    this.ele = ele;
    this.targetDegree = 0;
    this.isWechat = /micromessenger/i.test(navigator.userAgent);
    window.addEventListener('orientationchange', this._update, false);
    window.addEventListener('resize', this._update, false);
    this._update(true);
  }

  destroy = () => {
    window.removeEventListener('orientationchange', this._update, false);
    window.removeEventListener('resize', this._update, false);
  };

  _update = (immediate) => {
    let delay = 0;
    const isWechat = /micromessenger/i.test(navigator.userAgent);
    if (isWechat) {
      delay = 400;
    }
    if (immediate === true) {
      delay = 0;
    }
    // alert(`update ${immediate} ${delay}`)
    setTimeout(() => {
      this._resize();
    }, delay);
  };

  _resize = () => {
    const ratio = window.innerWidth / window.innerHeight;
    let targetWidth;
    let targetHeight;
    let targetDegree;

    if (ratio < 1) {
      targetWidth = window.innerHeight;
      targetHeight = window.innerWidth;
      targetDegree = 90;
      this.ele.style.left = `${-(targetWidth - targetHeight) / 2}px`;
      this.ele.style.top = `${-(targetHeight - targetWidth) / 2}px`;
    } else {
      targetWidth = window.innerWidth;
      targetHeight = window.innerHeight;
      targetDegree = 0;
      this.ele.style.left = '0px';
      this.ele.style.top = '0px';
    }
    this.targetDegree = targetDegree;

    this.ele.style.transform = `rotate(${targetDegree}deg)`;
    this.ele.style.width = `${targetWidth}px`;
    this.ele.style.height = `${targetHeight}px`;
  };

  get isRotated() {
    return this.targetDegree;
  }
}

export default ForceLandscape;
