import { translationExport } from '@resn/storyblok-tools/src';

const main = async () => {
    await translationExport({
        defaultLanguage: 'en',
        accessToken: 'd603HjvdDMyuyoxrzKU3Uwtt', // jamie test space
        outputPath: './src/public/storyblok/translations'
    });

    // await translationExport({
    //     defaultLanguage: 'en',
    //     oauthToken: 'ICSIPxPItmX8DQLespQeTwtt-106350-jyz-Mhskd7JiPTrKQqHx',
    //     // spaceId: 234704
    //     spaceId: 213746 // jamie test
    // });
};

main();
