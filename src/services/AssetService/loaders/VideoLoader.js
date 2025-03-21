class VideoLoader {
	load_video_item = (item, onProgress, el = null) => {
		return new Promise((resolve) => {
			el = el || document.createElement("video");
			for (const [key, value] of Object.entries(item.options.attributes)) {
				if (value) {
					el.setAttribute(key, value);
				}
			}
			this.loadBlob(item.url, onProgress).then((url) => {
				el.src = url;
				this._fixIOSVideo(el);
				resolve(el);
			});
		});
	};

	_fixIOSVideo(el) {
		// ios fix to display video after setting blob as src
		el.play().then(
			() => {
				el.pause();
			},
			(err) => {
				el.pause();
			},
		);
	}

	loadBuffer = (src, onProgress) => {
		// const onReady = () => {
		//   el.oncanplaythrough = null
		//   el.oncanplaythrough = null
		// el.onprogress = null
		// el.ontimeupdate = null
		// }
		// const onReadyStateChange = () => {
		//   if (el.readyState < 4) {return}
		//   if (preload === PRELOAD_MODES.BUFFER) onReady()
		// }
		//
		// el.oncanplaythrough = onReadyStateChange(evt)
		// el.onreadystatechange = onReadyStateChange(evt)
		// el.onprogress = onProgress(evt)
		// el.ontimeupdate = onProgress(evt)
		//
		// el.onloadedmetadata =(evt) => {
		//   if (preload === PRELOAD_MODES.NONE) onReady()
		// }
		//
		// el.muted = true
		// el.setAttribute('muted', true)
		// el.src = src
		// el.load()
	};

	loadBlob = (src, onProgress) => {
		return new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			xhr.responseType = "blob";

			xhr.onload = () => {
				const reader = new FileReader();
				reader.onloadend = () => {
					const byteCharacters = atob(
						reader.result.slice(reader.result.indexOf(",") + 1),
					);
					const byteNumbers = new Array(byteCharacters.length);
					for (let i = 0; i < byteCharacters.length; i++) {
						byteNumbers[i] = byteCharacters.charCodeAt(i);
					}

					const byteArray = new Uint8Array(byteNumbers);
					const blob = new Blob([byteArray], { type: "video/mp4" });
					const url = URL.createObjectURL(blob);
					resolve(url);
				};

				reader.readAsDataURL(xhr.response);
			};

			xhr.open("GET", src);
			xhr.onerror = (err) => {
				console.log("** An error occurred during the transaction - ", err);
			};
			xhr.onprogress = (event) => {
				const progress = event.loaded / event.total;
				console.log("video xhr loading", progress.toFixed(2), src);
				if (onProgress) {
					onProgress(event);
				}
			};
			xhr.send();
		});
	};
}

const videoLoader = new VideoLoader();
export default videoLoader;
