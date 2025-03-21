import { translationImport } from '@resn/storyblok-tools/src';

const main = async () => {
    await translationImport({
        dryRun: true,
        defaultLanguage: 'en',
        inputPath: './src/public/storyblok/translations',
        oauthToken: 'ICSIPxPItmX8DQLespQeTwtt-106350-jyz-Mhskd7JiPTrKQqHx',
        // spaceId: 234704 // getty
        spaceId: 213746 // jamie test,
    });
    // await translationExport({
    //     defaultLanguage: 'en',
    //     oauthToken: 'ICSIPxPItmX8DQLespQeTwtt-106350-jyz-Mhskd7JiPTrKQqHx',
    //     // spaceId: 234704
    //     spaceId: 213746 // jamie test
    // });
};

main();
