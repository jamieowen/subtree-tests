export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export const isOdd = (int) => {
  return int % 2;
};

export const clamp = (num, min, max) => {
  if (min === undefined) {
    min = 0;
  }
  if (max === undefined) {
    max = 1;
  }
  if (num < min) {
    return min;
  }
  if (num > max) {
    return max;
  }
  return num;
};

export const roundToPlaces = (value, decimalPlaces) => {
  const roundMultiplier = 10 ** decimalPlaces;
  return Math.round(value * roundMultiplier) / roundMultiplier;
};

export const timeFormat = (secs) => {
  const secNum = parseInt(secs, 10); // don't forget the second param
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - hours * 3600) / 60);
  let seconds = secNum - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0 ${hours}`;
  }
  if (minutes < 10) {
    minutes = `0 ${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0 ${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

/* POINTS */

export const lerpPoint = (sourcePoint, targetPoint, blendAmount) => {
  const point = {};
  point.x = sourcePoint.x + blendAmount * (targetPoint.x - sourcePoint.x);
  point.y = sourcePoint.y + blendAmount * (targetPoint.y - sourcePoint.y);
  return point;
};

export const copyPoint = (sourcePoint) => {
  return {
    x: sourcePoint.x,
    y: sourcePoint.y,
  };
};

export const getPointDistance = (sourcePoint, targetPoint) => {
  const deltaX = getDistance(targetPoint.x, sourcePoint.x);
  const deltaY = getDistance(targetPoint.y, sourcePoint.y);
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

export const getDistance = (valueA, valueB) => {
  return valueB - valueA;
};

export const getRotatedPoint = (point, angle) => {
  const angleRad = angle * DEG_TO_RAD;
  const rotatedPoint = {};
  rotatedPoint.x = point.x * Math.cos(angleRad) + point.y * Math.sin(angleRad);
  rotatedPoint.y = point.y * Math.cos(angleRad) - point.x * Math.sin(angleRad);
  return rotatedPoint;
};

/* ANGLES */

export const toRadians = (value) => {
  return value * DEG_TO_RAD;
};

export const toDeg = (value) => {
  return value * RAD_TO_DEG;
};

export const getProjectionOfAngle = (angle) => {
  const point = {
    x: Math.sin(angle * DEG_TO_RAD),
    y: -Math.cos(angle * DEG_TO_RAD),
  };
  return point;
};

export const getAngle = (deltaY, deltaX) => {
  const rad = Math.atan2(deltaX, -deltaY);
  return rad * RAD_TO_DEG;
};

export const getAngleBetweenPoints = (sourcePoint, targetPoint) => {
  const deltaX = targetPoint.x - sourcePoint.x;
  const deltaY = targetPoint.y - sourcePoint.y;
  return getAngle(deltaY, deltaX);
};

// x,y is the point to test
// cx, cy is circle center, and radius is circle radius
export const pointInCircle = (x, y, cx, cy, radius) => {
  const distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
};

export const isInEllipse = (x, y, cx, cy, w, h) => {
  const dx = x - cx;
  const dy = y - cy;
  return (dx * dx) / (w * w) + (dy * dy) / (h * h);
};

/* RANDOM */

/*
this does not create correct distrubtions for integers between start and
end ints (more inclined to round to center numbers, below function more balanced)
*/
export const randomIntInRange = (int1, int2) => {
  return Math.round(int1 + Math.random() * (int2 - int1));
};

export const randomIntRange = (int1, int2) => {
  return Math.floor(int1 + Math.random() * (int2 - int1 + 0.99999));
};

export const randomInRange = (num1, num2) => {
  return num1 + Math.random() * (num2 - num1);
};

export const randomDist = (min, max, iterations) => {
  let total = 0;
  for (let i = 0; i < iterations; i += 1) {
    total += randomInRange(min, max);
  }
  return total / iterations;
};

export const randomSign = () => {
  return Math.random() < 0.5 ? -1 : 1;
};

/* MAPPING */

export const norm = (value, min, max) => {
  return (value - min) / (max - min);
};

export const lerp = (unitary, num1, num2) => {
  return num1 + unitary * (num2 - num1);
};

export const mix = (num1, num2, amount) => {
  return num1 + amount * (num2 - num1);
};

export const map = (
  value,
  sourceMin,
  sourceMax,
  destMin,
  destMax,
  shouldClamp = false
) => {
  value = lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
  if (shouldClamp) {
    value = clamp(
      value,
      destMax > destMin ? destMin : destMax,
      destMax > destMin ? destMax : destMin
    );
  }
  return value;
};

export const mapTo = (value, destMin, destMax, shouldClamp = false) => {
  value = lerp(value, destMin, destMax);
  if (shouldClamp) {
    value = clamp(value, destMin, destMax);
  }
  return value;
};

export const sinBlend = (value) => {
  return 0.5 - 0.5 * Math.cos(value * Math.PI);
};

export const mapFrom = (value, sourceMin, sourceMax, shouldClamp = false) => {
  value = lerp(norm(value, sourceMin, sourceMax), 0, 1);
  if (shouldClamp) {
    value = clamp(value, 0, 1);
  }
  return value;
};

export const isBetween = (value, min, max) => {
  return value >= min && value <= max;
};
