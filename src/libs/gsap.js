import gsap from 'gsap';

// TODO: import GSAP Premium
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { SlowMo } from 'gsap/EasePack';
// import { SplitText } from "gsap/dist/SplitText";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(CustomEase, CustomWiggle, SlowMo);

CustomEase.create('s-out', '0.22, 1.00, 0.36, 1.00');
CustomEase.create('s-in-out', '0.84, 0.00, 0.16, 1.00');

// const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
// const RECIPROCAL_GR = 1 / GOLDEN_RATIO;
// const DURATION = RECIPROCAL_GR;
// //const EASE = CustomEase.create('ease', '0.175, 0.885, 0.32, 1');

// // Configuring GSAP with custom settings that aren't Tween-specific
// gsap.config({
//   autoSleep: 60,
//   nullTargetWarn: false,
// });

// // Setting default animation properties that should be inherited by ALL tweens
// gsap.defaults({
//   duration: DURATION,
//   //ease: EASE,
// });

// // Once the desired configurations are set, we simply export what we need to work with in the future.
// export {
//   // CustomEase,
//   DURATION,
//   //EASE,
//   GOLDEN_RATIO,
//   gsap,
//   // SplitText,
//   // ScrollTrigger,
// };
