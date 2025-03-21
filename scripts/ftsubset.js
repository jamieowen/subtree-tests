import { glob } from 'glob';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let a = process.argv[2] || '';
let globPath = `${__dirname}../public/assets/fonts/**/*`;
let otfs = await glob(`${globPath}.otf`);
let ttfs = await glob(`${globPath}.ttf`);

// console.log([...otfs, ...ttfs]);

(async () => {
  // GET COPY
  // let copyFiles = await glob('src/locales/**/*');
  // let copy = '';
  // for (let file of copyFiles) {
  //   let contents = fs.readFileSync(file).toString();
  //   copy += contents;
  // }
  let copy = '';
  copy += 'abcdefghijklmnopqrstuvwxyz';
  copy += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  copy += '0123456789';
  copy += ',.?! @#$%^&*()_+-=';

  const removeDuplicate = (e) => [...new Set(e)].sort().join('');
  copy = removeDuplicate(copy);
  const tempCopyPath = `${__dirname}/../${process.argv[2]}/temp-copy.txt`;
  fs.writeFileSync(tempCopyPath, copy);

  // SUBSET FONT FILES
  let files = [...otfs, ...ttfs];

  for (let file of files) {
    if (file.indexOf('/subset/') >= 0) continue;

    let dirname = path.dirname(file);
    let extname = path.extname(file);
    let filename = path.basename(file, extname);

    let outputName = `${dirname}/subset/${filename}${extname}`;

    if (!fs.existsSync(`${dirname}/subset`)) {
      fs.mkdirSync(`${dirname}/subset`, { recursive: true });
    }
    execSync(
      `pyftsubset ${file} --text-file=${tempCopyPath} --output-file=${outputName}`
    );
  }

  fs.unlinkSync(tempCopyPath);
})();
