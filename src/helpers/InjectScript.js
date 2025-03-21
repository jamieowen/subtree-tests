export const injectScript = function (src, opts = {}) {
  return new Promise((resolve) => {
    // Create script element
    const script = document.createElement('script');
    if (opts.id) {
      if (document.querySelector(`#${opts.id}`)) {
        return resolve();
      }
      script.id = opts.id;
    }
    if (opts.async) {
      script.async = true;
    }
    if (opts.defer) {
      script.defer = true;
    }
    script.src = src;
    script.onload = resolve;

    // Inject it
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
  });
};

export default injectScript;
