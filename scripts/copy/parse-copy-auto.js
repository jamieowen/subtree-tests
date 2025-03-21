require('dotenv');
const path = require('node:path');
const request = require('request');
const csv = require('csvtojson/v1');
const fs = require('fs-extra');
const dataObjectParser = require('dataobject-parser');

// CONFIG
const sheetKey = process.env.GOOGLE_SHEET_KEY;
const sheetName = process.env.GOOGLE_SHEET_NAME;

const langKeys = {
  en: 1,
  es: 2,
  fr: 3,
};

// PARAMS
const sheetPath = `https://docs.google.com/spreadsheets/d/${sheetKey}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
const outPath = path.resolve(__dirname, 'out');
const idKey = 0;

// WRITE TO JSON
function writeJsonFile(target, data, formatted = false) {
  const dir = path.dirname(target);
  const file = path.basename(target);
  const content = JSON.stringify(
    data,
    { encoding: 'utf8' },
    formatted ? 2 : null
  );

  // console.log("Writing JSON file...", content, { dir, file })

  // Create directory structure if it does not exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  try {
    fs.writeFileSync(`${dir}/${file}`, content);
    // console.log("Success!")
    return true;
  } catch (err) {
    console.error(`Failed to write to ${target}. ${err}`);
    return false;
  }
}

const writeJsons = async function () {
  const jsons = {};

  csv({ delimiter: [','], ignoreEmpty: true })
    .fromStream(request.get(sheetPath))
    .on('csv', (csvRow) => {
      for (const langKey in langKeys) {
        jsons[langKey] = jsons[langKey] || {};

        const id = csvRow[idKey];
        if (id !== '') {
          jsons[langKey][id] = csvRow[langKeys[langKey]].replace(/\n/g, '\r\n');
        }
      }
    })
    .on('done', () => {
      const all = {};

      for (const langKey in langKeys) {
        let data = jsons[langKey];

        // Remove empty
        data = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            if (value == null) return false;
            if (typeof value === 'string' && value.trim() === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
          })
        );

        Object.entries(data).forEach(([key, value]) => {
          if (value == 'TRUE') {
            data[key] = true;
          }
          if (value == 'FALSE') {
            data[key] = false;
          }
        });

        // Transpose
        data = dataObjectParser.transpose(data).data();

        // Add to all
        all[langKey] = data;

        // Write
        writeJsonFile(`${outPath}/${langKey}.json`, data, true);
      }
      writeJsonFile(`${outPath}/index.json`, all, true);
    });
};

writeJsons();
