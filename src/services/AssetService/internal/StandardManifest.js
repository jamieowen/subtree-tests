import StandardItem from "./StandardItem";
import EventEmitter from "@/helpers/EventEmitter";
import EventObserver from "@/helpers/EventObserver";

export const EVENTS = {
	MANIFEST_COMPLETE: "MANIFEST_COMPLETE",
	MANIFEST_PROGRESS: "MANIFEST_PROGRESS",
};

export class StandardManifest {
	static get EVENTS() {
		return EVENTS;
	}

	get EVENTS() {
		return EVENTS;
	}

	constructor(manifest, MultiAssetService) {
		this.multiAssetService = MultiAssetService;
		Object.assign(this, EventEmitter);
		Object.assign(this, EventObserver);

		this.id = manifest.id;
		this.original_manifest = manifest;
		this.complete = false;
		this._progress = 0;

		const { items, itemIds, manifestIds } = this._getFlats(manifest);

		this.flat = {
			items,
			itemIds,
			manifestIds,
		};

		// listen to each item in manifest for load, recalc loaded/progress on each
		this.flat.items.forEach((v, i, a) => {
			v.on(StandardItem.EVENTS.ITEM_COMPLETE, this.onItemComplete);
		});

		this.calcProgress();
	}

	onItemComplete = (item) => {
		this.calcProgress();
	};

	calcProgress() {
		if (this.complete) {
			return;
		}

		let p = 0;
		const a = this.flat.items;
		const len = a.length;
		for (let i = 0; i < len; i++) {
			const item = a[i];
			p += item.progress;
			// console.log(300, item.url, item.progress, item.complete)
		}
		this.progress = p / len;
		// console.log('StandardManifest.progress', this.progress)
	}

	get progress() {
		return this._progress;
	}

	set progress(v) {
		const old = this._progress;
		this._progress = v;
		if (this.progress !== old) {
			this.emit(EVENTS.MANIFEST_PROGRESS, this);
		}
		if (this.progress === 1) {
			this._setComplete();
		}
	}

	// PRIVATE-------------------------------------------------------------------

	_setComplete() {
		this.complete = true;
		this.emit(EVENTS.MANIFEST_COMPLETE, this);
	}

	uniqBy(a, key = null) {
		if (key) {
			const seen = new Set();
			return a.filter((item) => {
				const k = item[key];
				return seen.has(k) ? false : seen.add(k);
			});
		}

		return [...new Set(a)];
	}

	_getFlats(manifest) {
		const flat = {
			items: [],
			itemIds: [],
			manifestIds: [],
		};

		for (const item of manifest.items) {
			//
			// is child manifest
			if (item.items) {
				const child_manifest = this.multiAssetService._registerManifest(item); // ----side effect
				flat.items = flat.items.concat(child_manifest.flat.items);
				flat.itemIds = flat.itemIds.concat(child_manifest.flat.itemIds);
				flat.manifestIds.push(item.id);
				flat.manifestIds = flat.manifestIds.concat(
					child_manifest.flat.manifestIds,
				);
				//
			} else {
				//
				// is manifest item
				const id = StandardItem.getItemId(item);
				if (id) {
					if (!this.multiAssetService.getItem(id)) {
						// ----side effect
						this.multiAssetService._registerItem(item); // ----side effect
					}
					flat.items.push(this.multiAssetService.getItem(id)); // ----side effect
					flat.itemIds.push(id);
				}
			}
		}

		// remove duplicates in items
		flat.items = this.uniqBy(flat.items, "id");
		flat.itemIds = this.uniqBy(flat.itemIds);
		flat.manifestIds = this.uniqBy(flat.manifestIds);

		return flat;
	}

	static isViableManifest(manifest, throwError = false) {
		if (!(manifest.id && manifest.items && manifest.items.length > 0)) {
			if (throwError) {
				throw new Error("malformed manifest:", manifest);
			}
			return false;
		}
		return true;
	}
}

export default StandardManifest;
