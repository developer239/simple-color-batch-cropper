export const getMaxProperty = (arrayOfObjects, property) => {
  const arrayOfValues = arrayOfObjects.map(obj => obj[property]);
  return Math.max(...arrayOfValues);
};

export const getMinProperty = (arrayOfObjects, property) => {
  const arrayOfValues = arrayOfObjects.map(obj => obj[property]);
  return Math.min(...arrayOfValues);
};
