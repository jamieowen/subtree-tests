export const getStyle = (element) => {
  const style = window.getComputedStyle(element);
  const margin = {
    left: parseInt(style['margin-left']),
    right: parseInt(style['margin-right']),
    top: parseInt(style['margin-top']),
    bottom: parseInt(style['margin-bottom']),
  };
  const padding = {
    left: parseInt(style['padding-left']),
    right: parseInt(style['padding-right']),
    top: parseInt(style['padding-top']),
    bottom: parseInt(style['padding-bottom']),
  };
  const border = {
    left: parseInt(style['border-left-width']),
    right: parseInt(style['border-right-width']),
    top: parseInt(style['border-top-width']),
    bottom: parseInt(style['border-bottom-width']),
  };

  return {
    style,
    margin,
    padding,
    border,
  };
};

export const getElementRect = (element) => {
  let rect = element.getBoundingClientRect();
  const style = getStyle(element);
  const bbottom = rect.bottom ? rect.bottom - style.border.bottom : rect.top;

  rect = {
    top: rect.top + style.border.top,
    bottom: bbottom,
    right: rect.right - style.border.right,
    left: rect.left + style.border.left,
  };

  rect.height = rect.bottom - rect.top;
  rect.width = rect.right - rect.left;

  if (window.scrollY !== undefined) {
    rect.top += window.scrollY;
    rect.left += window.scrollX;
  }

  rect.right = rect.left + rect.width;
  rect.bottom = rect.top + rect.height;

  return rect;
};
