export const useZCursor = (store, cursor = 'pointer') => {
  useZSubscribe(store, () => {
    console.log('useZCursor', store.getState());
    if (store.getState()) {
      document.body.style.cursor = cursor;
    } else {
      document.body.style.cursor = null;
    }
  });
};
