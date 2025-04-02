import path from 'node:path';
import portfinder from 'portfinder';
import fs from 'fs';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import AutoImport from 'unplugin-auto-import/vite';
import Unocss from 'unocss/vite';
import viteCompression from 'vite-plugin-compression';
import glsl from 'vite-plugin-glsl';
import svgr from 'vite-plugin-svgr';

import mkcert from 'vite-plugin-mkcert';
import packageJson from './package.json';
import { qrcode } from 'vite-plugin-qrcode';

// import { reactRouter } from '@react-router/dev/vite';
// import tsconfigPaths from 'vite-tsconfig-paths';

// import MillionLint from '@million/lint';
// import million from 'million/compiler';

const getPort = async () => {
  return new Promise((resolve) => {
    portfinder.basePort = 3340;
    portfinder.getPort((err, port) => {
      resolve(port);
    });
  });
};

export default defineConfig(async () => {
  const port = await getPort();

  return {
    define: {
      'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
    },

    // optimizeDeps: {
    //   // disabled: true,
    //   exclude: ['@zappar/zappar-react-three-fiber', 'three', 'three-stdlib'],
    //   include: [
    //     'ua-parser-js',
    //     'zustand',
    //     'chevrotain',
    //     'lodash.pick',
    //     'lodash.omit',
    //     'stats.js',
    //     'prop-types',
    //     'lodash.clamp',
    //   ],
    // },

    base: './',

    build: {
      assetsInlineLimit: '512',
      sourcemap: false,
    },

    server: {
      host: '0.0.0.0',
      port,
      https: {
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost.pem'),
      },
      // proxy: {},
      // fs: {
      // 	strict: true,
      // },
    },

    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        '@/': `${path.resolve(__dirname, 'src')}/`,
        'assets/': `${path.resolve(__dirname, 'src', 'assets')}/`,
        'gsap/': `${path.resolve(__dirname, 'src/libs/gsap-premium/esm')}/`,
        'lygia/': `${path.resolve(__dirname, 'src/webgl/glsl/lygia')}/`,
      },
    },

    // worker: {
    //   plugins: [react({ fastRefresh: false })],
    // },
    plugins: [
      // react({ fastRefresh: false }),
      svgr(),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', {}]],
        },
      }),
      // MillionLint.vite({
      //   filter: {
      //     include: '**/components/*.{mtsx,mjsx,tsx,jsx}',
      //   },
      // }),
      // mkcert(),
      glsl({
        include: [
          // Glob pattern, or array of glob patterns to import
          '**/*.glsl',
          '**/*.wgsl',
          '**/*.vert',
          '**/*.frag',
          '**/*.vs',
          '**/*.fs',
          // '**/*.js',
        ],
      }),
      // viteCompression(),
      qrcode(),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        ],
        imports: [
          // presets
          'react',
          'react-router-dom',
          'ahooks',
          {
            // react: ['useContext', 'createContext'],
            // '@react-ecs/core': [
            //   'Entity',
            //   'Facet',
            //   'DomView',
            //   'useAnimationFrame',
            //   'useECS',
            //   'useEngine',
            //   'useEntity',
            //   'useFacet',
            //   'useQuery',
            //   'useStatefulRef',
            //   'useSystem',
            //   'useTimer',
            // ],
            // '@react-ecs/three': ['ThreeView'],
            miniplex: ['World'],
            'miniplex-react': ['createReactAPI', 'useEntities'],
            '@lilib/hooks': ['useRaf'],
            '@gsap/react': ['useGSAP'],
            '@react-three/fiber': [
              'useThree',
              'useFrame',
              'useLoader',
              'useGraph',
            ],
            'react-i18next': ['useTranslation', 'Trans'],
            '@react-three/drei': ['Sphere', 'Box', 'Plane'],
            'maath/misc': ['degToRad', 'radToDeg'],
            react: ['Suspense'],
            'suspend-react': ['suspend', 'clear'],
            'react-merge-refs': ['mergeRefs'],
            // '@yaireo/react-ref-watcher': ['useWatchableEffect'],
            zustand: ['create'],
            gsap: ['gsap'],
            three: [
              'Vector2',
              'Vector3',
              'Vector4',
              'Matrix4',
              'Euler',
              'Quaternion',

              'Group',
              // 'Color',
              'Mesh',
              'Object3D',

              'RepeatWrapping',
              'ClampToEdgeWrapping',
              'MirroredRepeatWrapping',

              'DoubleSide',
              'FrontSide',
              'BackSide',

              'NearestFilter',
              'LinearFilter',

              'GLSL3',
              'Box3',

              'NoBlending',
              'NormalBlending',
              'AdditiveBlending',
              'SubtractiveBlending',
              'MultiplyBlending',
              'CustomBlending',

              'SRGBColorSpace',
              'LinearSRGBColorSpace',
              'NoColorSpace',

              'MeshBasicMaterial',
              'MeshPhongMaterial',
              'MeshToonMaterial',
              'MeshStandardMaterial',
              'MeshPhysicalMaterial',

              'LoopOnce',
              'LoopRepeat',
              'LoopPingPong',

              'DetachedBindMode',
              'AttachedBindMode',

              'AlwaysStencilFunc',
              'ReplaceStencilOp',

              'UnsignedByteType',
              'ByteType',
              'ShortType',
              'UnsignedShortType',
              'IntType',
              'UnsignedIntType',
              'FloatType',
              'HalfFloatType',
              'UnsignedShort4444Type',
              'UnsignedShort5551Type',
              'UnsignedInt248Type',
              'UnsignedInt5999Type',

              'AlphaFormat',
              'RedFormat',
              'RedIntegerFormat',
              'RGFormat',
              'RGIntegerFormat',
              'RGBFormat',
              'RGBAFormat',
              'RGBAIntegerFormat',
              'LuminanceFormat',
              'LuminanceAlphaFormat',
              'DepthFormat',
              'DepthStencilFormat',
            ],
          },
        ],
        defaultExportByFilename: true,
        dirs: [
          './src/components/**',
          './src/games/**',
          './src/hooks/**',
          './src/contexts/**',
          './src/webgl/**',
          './src/config/**',
          //
        ],
        eslintrc: {
          enabled: true,
        },
      }),
      Unocss(),
      // million.vite({ auto: true }),
      Pages({
        extendRoute(route, parent) {
          if (route.path === '/') {
            // Index is unauthenticated.
            return route;
          }

          // Augment the route with meta that indicates that the route requires authentication.
          return {
            ...route,
            meta: { layout: 'home' },
          };
        },
      }),
    ],
  };
});
