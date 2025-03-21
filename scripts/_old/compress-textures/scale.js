#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const ora = require('ora');
const sharp = require('sharp');

const d = process.argv.length > 2 ? process.argv[2] : null;
const match = process.argv.length > 3 ? process.argv[3] : null;
const target = d ? path.resolve('./', `${d}`) : path.resolve('./');
const rootPath = !path.extname(target) ? target : path.resolve(target, '../');

let spinner = new ora();

const logProgress = (m) => {
    spinner.start(m);
};

const logComplete = (m) => {
    if (spinner.isSpinning) spinner.succeed();

    spinner.start();
    spinner.succeed(m);
};

async function scaleImage(file) {
    const meta = await sharp(file).metadata();

    return await new Promise((resolve) => {
        logProgress(`scaling image ${file}`);

        const dist = file.replace(/\.(jpg|jpeg|png)/g, '@half.png');

        exec(
            `ffmpeg -i ${file} -s ${Math.round(meta.width * 0.5)}x${Math.round(meta.height * 0.5)} -y  ${dist} `,
            (error) => {
                if (error) console.log(error);
                logComplete(`scaled ${file}`);
                resolve(dist);
            },
        );
    });
}

function parseFolder(d) {
    return new Promise((resolve) => {
        fs.readdir(d, async (err, files) => {
            for (let file of files) {
                if (!path.extname(file) && !file.startsWith('.') && file !== 'basis') {
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
    if ((match && !file.match(match)) || file.includes('@half')) {
        spinner.fail(`skipped ${file}`);
        return Promise.resolve();
    }

    file = `${d}/${file}`;

    await scaleImage(file);
}

async function run() {
    console.log('');

    if (!path.extname(target)) {
        console.log('⚠ SCALING IMAGES ⚠');
    } else {
        console.log('⚠ SCALING IMAGE ⚠');
    }
    console.log('');

    if (!path.extname(target)) {
        await parseFolder(rootPath);
    } else {
        await parseImage(target, '');
    }

    spinner.stop();

    console.log('');
    logComplete('DONE, ENJOY!');
}

run();
