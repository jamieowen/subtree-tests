import { StandardItem } from './internal/StandardItem';
import { StandardManifest } from './internal/StandardManifest';
import Queue from '@/helpers/Queue';
import EventEmitter from '@/helpers/EventEmitter';
import EventObserver from '@/helpers/EventObserver';

export const EVENTS = {
  ITEM_COMPLETE: 'ITEM_COMPLETE',
  ITEM_PROGRESS: 'ITEM_PROGRESS',

  MANIFEST_COMPLETE: 'MANIFEST_COMPLETE',
  MANIFEST_PROGRESS: 'MANIFEST_PROGRESS',
};

class AssetService {
  static get EVENTS() {
    return EVENTS;
  }

  get EVENTS() {
    return EVENTS;
  }

  constructor() {
    Object.assign(this, EventEmitter);
    Object.assign(this, EventObserver);

    this.assets = {};
    this.items = {};
    this.manifests = {};
    this.queue = new Queue(10);
  }

  getAsset(id) {
    return this.assets[id];
  }

  getAssets(ids) {
    return ids.map((id) => this.getAsset(id));
  }

  getItem(id) {
    return this.items[id];
  }

  getManifest(id) {
    return this.manifests[id];
  }

  loadManifest = (manifest) => {
    // console.groupCollapsed(
    //   `AssetService.loadManifest: ${manifest.id} (${manifest.items.length})`
    // );
    manifest = this._registerManifest(manifest);
    return new Promise((resolve, reject) => {
      if (!manifest.flat.items.length) {
        manifest.complete = true;
        console.groupEnd();
        resolve();
        return;
      }

      let unsubscribe = null;

      unsubscribe = this.subscribeManifestLoaded(manifest, () => {
        if (unsubscribe) {
          unsubscribe();
        }
        // console.groupEnd();
        resolve(manifest.flat.items);
        // resolve(manifest.flat.items.map((i) => i.asset));
      });

      if (manifest.concurrency) {
        this.queue.concurrency = manifest.concurrency;
      }
      for (const item of manifest.flat.items) {
        this._queueItem(item);
      }
    });
  };

  loadItem = (data) => {
    return new Promise((resolve, reject) => {
      if (this.assets[data.id]) {
        resolve(this.assets[data.id]);
      }
      const item = this._registerItem(data);
      item.queued = true;
      this.queue.add(async () => {
        console.log('load item', item);
        await this._loadItem(item);
        resolve(item);
      });
    });
  };

  // MANIFEST STATE

  getManifestLoaded(manifestOrId) {
    const manifest = this.resolveManifest(manifestOrId);
    return manifest && manifest.complete;
  }

  getManifestProgress(manifestOrId) {
    const manifest = this.resolveManifest(manifestOrId);
    return manifest ? manifest.progress : 0;
  }

  subscribeManifestLoaded(manifestOrId, callback) {
    const id = this.resolveManifestId(manifestOrId);
    const manifest = this.resolveManifest(manifestOrId);

    if (manifest && manifest.complete) {
      callback(manifest);
    } else if (id) {
      return this.subscription(EVENTS.MANIFEST_COMPLETE, (manifest) => {
        if (manifest.id === id) {
          callback(manifest);
        }
      });
    }
  }

  subscribeManifestProgress(manifestOrId, handler) {
    const id = this.resolveManifestId(manifestOrId);
    const manifest = this.resolveManifest(manifestOrId);
    if (manifest && manifest.complete) {
      handler(manifest);
    } else if (id) {
      return this.subscription(EVENTS.MANIFEST_PROGRESS, (manifest) => {
        if (manifest.id === id) {
          handler(manifest);
        }
      });
    }
  }

  manifestLoadedPromise(manifestOrId) {
    return new Promise((resolve) => {
      if (this.getManifestLoaded(manifestOrId)) {
        resolve();
        return;
      }
      this.subscribeManifestLoaded(manifestOrId, resolve);
    });
  }

  resolveManifestId(manifestOrId) {
    const id =
      manifestOrId && manifestOrId.id
        ? manifestOrId.id
        : typeof manifestOrId === 'string'
          ? manifestOrId
          : null;
    return id;
  }

  resolveManifest(manifestOrId, logError = false) {
    const id = this.resolveManifestId(manifestOrId);
    // if manifest is not registered, register manifest
    const manifest = manifestOrId.id
      ? this._registerManifest(manifestOrId)
      : this.getManifest(id);
    if (logError && !manifest) {
      console.error(
        'resolveManifest : non viable manifest or not yet register id:',
        manifest
      );
    }
    return manifest;
  }

  // ITEM STATE

  getItemLoaded(itemOrId) {
    const id = this.resolveItemId(itemOrId);
    return id && this.getAsset(id) && this.getAsset(id).complete;
  }

  getItemProgress(itemOrId) {
    const id = this.resolveItemId(itemOrId);
    return id && this.getAsset(id) ? this.getAsset(id).progress : 0;
  }

  subscribeItemLoaded(itemOrId, callback) {
    const id = this.resolveItemId(itemOrId);
    const item = this.resolveItem(itemOrId);
    if (item && item.complete) {
      callback(item);
    }
    if (id) {
      return this.subscription(EVENTS.ITEM_COMPLETE, (item) => {
        if (item.id === id) {
          callback(item);
        }
      });
    }
  }

  subscribeItemProgress(itemOrId, handler) {
    const id = this.resolveItemId(itemOrId);
    const item = this.resolveItem(itemOrId);
    if (item && item.complete) {
      handler(item);
    }
    if (id) {
      return this.subscription(EVENTS.ITEM_PROGRESS, (item) => {
        if (item.id === id) {
          handler(item);
        }
      });
    }
  }

  resolveItemId(itemOrId) {
    const id =
      itemOrId && itemOrId.id
        ? ItemOrId.id
        : typeof itemOrId === 'string'
          ? itemOrId
          : null;
    return id;
  }

  resolveItem(itemOrId) {
    return this.getItem(this.resolveItemId(itemOrId));
  }

  // PRIVATE-----------------------------------------------------------------------------//

  _queueItem = (item) => {
    if (!item.queued) {
      item.queued = true;
      this.queue.add(() => {
        return this._loadItem(item);
      });
    }
  };

  _loadItem = (item) => {
    return new Promise((resolve, reject) => {
      if (this.assets[item.id]) {
        resolve();
      }
      item.on(StandardItem.EVENTS.ITEM_COMPLETE, () => {
        resolve();
      });
      item.loadItem();
    });
  };

  _registerItem(item) {
    const id = StandardItem.getItemId(item);
    if (id && !this.items[id]) {
      item = new StandardItem(item);
      item.on(StandardItem.EVENTS.ITEM_COMPLETE, (item) => {
        // console.log("manifest item loaded", item.id)
        this.assets[item.id] = item.asset;
        this.emit(EVENTS.ITEM_COMPLETE, item);
      });
      item.on(StandardItem.EVENTS.ITEM_PROGRESS, (item) => {
        // console.log("manifest item progress", item.id, , item.progress)
        this.emit(EVENTS.ITEM_PROGRESS, item);
      });
      this.items[id] = item;
    }
    return this.items[id];
  }

  _registerManifest(manifest) {
    if (this.manifests[manifest.id]) {
      return this.manifests[manifest.id];
    }

    if (!this.manifests[manifest.id]) {
      manifest = new StandardManifest(manifest, this);
      this.manifests[manifest.id] = manifest;

      manifest.on(StandardManifest.EVENTS.MANIFEST_COMPLETE, (man) => {
        // console.log('manifest loaded', man.id, man)
        this.emit(EVENTS.MANIFEST_COMPLETE, man);
      });

      manifest.on(StandardManifest.EVENTS.MANIFEST_PROGRESS, (man) => {
        // console.log('manifest progress', man.id, man.progress)
        this.emit(EVENTS.MANIFEST_PROGRESS, man);
      });
    }
    return this.manifests[manifest.id];
  }
}

const assetService = new AssetService();
export default assetService;
