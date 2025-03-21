/**
 * Immutable array reverse
 */
function reverse(list) {
  return list.concat().reverse();
}

/**
 * Slightly modified slice that also takes range shifting into account
 * Example: slice([0, 1, 2, 3, 4, 5], 4, 3) => [4, 5, 0, 1, 2];
 */
function slice(list, start, end) {
  let l = list;

  if (start >= end) {
    l = l.slice(start).concat(l.slice(0, end));
  } else {
    l = l.slice(start, end);
  }

  return l;
}

/**
 * Returns an array based on size
 * Example: indexedList(5) => [0, 1, 2, 3, 4, 5]
 */
function indexedList(size) {
  const list = [];
  for (let i = 0; i < size; i += 1) {
    list.push(i);
  }
  return list;
}

/*
 * Creates an array range based on the passed arguments
 * Example: rangeMake(5, 0, 4, false, 1) => [0, 1, 2, 3, 4];
 * Example: rangeMake(5, 4, 1, true, 1) => [4, 0, 1, 0];
 */
function rangeMake(size, start, end, autoReverse, direction) {
  let d = direction;
  // provide default for direction setting
  if (d === undefined) {
    d = start < end ? 1 : -1;
  }

  // create an indexed list to work with
  let range = indexedList(size);

  // reverse range if it's not unidirectional
  range = d === -1 ? reverse(range) : range;

  // grab start and end indices for range
  const startIndex = range.indexOf(start);
  const endIndex = range.indexOf(end);

  // create the range set
  range = slice(range, startIndex, endIndex + 1);

  // append the reversed set (without first and last index), when autoReverse is true
  range = autoReverse ? range.concat(reverse(range.slice(1, -1))) : range;

  return range;
}

export default rangeMake;
