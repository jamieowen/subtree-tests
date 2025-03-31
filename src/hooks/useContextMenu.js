export const useContextMenu = () => {
  const onContextMenu = (evt) => {
    evt.preventDefault();
  };

  const disable = () => {
    window.addEventListener('contextmenu', onContextMenu);
  };

  const enable = () => {
    window.removeEventListener('contextmenu', onContextMenu);
  };

  return {
    enable,
    disable,
  };
};
