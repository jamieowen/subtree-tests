class FontLoader {
  constructor() {}

  load_font_item = (item, onProgress) => {
    return new Promise((resolve, reject) => {
      // let url = `url(${item.url})`
      // console.log(item.id, `url(${item.url})`, item.options);
      const font = new FontFace(item.name, `url(${item.url})`, item.options);
      font.load().then(() => {
        // console.log(item.id, `url(${item.url})`, 'loaded');
        document.fonts.add(font);
        resolve();
      });
    });
  };
}

const fontLoader = new FontLoader();
export default fontLoader;
