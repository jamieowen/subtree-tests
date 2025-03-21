import { glob } from 'glob';
import * as url from 'url';
import path from 'path';
import fs from 'fs';
import * as fsExtra from 'fs-extra';
import { execSync } from 'child_process';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let a = process.argv[2] || '';
let globPath = `${__dirname}../public/assets/models/${a}/**/*`;

let gltfs = await glob(`${globPath}.gltf`);
let glbs = await glob(`${globPath}.glb`);

let files = [...gltfs, ...glbs];

console.log(globPath, files);

for (let file of files) {
  let dirname = path.dirname(file);
  let extname = path.extname(file);
  let filename = path.basename(file, extname);

  const newDir = dirname.replace('/models', '/models-o');
  // const newPath = `${newDir}/${filename}${extname}`;

  // if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
  const tempDir = `${newDir}/${filename}`;
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(`${newDir}/${filename}`, { recursive: true });
  }

  // execSync(`gltf-transform optimize --join false --simplify false ${file} ${newPath}`);
  const processedPath = `${dirname}/${filename}-processed${extname}`;
  const cmds = [
    `gltf-pipeline -i ${file} -t`,
    `gltf-transform dedup ${file} ${newDir}/${filename}/dedup.glb`,
    // `gltf-transform instance ${newDir}/${filename}/dedup.glb ${newDir}/${filename}/instance.glb`,
    // `gltf-transform palette ${newDir}/${filename}/instance.glb ${newDir}/${filename}/palette.glb`,
    `gltf-transform flatten ${newDir}/${filename}/dedup.glb ${newDir}/${filename}/flatten.glb`,
    // `gltf-transform join ${newDir}/${filename}/flatten.glb ${newDir}/${filename}/join.glb`,
    // `gltf-transform dequantize ${newDir}/${filename}/join.glb ${newDir}/${filename}/dequantize.glb`,
    `gltf-transform weld ${newDir}/${filename}/flatten.glb ${newDir}/${filename}/weld.glb`,
    `gltf-transform simplify ${newDir}/${filename}/weld.glb ${newDir}/${filename}/simplify.glb --error 0.0001`,
    `gltf-transform resample ${newDir}/${filename}/simplify.glb ${newDir}/${filename}/resample.glb`,
    `gltf-transform prune ${newDir}/${filename}/resample.glb ${newDir}/${filename}/prune.glb --keep-attributes`,
    `gltf-transform sparse ${newDir}/${filename}/prune.glb ${newDir}/${filename}/sparse.glb`,
    `gltf-transform resize ${newDir}/${filename}/sparse.glb ${newDir}/${filename}/resize.glb --width 4 --height 4`,
    `gltf-transform etc1s ${newDir}/${filename}/resize.glb ${newDir}/${filename}/etc1s.glb`,
    `gltf-transform draco ${newDir}/${filename}/etc1s.glb ${newDir}/${filename}.glb`,
    // `gltf-transform ${filename}/meshopt --level medium ${newDir}/${filename}/resize.glb ${newDir}/${filename}.glb`,
    `gltf-transform gzip ${newDir}/${filename}.glb`,
  ];

  // const cmds = [
  //   `gltf-pipeline -i ${file} -t`,
  //   `gltf-transform optimize --prune false --prune-attributes false --prune-leaves false --prune-solid-textures false --compress draco --texture-compress ktx2 --texture-size 8 --join false ${processedPath} ${newDir}/${filename}.glb `,
  //   `gltf-transform gzip ${newDir}/${filename}.glb `,
  // ];

  for (let cmd of cmds) {
    console.log(cmd);
    execSync(cmd);
  }

  // Unlink temp glb folder
  fsExtra.emptyDirSync(tempDir);
  fs.rmdirSync(tempDir);

  // Unlink processed glb
  fs.unlinkSync(processedPath);

  // Unlink seperated textures
  // let texturePaths = await glob(`${dirname}/**/*.{png,jpg,jpeg}`);
  // for (let texturePath of texturePaths) {
  //   fs.unlinkSync(texturePath);
  // }
}
