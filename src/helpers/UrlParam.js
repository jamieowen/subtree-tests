export const urlParams = new window.URLSearchParams(window.location.search);

export const getUrlBoolean = function (id, defaultValue = false) {
  let value = defaultValue;
  if (urlParams.get(id) !== null) {
    value = true;
  }
  if (urlParams.get(id) === 'false') {
    value = false;
  }
  return value;
};

export const getUrlInt = function (id, defaultValue = 0) {
  let value = defaultValue;
  if (urlParams.get(id) !== null) {
    value = parseInt(urlParams.get(id));
  }
  return value;
};

export const getUrlFloat = function (id, defaultValue = 0) {
  let value = defaultValue;
  if (urlParams.get(id) !== null) {
    value = parseFloat(urlParams.get(id));
  }
  return value;
};

export const getUrlString = function (id, defaultValue) {
  let value = defaultValue;
  if (urlParams.get(id) !== null) {
    value = urlParams.get(id);
  }
  return value;
};
