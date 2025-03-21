import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';
import * as url from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let filePaths = await glob(`${__dirname}/../${process.argv[2]}/**/*`);
filePaths = filePaths.filter(
  (filePath) => !(filePath.match(/(^|\W)compressed($|\W)/) ? true : false)
);
// filePaths = filePaths.map((filePath) => filePath.replace(/(\s+)/g, '\\$1'));
const sameDir = process.argv.includes('-sameDir');
const isHD = process.argv.includes('-hd');

for (let filePath of filePaths) {
  if (fs.lstatSync(filePath).isDirectory()) continue;

  const dirname = path.dirname(filePath);
  const extname = path.extname(filePath);
  const filename = path.basename(filePath, extname);
  let newDir = dirname.replace('/images', '/images-next');
  newDir = newDir.replace('/textures', '/textures-next');
  let newPath = `${newDir}/${filename}.webp`;
  newPath = newPath.replace(/(\s+)/g, '\\$1');

  if (sameDir) newPath = `${dirname}/${filename}.webp`;
  if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
  console.log('filePath', filePath);
  console.log('dirname', dirname);
  console.log('extname', extname);
  console.log('filename', filename);
  console.log('newPath', newPath);

  // continue
  switch (extname) {
    case '.gif':
      execSync(`gif2webp -q 50 -m 6 -lossy ${filePath} -o ${newPath}`);
      break;
    case '.jpg':
    case '.jpeg':
    case '.JPG':
    case '.png':
    case '.PNG':
    case '.tif':
    case '.tiff':
      let path = filePath.replace(/(\s+)/g, '\\$1');
      isHD
        ? execSync(`cwebp -q 100 ${path} -o ${newPath}`)
        : execSync(`cwebp -q 50 -m 6 ${path} -o ${newPath}`);
      break;
    default:
      fs.copyFileSync(filePath, `${newDir}/${filename}${extname}`);
      break;
  }
}
