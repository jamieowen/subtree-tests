import { getUrlString, getUrlBoolean } from '@/helpers/UrlParam';
import { RGFormat } from 'three';

export const scrollLengthPx = 650;

const getScrollDummy = (background = 0x333333) => {
  return {
    component: 'SceneScrollDummy',
    scrollLength: 1,
    props: {
      background,
    },
    transition: {
      start: 0.5,
      end: 1,
      material: {
        name: 'MaterialTransitionMix',
        props: {
          threshold: 0,
          texture: {
            name: 'MixTextureLine',
            props: {},
          },
        },
      },
    },
  };
};

export let scenes = [
  {
    component: 'SceneMountain',
    scrollLength: 1,
    props: {
      background: 0xc5c5c5,
    },
    renderTargetProps: {
      type: 'deferred',
    },
    // subtitles: [
    //   {
    //     text: '4.6 billion years ago, the vast expanse of space was a tapestry woven with cosmic dust,\nswirling gases, and a medley of rock, metal fragments, and frozen ice particles.',
    //     start: 0.25,
    //     end: 0.5,
    //   },
    // ],
    // transition: {
    //   start: 0.5,
    //   end: 1,
    //   material: {
    //     name: 'MaterialTransitionMix',
    //     props: {
    //       threshold: 0,
    //       texture: {
    //         name: 'MixTextureLine',
    //         props: {},
    //       },
    //     },
    //   },
    // },
  },
];
export const allScenes = scenes;

const sandbox = getUrlString('sandbox');
if (sandbox && scenes.find((s) => s.component === sandbox)) {
  scenes = scenes.filter((s) => s.component === sandbox);
}
if (sandbox == 'SceneDebug') {
  scenes = [
    {
      component: 'SceneDebug',
      props: {
        background: 0x777777,
      },
      scrollLength: 1,
      renderTargetProps: {
        type: 'deferred',
        count: 3,
      },
      transition: {
        start: 0.75,
        end: 1,
        material: {
          name: 'MaterialTransitionMix',
          props: {
            threshold: 0,
            texture: {
              name: 'MixTextureLine',
              props: {},
            },
          },
        },
      },
    },
  ];
}

if (sandbox && getUrlBoolean('scrollDummyPre')) {
  scenes.unshift(getScrollDummy(0xdddddd));
  scenes.unshift(getScrollDummy(0x555555));
}

if (sandbox && getUrlBoolean('scrollDummy')) {
  scenes.push(getScrollDummy(0xcccccc));
  scenes.push(getScrollDummy(0x444444));
}

// scenes = [
//   //
//   // getScrollDummy(),
//   // getScrollDummy(0x444444),
//   // getScrollDummy(0x555555),
//   // getScrollDummy(0x666666),
//   // getScrollDummy(0x777777),
// ];

export const totalLength = scenes.reduce(
  (acc, scene) => acc + scene.scrollLength,
  0
);

// Calc offsets
export const offsetMap = scenes.map((scene, idx) => {
  let o = 0;
  for (let i = 0; i < idx; i++) {
    o += scenes[i].scrollLength;
  }
  return o;
});

scenes.forEach((scene, idx) => {
  scene.offset = offsetMap[idx];
  // console.log(scene.component, scene.offset);
});

// console.log('scenes', scenes, totalLength, offsetMap);
