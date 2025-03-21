class ContextMenuService {
  constructor() {}

  onContextMenu(evt) {
    evt.preventDefault();
  }

  disable() {
    window.addEventListener('contextmenu', this.onContextMenu);
  }

  enable() {
    window.removeEventListener('contextmenu', this.onContextMenu);
  }
}

const service = new ContextMenuService();
window.ContextMenuService = service;
export default service;
