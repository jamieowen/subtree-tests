import { glob } from 'glob';
import * as url from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let mp4s = await glob(`${__dirname}/../${process.argv[2]}/**/*.mp4`);

let files = [...mp4s];

for (let file of files) {
  let dirname = path.dirname(file);
  let extname = path.extname(file);
  let filename = path.basename(file, extname);

  const newDir = `${dirname}-hevc`;
  const newPath = `${newDir}/${filename}${extname}`;

  if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });

  // const cmd = `ffmpeg -i ${file} -c:v libx265 -crf 28 -c:a aac -b:a 128k -tag:v hvc1 -y${newPath}`;
  const cmd = `ffmpeg -i ${file} -c:v libx265 -preset fast -an -tag:v hvc1 -y ${newPath}`;
  console.log(cmd);
  execSync(cmd);
}
