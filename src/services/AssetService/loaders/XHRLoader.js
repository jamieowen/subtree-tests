class XHRLoader {
	constructor() {}

	load_xhr_url = (url, onProgress) => {
		return new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			xhr.crossOrigin = "anonymous";
			xhr.responseType = "blob";

			// evt.loaded, evt.total
			if (onProgress) {
				xhr.onprogress = onProgress;
			}

			xhr.onload = () => {
				const blobUrl = window.URL ? URL.createObjectURL(xhr.response) : null;
				resolve({
					xhr,
					blobUrl,
				});
			};

			xhr.open("GET", url);
			xhr.send();
		});
	};
}

const xhrLoader = new XHRLoader();
export default xhrLoader;
