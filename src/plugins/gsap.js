import gsap from 'gsap';

// TODO: import GSAP Premium
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { CustomBounce } from 'gsap/CustomBounce';
// import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// console.log(100, SplitText);

gsap.registerPlugin(CustomEase, CustomWiggle, CustomBounce, useGSAP);

// CustomEase.create('s-out', '0.22, 1.00, 0.36, 1.00');
// CustomEase.create('s-in-out', '0.84, 0.00, 0.16, 1.00');
