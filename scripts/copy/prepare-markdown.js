/**
 * Script for adding line break tags in a Markdown file.
 */

const path = require('path');
const fs = require('fs-extra');

const files = process.argv.slice(2);
const basePath = path.resolve(__dirname, '..', '..', 'content', 'en');

/**
 * Writes the given data contents to a given target file. If the directory
 * structure designated in the target path does not exist, it will be created.
 */
const writeFile = (target, data) => {
  const dir = path.dirname(target);
  const file = path.basename(target);

  console.log('Writing file...', data, { dir, file });

  // Create directory structure if it does not exist
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  try {
    fs.writeFileSync(`${dir}/${file}`, data, 'utf-8');
    console.log('Success!');
    return true;
  } catch (err) {
    console.error(`Failed to write to ${target}. ${err}`);
    return false;
  }
};

for (const file of files) {
  const filePath = path.resolve(basePath, file);

  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = content
    .split(/\r?\n/)
    .filter((line) => String(line).trim() && !/<br \/>/g.test(line))
    .join('\n\n<br />\n\n');

  writeFile(filePath, newContent);
}
