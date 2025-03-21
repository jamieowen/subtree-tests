// const execSync = require('child_process').execSync;
// const path = require('path');
// const fs = require('fs');

import { glob } from 'glob';
import * as url from 'url';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const folder = process.argv.length > 2 ? process.argv[2] : null;

// folder to recursively parse
// const rawDir = path.join('src', 'assets', 'png-sequence');
// const exportDir = path.join('src', 'assets', 'spritesheets');
const rawDir = `${__dirname}../public/assets/png-sequences`;
const exportDir = `${__dirname}../public/assets/spritesheets`;

// texturepacker settings
const format = 'json'; // json-array
const detectIdenticalSprites = '--disable-auto-alias';
const allowRotation = '--disable-rotation';
const trimSpriteNames = '--trim-sprite-names';
const sizeConstraints = 'POT';
const trimMode = 'Trim';
const scale = '1';
const multipack = '--multipack';
const maxSize = 2048 * 2;
const alphaHandling = 'PremultiplyAlpha';

const parseDir = (directory, _folder) => {
  const dir = path.join(directory, _folder || '');

  let numFiles = 0;
  fs.readdirSync(dir).forEach((file) => {
    const p = path.join(dir, file);

    if (p.endsWith('.png')) {
      numFiles += 1;
    } else if (fs.lstatSync(p).isDirectory()) {
      parseDir(p);
    }
  });

  const currDir = path.relative(rawDir, dir);

  // const d = path.resolve(__dirname, '..', '..');
  // const r = d;

  if (numFiles > 0) {
    const finalDir = path.join(exportDir, currDir);

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const data = path.resolve(
      path.join(finalDir, `data-${multipack ? '{n}' : ''}.json`)
    );
    const sheet = path.resolve(
      path.join(finalDir, `data-${multipack ? '{n}' : ''}.png`)
    );
    const cmd = `TexturePacker ${dir} --format ${format} --data ${data} --max-size ${maxSize} --sheet ${sheet} ${trimSpriteNames} --size-constraints ${sizeConstraints} ${multipack} ${allowRotation} --trim-mode ${trimMode} --scale ${scale} --alpha-handling ${alphaHandling}`;

    execSync(cmd);

    console.log(`- Finished generating sprites ${finalDir}`);
  }
};

const cleanDir = (dir, folder) => {
  fs.rmdirSync(path.join(dir, folder || ''), { recursive: true });
  fs.mkdirSync(path.join(dir, folder || ''));
};

cleanDir(exportDir, folder);
parseDir(rawDir, folder);

console.log('');
console.log('- Complete!');
