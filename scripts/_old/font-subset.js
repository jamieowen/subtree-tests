const fontkit = require('fontkit');
const fs = require('fs')
const glob = require("glob-promise");
const path = require('path');


(async () => {

  // GET COPY
  let copyFiles = await glob('locales/**/*')
  let copy = ''
  for (let file of copyFiles) {
    let contents = fs.readFileSync(file).toString()
    copy += contents
  }

  const removeDuplicate = e => [...new Set(e)].sort().join('')
  copy = removeDuplicate(copy)
  console.log(copy)

  let fontFiles = await glob('src/assets/fonts/**/*')
  for (let file of fontFiles) {
    if (file.indexOf('/sub/') >= 0) continue
    if (!path.extname(file)) continue
    // console.log(file)
    subsetFont(file, copy)
  }
})()





function subsetFont(file, copy) {

  // open a font synchronously
  var font = fontkit.openSync(file);

  var run = font.layout(copy);

  // create a font subset
  var subset = font.createSubset();
  run.glyphs.forEach(function (glyph) {
    subset.includeGlyph(glyph);
  });


  // Write to new path
  let ext = path.extname(file)
  let basename = path.basename(file, ext)
  let dirname = path.dirname(file)
  let dir = `${dirname}/sub/`
  let newFile = `${dir}${basename}${ext}`

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  subset
    .encodeStream()
    .pipe(fs.createWriteStream(newFile));

  
}