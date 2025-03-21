import StoryblokClient, { ISbStoryData } from 'storyblok-js-client';
import { resolve, join, sep, basename, extname } from 'path';
import { ensureDirSync, writeJSONSync, createWriteStream } from 'fs-extra';
import { visitStory } from './story-visitor';
import download from 'download';

type SbVersion = 'draft' | 'published';

export interface ICacheBuilderOpts {
  accessToken?: string;
  version: SbVersion;
  outputPath?: string;
  downloadAssets?: boolean;
  cdnPath?: string;
  forceLangFolders: boolean; // even when only one language exists, always write to a language subfolder
}

export interface IFetchStoriesOpts {
  version: SbVersion;
  pageSize: number;
  languages: string[];
  defaultLanguage: string;
}

/**
 *
 * Fetches all stories and languages using the content delivery api.
 * Languages have been tested with field level tranlations - so languages must be defined
 * in the Internationalization settings of Storyblok.
 *
 * The default language is generally called 'default' in storyblok. However, this api
 * expects a list of languages, along with the language to use as the default.
 *
 * The return result will always return the language strings as provided. That is,
 * it does not return the language name as 'default' - which is what is sent to the Storyblok API.
 *
 * @param client
 * @param opts
 * @returns
 */
export const fetchStories = async (
  client: StoryblokClient,
  opts: Partial<IFetchStoriesOpts>
) => {
  const {
    version = 'draft',
    defaultLanguage = 'en',
    languages = ['en'],
    pageSize = 100,
  } = opts;
  const stories: {
    data: ISbStoryData;
    language: string;
    path: string;
  }[] = [];

  const fetchPage = async (
    page: number,
    page_size: number = 100,
    language: string
  ) => {
    await client
      .getStories({ version, per_page: page_size, page, language })
      .then((res) => {
        res.data.stories.forEach((story) => {
          const lang = language === 'default' ? defaultLanguage : language; // convert back to normal lang code
          const path = story.full_slug // split the language out to normalize ( full_slug includes {lang}/etc )
            .split('/')
            .filter((seg) => seg !== lang)
            .join('/');

          // push to array.
          stories.push({
            data: story,
            language: lang,
            path,
          });
          // todo : could add a custom transform / pipeline handler here instead of
          // storing all data in memory.
        });
        if (page * page_size < res.total) {
          return fetchPage(page + 1, page_size, language);
        } else {
          return null;
        }
      });
  };

  for (let language of languages) {
    await fetchPage(
      1,
      pageSize,
      language === defaultLanguage ? 'default' : language
    );
  }

  return stories;
};

export const ensureFileFolder = (path: string) => {
  ensureDirSync(path.split(sep).slice(0, -1).join(sep));
};
export const writeJson = (outPath: string, data: any) => {
  // expects a file path, with last array slice being file.json
  ensureFileFolder(outPath);
  writeJSONSync(outPath, data, {
    spaces: 2,
  });
};

/** Fix any accidents with double seperators i.e. path//etc/file */
const removeEmptySep = (str: string, sep: string = '/', prefix: string = '/') =>
  `${prefix}${str
    .split(sep)
    .filter((s) => s !== '')
    .join(sep)}`;

export const buildCache = async (opts: Partial<ICacheBuilderOpts>) => {
  const accessToken = opts.accessToken;
  if (!accessToken) {
    throw new Error('Supply an access token in opts.');
  }
  const outputPath = opts.outputPath;
  if (!outputPath) {
    throw new Error('Supply an output path in opts.');
  }

  const downloadAssets = opts.downloadAssets || false;
  const forceLangFolders = opts.forceLangFolders || false;
  const cdnPath = opts.cdnPath
    ? opts.cdnPath.endsWith('/')
      ? opts.cdnPath
      : `${opts.cdnPath}/`
    : '/';
  const version = opts.version || 'draft';

  const BASE_PATH = '';

  const client = new StoryblokClient({
    accessToken: accessToken,
  });

  /**
   * Fetch spaces, languages & datasources
   **/
  const defaultLanguage = 'en';
  const spacesMe = await (await client.get('/cdn/spaces/me')).data;
  const { language_codes } = spacesMe.space;
  language_codes.unshift(defaultLanguage);
  const dataSources = await (await client.get('/cdn/datasources')).data;

  /**
   * Fetch stories.
   */

  const stories = await fetchStories(client, {
    defaultLanguage,
    languages: language_codes,
    version,
    pageSize: 100,
  });

  const cwd = process.cwd();

  /**
   * Writes spaces/me & datasources.
   */
  writeJson(
    resolve(join(cwd, outputPath, `${BASE_PATH}/datasources/data.json`)),
    dataSources
  );
  writeJson(
    resolve(join(cwd, outputPath, `${BASE_PATH}/spaces/me/data.json`)),
    spacesMe
  );

  /**
   * Write stories.
   */
  const useLangFolders =
    language_codes.length > 1 ? true : forceLangFolders ? true : false;
  const assetDownloads = new Map<
    number,
    { url: string; path: string; source: string }
  >();

  for (let story of stories) {
    const data = story.data;

    if (downloadAssets) {
      visitStory(data, {
        visit: (node) => {
          if (node.type === 'field' && node.fieldtype === 'asset') {
            const asset = node.value;

            if (!asset.is_external_url && !assetDownloads.get(asset.id)) {
              const ext = extname(asset.filename);
              const name = basename(asset.filename)
                .split('.')
                .slice(0, -1)
                .join('.');

              const filename = `${name}-${asset.id}${ext}`;
              const url =
                cdnPath +
                removeEmptySep(`${BASE_PATH}/assets/${filename}`, '/', '');

              assetDownloads.set(asset.id, {
                source: asset.filename,
                url: url,
                path: resolve(join(cwd, outputPath, `/assets/${filename}`)),
              });
            }

            // set the filename
            if (!asset.is_external_url && assetDownloads.has(asset.id)) {
              asset.filename = assetDownloads.get(asset.id)!.url;
            }
          }
        },
      });
    }

    const filePath = removeEmptySep(
      `${BASE_PATH}/stories/${useLangFolders ? story.language : ''}/${
        story.path
      }/data.json`
    );

    const writePath = resolve(join(cwd, outputPath, filePath));
    console.log('Writing :', filePath);
    writeJson(writePath, data);
  }

  /**
   * Fetch downloads
   */
  let dlPath = resolve(join(cwd, outputPath));
  for (let asset of assetDownloads.values()) {
    console.log('Downloading:', asset.source, asset.path);
    ensureFileFolder(asset.path);
    // need to check this..
    try {
      await download(asset.source, dlPath);
      //   .pipe(createWriteStream(asset.path));
    } catch (err) {
      console.log(err);
    }
  }
};
