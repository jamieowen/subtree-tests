const supportsWebp = async () => {
  return new Promise((resolve) => {
    // 1x1 webp with alpha
    const data =
      'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';

    const img = new Image();

    img.onload = function () {
      const result = img.width > 0 && img.height > 0;
      resolve(result);
    };

    img.onerror = function () {
      resolve(false);
    };

    img.src = `data:image/webp;base64,${data}`;
  });
};

let href = '';
let queryString = '';
let urlParams = '';
let pixelRatio = 1;

// DEVICES
let mobile = false;
let phone = false;
let tablet = false;
let desktop = false;

let ios = false;
let iphone = false;
let ipad = false;
let android = false;

let learnMobile = false;

// BROWSERS
let edge = false;
let ie11 = false;
let desktop_safari = false;

let messenger = false;
let facebook_video_ad = false;

let facebook = false;
let instagram = false;
let wechat = false;
let weibo = false;
let ucbrowser = false;
let samsung = false;

let ios_safari = false;
let ios_chrome = false;

let android_chrome = false;
let desktop_chrome = false;
let desktop_edge = false;
let firefox = false;
let safari = false;
let chrome = false;

let mac = false;
let windows = false;

let isCMS = false;

let webp = false;

// window vars - only available on client side
const ua = window.navigator.userAgent;
const ua_lc = ua.toLowerCase();
href = window.location.href;
const vendor = navigator.vendor;
const platform = navigator.platform;

queryString = window.location.search;
urlParams = new URLSearchParams(queryString);

const pixelRatioMax = desktop ? 1.3 : 2;
pixelRatio = window ? Math.min(window.devicePixelRatio || 1, pixelRatioMax) : 1;

mac = ua_lc.includes('mac');
windows = ua_lc.includes('windows');

// mobile = Device.mobile()
// tablet = Device.tablet()
// desktop = Device.desktop()

// ios = Device.ios()
// ipad = Device.ipad()
// android = Device.android()

safari = /apple/i.test(vendor) || window.safari; /// safari/.test(ua_lc) && !ua_lc.includes('chrome')
firefox = /firefox/.test(ua_lc);
edge = /edge\/\d+/.test(ua);
ie11 = ua_lc.includes('trident') && ua.includes('rv:11');

iphone = /(iphone|ipod)/.test(ua_lc);
ipad =
  /(ipad)/.test(ua_lc) ||
  platform === 'iPad' ||
  (!iphone && /MacIntel/.test(platform) && navigator.maxTouchPoints > 0);
//
ios = iphone || ipad;
android = /(android)/.test(ua_lc);

isCMS = new RegExp('^(http|https)://app.storyblok.com').test(document.referrer);

tablet = ipad || /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua_lc);
mobile = ios || tablet || android;
desktop = !mobile;
phone = mobile && !tablet;

learnMobile = mobile && !tablet;

desktop_safari = !ios && safari && !navigator.maxTouchPoints;

messenger =
  /fban\/messengerforios/.test(ua_lc) || /fb_iab\/messenger/.test(ua_lc);

const facebook_video_ad_urlparam = window.location.href.includes('fbvideo');
const el_vh = document.createElement('div');
el_vh.style.cssText = `position: absolute;
                    pointer-events:none;
                    top:0px;
                    width:1px;
                    height:100vh;`;
document.body.appendChild(el_vh);
const vh = el_vh.clientHeight;
facebook_video_ad = ios
  ? facebook_video_ad_urlparam && window.screen.height - vh < 30
  : facebook_video_ad_urlparam &&
    window.screen.height - window.innerHeight < 30;
document.body.removeChild(el_vh);

facebook = /(fban|fbav)/.test(ua_lc) && !messenger && !facebook_video_ad;

instagram = /instagram/.test(ua_lc);
wechat = /micromessenger/.test(ua_lc);
weibo = /weibo/.test(ua_lc);
ucbrowser = /ucbrowser/.test(ua_lc);
samsung = /samsung/.test(ua_lc);

const other_ios_browsers =
  /(crios|fxios|opios|mercury|ucbrowser|fbav|fban|instagram)/.test(ua_lc);
const other_android_browsers =
  /(opera|ucbrowser|samsung|fbav|fban|instagram)/.test(ua_lc);

ios_safari = ios && !other_ios_browsers;
ios_chrome = ios && /crios/.test(ua_lc);

android_chrome =
  android && !other_android_browsers && /chrome/.test(ua_lc) && !messenger;

desktop_chrome =
  desktop && /Chrome/.test(ua) && /Google Inc/.test(vendor) && !/Edg/.test(ua);
desktop_edge =
  desktop && /Chrome/.test(ua) && /Google Inc/.test(vendor) && /Edg/.test(ua);

chrome = ios_chrome || android_chrome || desktop_chrome;

const init = async function () {
  webp = await supportsWebp();
  return webp;
};

const env = {
  mobile,
  tablet,
  desktop,
  phone,

  mac,
  windows,

  href,
  queryString,
  urlParams,

  ios,
  iphone,
  ipad,
  android,

  learnMobile,

  facebook_video_ad,
  facebook,
  messenger,
  instagram,

  wechat,
  weibo,
  ucbrowser,
  samsung,

  edge,
  ie11,
  safari,
  ios_safari,
  ios_chrome,
  desktop_safari,
  desktop_chrome,
  desktop_edge,
  webp: () => webp,
  android_chrome,
  firefox,
  chrome,

  isCMS,

  init,
};

const setDeviceClasses = () => {
  if (isCMS) {
    console.log('Running in CMS mode');
  }

  const html = document.querySelector('html');
  const mapN = {
    desktop: 'deviceDesktop',
    tablet: 'deviceTablet',
    phone: 'devicePhone',
  };
  for (const n in env) {
    if (env[n] === true) {
      html.classList.add(mapN[n] || n);
    }
  }
};

setDeviceClasses();
export default env;
