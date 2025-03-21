const fs = require('fs')
const glob = require("glob-promise");
const path = require('path');
const { execSync } = require("child_process");



(async () => {

  // GET COPY
  let pngs = await glob(`${__dirname}/../${process.argv[2]}/**/*.png`)
  let jpgs = await glob(`${__dirname}/../${process.argv[2]}/**/*.jpg`)


  let filePaths = [...pngs, ...jpgs]

  for (let filePath of filePaths) {
    console.log(filePath)
    execSync(`basisu -q 255 -y_flip -file ${filePath}`)

    let dirname = path.dirname(filePath)
    let extname = path.extname(filePath)
    let filename = path.basename(filePath, extname)

    let oldPath = `./${filename}.basis`
    let newPath = `${dirname}/${filename}.basis`

    fs.renameSync(oldPath, newPath)
  }
})()




