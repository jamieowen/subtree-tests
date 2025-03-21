#!/usr/bin/env node

/**
 * TODO:
 * - Add progress indicator
 */

// const path = require('path');
// const fs = require('fs');
// const exec = require('child_process').exec;
// const ora = require('ora');
// const sharp = require('sharp');

import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import ora from 'ora';
import sharp from 'sharp';
const __dirname = path.resolve();

const sRGB = true;
const flip = true;

const d = process.argv.length > 2 ? process.argv[2] : null;
const match = process.argv.length > 3 ? process.argv[3] : null;
const ignore = process.argv.length > 4 ? process.argv[4] : null;

console.log(d, match, ignore)

const target = d ? path.resolve('./', `${d}`) : path.resolve('./');
const rootPath = !path.extname(target) ? target : path.resolve(target, '../');

const spinner = new ora();

let history = {};

const logProgress = (m) => {
    spinner.start(m);
};

const logComplete = (m) => {
    if (spinner.isSpinning) spinner.succeed();

    spinner.start();
    spinner.succeed(m);
};

async function compressBasis(file, output) {
    const mipmap = file.includes('mip');
    return new Promise((resolve, reject) => {
        exec(
            // `basisu ${sRGB ? '' : '-linear'} ${mipmap ? '-mipmap' : ''} -file ${file} ${flip ? '-y_flip' : ''} -q 255 `,
            // `basisu ${sRGB ? '' : '-linear'} ${mipmap ? '-mipmap' : ''} -file ${file} ${flip ? '-y_flip' : '' } -max_endpoints 16128 -max_selectors 16128 -no_selector_rdo -no_endpoint_rdo -comp_level 3`,
            // `basisu ${sRGB ? '' : '-linear'} -q 255 -file ${file} ${flip ? '-y_flip' : ''} -uastc -uastc_level 2 `,
            `basisu ${sRGB ? '' : '-linear'} -q 255 -file ${file} ${
                flip ? '-y_flip' : ''
            } -uastc -uastc_level 4`,

            { cwd: `${path.dirname(file)}` },
            (error) => {
                if (error) {
                    reject(error);
                } else {
                    fs.rename(file.replace(/\..+$/g, '.basis'), output.replace(/\..+$/g, '.basis'), () => {});
                    resolve();
                }
            },
        );
    });
}

async function compressKtx(file, output) {
    const p = path.parse(output);
    const dist = path.resolve(p.dir, p.name + '.ktx');

    return new Promise((resolve, reject) => {
        exec(`texture-compressor -i ${file} -o ${dist} -t pvrtc -c PVRTC1_2 -q pvrtcnormal -y`, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

function getNearestPowerOfTwo(value, fn = Math.round) {
    return 2 ** fn(Math.log(value) / Math.LN2);
}

async function prepareImage(file, { ext, scale }) {
    const meta = await sharp(file).metadata();
    // const size = Math.pow(2, Math.ceil(Math.log(Math.max(meta.width, meta.height)) / Math.log(2)));

    return await new Promise((resolve) => {
        logProgress(`preparing image ${file}`);

        const dist = file.replace(/\.(jpg|jpeg|png)/g, `_tmp${ext}.png`);

        const width = getNearestPowerOfTwo(meta.width) * scale;
        const height = getNearestPowerOfTwo(meta.height) * scale;

        exec(`ffmpeg -i ${file} -s ${width}x${height} -y  ${dist} `, (error) => {
            if (error) console.log(error);
            logComplete(`prepared ${file}`);
            resolve(dist);
        });
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

function wasFileChanged(pathname) {
    return new Promise((resolve) => {
        fs.open(pathname, 'r', (err) => {
            if (err) {
                resolve(err);
            } else {
                fs.stat(pathname, (err, data) => {
                    const modifiedAt = data.mtime.toUTCString();
                    const filePath = path.relative(process.cwd(), pathname);

                    if (history[filePath] !== modifiedAt) {
                        resolve({ changed: true, filePath, modifiedAt });
                    } else {
                        resolve({ changed: false });
                    }
                });
            }
        });
    });
}

async function parseImage(file, d) {
    // check if file changed since last time
    const res = await wasFileChanged(`${d}/${file}`);

    if (res.changed) {
        history[res.filePath] = res.modifiedAt;
    }
    const isOptimised = file.includes('optimized');

    if ((match && !file.match(match)) || (ignore && file.match(ignore)) || isOptimised) {
        //  || !res.changed
        spinner.fail(`skipped ${file}`);
        return;
    }

    file = `${d}/${file}`;

    await compressSize(file);
    await compressSize(file, { ext: '@small', scale: 0.5 });
}

async function compressSize(file, { ext = '', scale = 1 } = {}) {
    const prepared = await prepareImage(file, { ext, scale });
    // const finalPath = file.replace(/\.(jpg|jpeg|png)/g, `${ext}.png`);

    const dir = path.dirname(file);
    const fileName = path.basename(file).replace(/\.(jpg|jpeg|png)/g, `${ext}.png`);

    const destination = `${dir}/basis`;

    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }

    const dist = path.join(destination, fileName);

    // logProgress(`compressing ktx ${file}`);
    // await compressKtx(prepared, file);
    // logComplete(`compressed ${file}`);

    console.time('compress time');
    logProgress(`compressing basis ${fileName}`);
    await compressBasis(prepared, dist);
    logComplete(`compressed ${fileName}`);
    console.timeEnd('compress time');

    fs.unlink(prepared, () => {});
}

async function run() {
    // read history
    let file = fs.existsSync(`${path.resolve(__dirname)}/history.json`);
    if (!file) fs.writeFileSync(`${path.resolve(__dirname)}/history.json`, '{}', 'utf8');
    file = fs.readFileSync(`${path.resolve(__dirname)}/history.json`);
    history = JSON.parse(file);

    // if no root folder was provided
    if (!d) {
        console.log('No root folder provided.');
        console.log('');
        return;
    }

    console.log('');
    if (!path.extname(target)) {
        console.log('⚠ COMPRESSING TEXTURES ⚠');
    } else {
        console.log('⚠ COMPRESSING TEXTURE ⚠');
    }
    console.log('');

    if (!path.extname(target)) {
        await parseFolder(rootPath);
    } else {
        await parseImage(target, '');
    }

    // update history.json
    fs.writeFileSync(`${path.resolve(__dirname)}/history.json`, JSON.stringify(history), 'utf8');

    spinner.stop();

    console.log('');
    logComplete('DONE, ENJOY!');
}

run();
