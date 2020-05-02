export default select = (array, selector) => {
  let index = -1;
  const result = [];
  while (++index < array.length) {
    result[index] = selector(array[index]);
  }
  return result;
};
