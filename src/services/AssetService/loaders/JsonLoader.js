import { FileLoader } from 'three';

let loader = new FileLoader();
loader.setResponseType('json');

class JsonLoader {
  constructor() {}

  load_json = (url, onProgress) => {
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (data) => {
          resolve(data);
        },
        (event) => {
          if (onProgress) {
            onProgress(event);
          }
        },
        (err) => {
          console.log('error loading:', url);
          console.log(err);
          reject(err);
        }
      );
    });
  };
}

const jsonLoader = new JsonLoader();
export default jsonLoader;
