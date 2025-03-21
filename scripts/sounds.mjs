import { glob } from 'glob';
import * as url from 'url';
import path from 'path';
import fs from 'fs';
import * as fsExtra from 'fs-extra';
import { execSync } from 'child_process';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let a = process.argv[2] || '';
let globPath = `${__dirname}../public/assets/sounds/${a}/**/*`;

let wavs = await glob(`${globPath}.wav`);
let mp3s = await glob(`${globPath}.mp3`);
let m4as = await glob(`${globPath}.m4a`);

let files = [...wavs, ...mp3s];

console.log(globPath, files);

for (let file of files) {
  let dirname = path.dirname(file);
  let extname = path.extname(file);
  let filename = path.basename(file, extname);

  const newDir = dirname.replace('/sounds', '/sounds-o');
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(`${newDir}`, { recursive: true });
  }

  let newPath = `${newDir}/${filename}${extname}`;
  console.log(file);

  execSync(
    `lame -b 96 -B 96 --resample 44.1 --vbr-new --silent -V 6 ${file} ${newPath}`
  );
}
