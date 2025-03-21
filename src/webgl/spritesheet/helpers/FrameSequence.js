import TickerAt from './TickerAt';
import inRange from './inRange';
import rangeMake from './rangeMake';

export class FrameSequence {
  onFrame;
  onEnd;
  autoUpdate;
  fps;
  totalFrames;
  endFrame;
  range;
  ticker;
  range;
  direction = 1;
  currentFrame = 0;
  currentLoop = 0;
  maxLoops = 0;
  currentIndex = 0;
  startFrame = 0;
  isPaused = true;
  isEnded = false;
  isFirstTick = false;
  isTicking = false;
  autoReverse = false;
  isInfiniteLoop = false;

  constructor(
    totalFrames,
    fps = 60,
    onFrame = () => {},
    onEnd = () => {},
    autoUpdate = true
  ) {
    this.onFrame = onFrame;
    this.onEnd = onEnd;
    this.autoUpdate = autoUpdate;
    this.fps = fps;
    this.totalFrames = totalFrames;
    this.endFrame = totalFrames - 1;
    this.range = this.createRangeFromState();
  }

  play = (
    loops,
    start,
    end,
    autoReverse = false,
    forceUnidirectional = false
  ) => {
    if (!inRange(start, 0, this.totalFrames)) {
      throw new Error('Start frame is out of bounds');
    }

    if (!inRange(end, 0, this.totalFrames)) {
      throw new Error('End frame is out of bounds');
    }

    this.isPaused = false;
    this.isEnded = false;
    this.maxLoops = loops;
    this.startFrame = start;
    this.endFrame = end;
    this.autoReverse = autoReverse;
    this.currentFrame = start;
    this.currentLoop = 0;
    if (forceUnidirectional) {
      this.direction = 1;
    } else {
      this.direction = start > end ? -1 : 1;
    }
    this.range = this.createRangeFromState();
    this.currentIndex = 0;
    this.isInfiniteLoop = loops === 0;

    this.isFirstTick = true;

    this.startTicker();
  };

  reverse = () => {
    if (this.isEnded) {
      return;
    }

    const oldStartFrame = this.startFrame;
    const isLeftSideOfRange = this.currentIndex <= this.range.length * 0.5;

    this.startFrame = this.endFrame;
    this.endFrame = oldStartFrame;
    this.direction *= -1;

    this.range = this.createRangeFromState();
    this.currentIndex = isLeftSideOfRange
      ? this.range.indexOf(this.currentFrame)
      : this.range.lastIndexOf(this.currentFrame);
  };

  pause = () => {
    this.isFirstTick = false;
    this.isPaused = true;
    this.stopTicker();
  };

  pauseAtFrame = (frame) => {
    if (!inRange(frame, 0, this.totalFrames)) {
      throw new Error('Frame is out of bounds');
    }
  };

  resume = () => {
    if (this.isPaused && !this.isEnded) {
      this.isPaused = false;
      this.startTicker();
    }
  };

  setFPS = (fps) => {
    if (fps !== this.fps) {
      this.fps = fps;

      if (this.isTicking) {
        this.stopTicker();
        this.startTicker();
      }
    }
  };

  update = () => {
    if (this.isTicking && this.autoUpdate === false) {
      this.ticker.update();
    }
  };

  getCurrentFrame = () => {
    return this.currentFrame;
  };

  startTicker = () => {
    if (this.isTicking) {
      return;
    }

    this.isTicking = true;
    this.ticker = new TickerAt(this.fps, this.onTick);
  };

  stopTicker = () => {
    if (!this.isTicking) {
      return;
    }
    this.isTicking = false;
    this.ticker.destroy();
    this.ticker = null;
  };

  onTick = (delta, elapsed, step) => {
    const { isFirstTick } = this;

    this.isFirstTick = false;

    if (!isFirstTick) {
      // check for new loop
      if (!inRange(this.currentIndex + step, 0, this.range.length)) {
        this.currentLoop += 1;

        // when we've reached max loops, we can end the sequence
        if (this.currentLoop === this.maxLoops && !this.isInfiniteLoop) {
          // this is the end
          this.end();

          return;
        }
      }

      // update our frame
      let timescale = window.timescale ? window.timescale : 1;

      this.updateFrame(step * timescale);
    }

    // always trigger frame
    this.onFrame(this.currentFrame);
  };

  goToFrame = (frame) => {
    this.currentIndex = frame;
    this.currentFrame = this.range[this.currentIndex];

    this.onFrame(this.currentFrame);
  };

  updateFrame = (delta) => {
    this.currentIndex = (this.currentIndex + delta) % this.range.length;
    this.currentFrame = this.range[Math.floor(this.currentIndex)];
  };

  end = () => {
    this.stopTicker();

    const previousIndex = this.currentIndex;

    // the last frame should always be the last of the range, independent from frame step
    this.currentIndex = this.range.length - 1;

    // we only want to call the frame handler when there is an actual difference
    if (previousIndex !== this.currentIndex) {
      this.currentFrame = this.range[this.currentIndex];
      this.onFrame(this.currentFrame);
    }

    this.isEnded = true;
    this.onEnd();
  };

  createRangeFromState = () => {
    return rangeMake(
      this.totalFrames,
      this.startFrame,
      this.endFrame,
      this.autoReverse,
      this.direction
    );
  };
}

export default FrameSequence;
