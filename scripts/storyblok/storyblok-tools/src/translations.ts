import StoryblokClient, { ISbStoryData, ISbSchema, ISbStory } from 'storyblok-js-client';
import { RichtextResolver } from 'storyblok-js-client';
import { fetchStories, ensureFileFolder, writeJson } from './cache-builder';
import { visitStory } from './story-visitor';
import { resolve, join } from 'path';
import { glob } from 'glob';
import { readJSONSync } from 'fs-extra';
import { createTranslationFieldMap } from './translation-field-map';

export interface ITranslationExportOpts {
    accessToken: string;
    outputPath: string;
    defaultLanguage: string;
}

export const translationExport = async (opts: Partial<ITranslationExportOpts> = {}) => {
    const accessToken = opts.accessToken;
    if (!accessToken) {
        throw new Error('Supply an access token in opts.');
    }
    const outputPath = opts.outputPath;
    if (!outputPath) {
        throw new Error('Supply an output path in opts.');
    }

    const client = new StoryblokClient({
        accessToken: accessToken
    });

    const stories = await fetchStories(client, {
        defaultLanguage: 'en',
        languages: ['en', 'es']
    });

    const cwd = process.cwd();
    stories.forEach((story) => {
        console.log(story.path, story.language);
        // write data.

        /**
         * Write data to output path.
         *
         * Each stories full output gets stored, so it can be transformed to translatable
         * field entries. ( both per page & a full site translation file )
         *
         * The original data source is used as in input step to importing translations back in,
         * So it's important data is kept intact.
         */
        const writePath = resolve(join(cwd, outputPath, story.language, story.path));
        writeJson(join(writePath, 'data.json'), story.data);

        /**
         * Determine translatable fields and write translatable file outputs.
         */
        visitStory(story.data, {
            visit: (node) => {
                if (node.type === 'field') {
                    console.log(node.key, node.type, node.fieldtype);
                }
            }
        });
    });
};

export interface ITranslationImportOpts {
    oauthToken: string;
    spaceId: number;
    defaultLanguage: string;
    inputPath: string;
    dryRun: boolean;
}

export const translationImport = (opts: Partial<ITranslationImportOpts>) => {
    const oauthToken = opts.oauthToken;
    if (!oauthToken) {
        throw new Error('You must provide an oauth token.');
    }
    const spaceId = opts.spaceId;
    if (!spaceId) {
        throw new Error('You must provide a spaceId.');
    }

    const inputPath = opts.inputPath;
    if (!inputPath) {
        throw new Error('You must provide an input path to previously exported data.');
    }

    const defaultLanguage = opts.defaultLanguage;
    if (!defaultLanguage) {
        throw new Error('You must provide a defaultLanguage identifier.');
    }

    const client = new StoryblokClient({
        oauthToken
    });

    const sources = glob.sync('**/data.json', {
        cwd: inputPath
    });

    const dryRun = opts.dryRun || false;

    const data = sources
        .map((source) => {
            const parts = source.split('/');
            const language = parts[0];
            const path = parts.slice(1, -1).join('/');
            const data = readJSONSync(resolve(join(inputPath, source))) as ISbStoryData;
            return {
                data,
                path,
                language
            };
        })
        .filter((e) => e.language === 'en');

    console.log(data.map((entry) => entry.path + ' ' + entry.language));

    for (let entry of data) {
        const url = `spaces/${spaceId}/stories/${entry.data.id}`;
        const language = entry.language === defaultLanguage ? 'default' : entry.language;

        const translationMap = createTranslationFieldMap(entry.data);
        console.log([...translationMap.keys()]);

        if (!dryRun) {
            console.log(url, language, entry.data.lang);

            visitStory(entry.data, {
                visit: (node) => {
                    if (node.type === 'field') {
                        console.log('FIELD  :', node.key, node.value);
                    }
                    if (node.type === 'component') {
                        console.log(Object.keys(node.value));
                        delete node.value._editable; // causes out of schema error
                        // delete node.value.component; // required for blo
                        // delete node.value._uid;
                        console.log('AFTER : ', Object.keys(node.value));
                        // delete node.value._editable;
                    }
                }
            });
            client
                .put(url, {
                    story: entry.data as any,
                    version: 'draft',
                    language,
                    lang: language
                })
                .then((res) => {
                    // console.log('RES : ', res);
                    // console.log( res.sta)
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            console.log('Would write : ', `${entry.language} > ${language}`, url);
        }
    }

    // client.get(`spaces/${spaceId}/stories/`, {}).then((res) => {
    //     // console.log(res);
    //     res.data.stories.forEach((s: ISbStory, i: number) => {
    //         console.log('STORY', i);
    //         console.log(s);
    //     });
    // });
    // const stories = await fetchStories(client, {
    //     defaultLanguage: 'en',
    //     languages: ['en', 'es']
    // });

    // console.log(stories);

    // client.getput('', {});

    // const resolver = new RichtextResolver();
    // resolver.
};
