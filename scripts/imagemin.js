const imagemin = require('imagemin-overwrite');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
 
(async () => {
  let path = `${process.argv[2]}/**/*.{jpg,png,gif}`
  // console.log('path', path)
  const files = await imagemin([path], {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
          quality: [0.6, 0.8]
      }),
      imageminGifsicle({
        optimizationLevel: 3,
      })
    ]
  });

  // console.log(files);
  //=> [{data: <Buffer 89 50 4e …>, sourcePath: 'images/foo.jpg', destinationPath: 'images/foo.jpg'}, …]
})();