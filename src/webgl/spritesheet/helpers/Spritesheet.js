import FrameSequence from './FrameSequence';
import { mergeSpritesheets } from './utils';
import deepClone from 'deep-clone';

export class Spritesheet {
  options = {
    fps: 30,
    data: [{ json: null, texture: null }],
    sequences: [{ id: 'seq-1', from: 0, to: 2 }],
    onFrame: () => {},
    onEnd: () => {},
  };

  frames = [];
  currentFrame = null;
  sequence = null;
  sequenceId = null;

  constructor(opts) {
    Object.assign(this.options, opts);
    this.setup();
  }

  setup = async () => {
    await this.setupFrames();
    await this.setupSequence();
  };

  setupFrames = async () => {
    const { data } = this.options;
    this.frames = mergeSpritesheets(data);
    this.currentFrame = this.frames[0];
  };

  setupSequence = async () => {
    this.sequence = new FrameSequence(
      this.frames.length,
      this.options.fps,
      this.onFrame.bind(this),
      this.onEnd.bind(this)
    );
  };

  onFrame = (i) => {
    this.currentFrame = this.frames[i];
    this.options.onFrame(this.currentFrame);
  };

  onEnd = () => {
    this.options.onEnd.call(this, this.sequenceId);
  };

  playSequence = (id) => {
    const { sequences } = this.options;
    const sequence = sequences.find((s) => s.id === id);

    if (!sequence) return;

    const loop = sequence.loop !== undefined ? sequence.loop : 1;

    this.sequenceId = id;
    this.sequence.play(loop, sequence.from, sequence.to);
  };

  play = (from = 0, to = 1, loop = 1) => {
    this.sequence.play(loop, from, to);
  };

  pause = () => {
    this.sequence.pause();
  };

  goToFrame = (frame) => {
    this.sequence.goToFrame(frame);
    this.sequence.pauseAtFrame(frame);
  };

  clone = (opts) => {
    // let cloned = Object.assign({}, this);
    // cloned.sequence = Object.assign({}, this.sequence);
    // Object.assign(cloned.options, opts);
    // return cloned;
  };
}

export default Spritesheet;
