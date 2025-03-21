import { buildCache } from './storyblok-tools/src';

const main = async () => {
  await buildCache({
    version: 'draft',
    outputPath: './public/storyblok',
    downloadAssets: true,
    cdnPath: '/',
    accessToken: 'Ybr3F0C6OC9jEbjrhAEQNQtt',
  });
};

main();
