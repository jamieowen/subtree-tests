const Fontmin = require('fontmin');
const fs = require('fs')
const glob = require("glob-promise");
const path = require('path');
const rename = require('gulp-rename');


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
  
  // Convert OTF to TTF
  // let otfFiles = await glob('src/assets/fonts/**/*.otf')
  // console.log(otfFiles)
  // for (let file of otfFiles) {
  //   if (!path.extname(file)) continue
  //   await toTtf(file, copy)
  // }


  // Subset
  let fontFiles = await glob('src/assets/fonts/**/*.ttf')
  for (let file of fontFiles) {
    if (file.indexOf('/subset/') >= 0) continue
    if (!path.extname(file)) continue
    await subsetFont(file, copy)
  }
})()




function toTtf(file, copy) {

  return new Promise((resolve)=> {
    let ext = path.extname(file)
    let basename = path.basename(file, ext)
    let dirname = path.dirname(file)
    let newName = `${basename}.ttf`

    console.log(file, dirname, newName)

    try {
      var fontmin = new Fontmin()
        .src(file)
        .dest(dirname)
        .use(Fontmin.otf2ttf())
        .use(rename(newName))
        .run(resolve)
    } catch (err) {
      console.log(err)
    }

  })
}


function subsetFont(file, copy) {

  return new Promise((resolve)=> {
    let ext = path.extname(file)
    let basename = path.basename(file, ext)
    let dirname = `${path.dirname(file)}/subset`
    let newName = `${basename}${ext}`
    let newFile = `${dirname}/${basename}.subset${ext}`

    var fontmin = new Fontmin()
      .src(file)
      .dest(dirname)
      .use(Fontmin.glyph({ 
          text: copy,
          hinting: false
      }))
      .use(rename(newName))
      .run(resolve)

  })
}