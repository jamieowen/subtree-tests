import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';
import * as url from 'url';
import path from 'path';
import fs, { unlink } from 'fs';
import { exec, execSync } from 'child_process';
import { imageSizeFromFile } from 'image-size/fromFile';
import Queue from 'queue';
import { promisify } from 'util';

const execAsync = promisify(exec);
const unlinkAsync = promisify(fs.unlink);
const copyFileAsync = promisify(fs.copyFile);

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// let globPath = `${__dirname}/../${process.argv[2]}/**/*`
let a = process.argv[2] || 'textures';
let globPath = `${__dirname}../public/assets/${a}/**/*`;

let filePaths = await glob(globPath);

console.log(filePaths);

filePaths = filePaths.filter(
  (filePath) => !(filePath.match(/(^|\W)compressed($|\W)/) ? true : false)
);
// filePaths = filePaths.map((filePath) => filePath.replace(/(\s+)/g, '\\$1'));
const sameDir = process.argv.includes('-sameDir');

function checkPowOf2(number) {
  if (number && !(number & (number - 1))) {
    return true;
  }
  return false;
}

const processFile = async (filePath) => {
  if (fs.lstatSync(filePath).isDirectory()) return;

  const dirname = path.dirname(filePath);
  const extname = path.extname(filePath);
  const filename = path.basename(filePath, extname);
  let newDir = dirname.replace('/images', '/images-o');
  newDir = newDir.replace('/textures', '/textures-o');
  newDir = newDir.replace('/spritesheets', '/spritesheets-o');
  let newPath = `${newDir}/${filename}`;
  newPath = newPath.replace(/(\s+)/g, '\\$1');

  if (sameDir) newPath = `${dirname}/${filename}`;
  if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
  // console.log('filePath', filePath);
  // console.log('dirname', dirname);
  // console.log('extname', extname);
  // console.log('processFile', filePath, filename, extname);
  // console.log('newPath', newPath);

  // continue
  switch (extname) {
    case '.gif':
    case '.jpg':
    case '.jpeg':
    case '.JPG':
    case '.png':
    case '.PNG':
    case '.tif':
    case '.tiff':
      let path = filePath.replace(/(\s+)/g, '\\$1');

      const dimensions = await imageSizeFromFile(path);
      // console.log('dimensions', dimensions);
      // console.log(filename, dimensions.width, dimensions.height);
      if (!checkPowOf2(dimensions.width) || !checkPowOf2(dimensions.height)) {
        console.log(
          'Not Power of 2',
          filename,
          dimensions.width,
          dimensions.height
        );
      }
      if (dimensions.width > 4096 || dimensions.height > 4096) {
        console.log('Too Big', filename, dimensions.width, dimensions.height);
      }

      const cmds = [
        `cwebp -quiet ${path} -o ${newPath}.webp`,
        `convert ${path} +profile "*" ${newPath}.png`,
        // `convert ${path} +profile "*" ${newPath}.png`,
        `basisu -ktx2 ${newPath}.png -output_file ${newPath}.ktx2`,
        `basisu -ktx2 -q 255 ${newPath}.png -output_file ${newPath}-hq.ktx2`,
        `basisu -ktx2 -uastc ${newPath}.png -output_file ${newPath}-uastc.ktx2`,
      ];

      for (let cmd of cmds) {
        await execAsync(cmd);
      }

      await unlinkAsync(`${newPath}.png`);

      break;
    default:
      await copyFileAsync(filePath, `${newDir}/${filename}${extname}`);
      break;
  }
};

for (let filePath of filePaths) {
  await processFile(filePath);
}

// const q = new Queue({ concurrency: 4, results: [] });
// filePaths.forEach((filePath) => {
//   q.push(() => {
//     processFile(filePath);
//   });
// });

// const init = () => {
//   return new Promise((resolve) => {
//     q.start(resolve);
//   });
// };
// init();
