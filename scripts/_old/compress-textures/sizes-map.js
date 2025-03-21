#!/usr/bin/env node

const ora = require('ora');
const Path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const d = process.argv.length > 2 ? process.argv[2] : null;
const outputFolder = process.argv.length > 3 ? process.argv[3] : null;
const target = d ? Path.resolve('./', `${d}`) : Path.resolve('./');
const rootPath = !Path.extname(target) ? target : Path.resolve(target, '../');

let spinner = new ora();

const map = {};

async function prepareImage(file) {
    const meta = await sharp(file).metadata();
    // const size = Math.pow(2, Math.floor(Math.log(Math.min(meta.width, meta.height)) / Math.log(2)));

    const relative = Path.relative(Path.resolve(process.cwd(), target), file).toLowerCase();

    map[relative] = { width: meta.width, height: meta.height };
}

function parseFolder(d) {
    return new Promise((resolve) => {
        fs.readdir(d, async (err, files) => {
            for (let file of files) {
                if (!Path.extname(file) && !file.startsWith('.') && file !== 'basis') {
                    await parseFolder(`${d}/${file}`);
                } else if (file.match(/\.png|\.jpg/)) {
                    await parseImage(file, d);
                }
            }
            resolve();
        });
    });
}

async function parseImage(file, d) {
    file = `${d}/${file}`;
    await prepareImage(file);
    spinner.start();
}

async function run() {
    console.log('');
    console.log('⚠ GENERATING SIZES MAP ⚠');
    console.log('');

    spinner.start();

    if (!Path.extname(target)) {
        await parseFolder(rootPath);
    } else {
        await parseImage(target, '');
    }

    fs.writeFile(Path.resolve(outputFolder, 'image-data.json'), JSON.stringify(map), () => {});

    spinner.stop();

    console.log('✔︎ DONE, ENJOY!');
    console.log('');
}

run();
