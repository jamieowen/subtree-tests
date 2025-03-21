import { Color as ThreeColor } from 'three';

export class Color extends ThreeColor {
  constructor(...args) {
    super(...args);
    this.convertLinearToSRGB();
  }
}

window.Color = Color;
