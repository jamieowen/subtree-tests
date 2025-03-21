import XHRLoader from "./XHRLoader";
class ImageLoader {
	constructor() {}

	// note: progress provided
	load_image_xhr = (item, onProgress) => {
		return new Promise((resolve, reject) => {
			XHRLoader.load_xhr_url(url, onProgress).then((asset) => {
				this.load_image_url(asset.blobUrl).then((image) => {
					resolve(image);
				});
			});
		});
	};

	// note: no progress provided
	load_image_url = (url, onProgress) => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => {
				resolve(image);
			};

			// Not sure why, seems to only be able to load from storyblok when this is commented out
			// image.crossOrigin = 'anonymous'

			image.src = url;
		});
	};
}

const imageLoader = new ImageLoader();
export default imageLoader;
