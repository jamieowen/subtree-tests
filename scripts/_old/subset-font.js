const subsetFont = require('subset-font');





const doSubsetFont = async function () {

  var mySfntFontBuffer = fontkit.openSync(file);

  const subsetBuffer = await subsetFont(mySfntFontBuffer, 'Hello, world!', {
    targetFormat: 'sfnt',
  });

}


doSubsetFont()