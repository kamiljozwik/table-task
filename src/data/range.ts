const range = (from: number, to: number) => {
  const nums = [];
  for (from; from < to; from++) {
    nums.push(from);
  }
  return nums;
};

function randomFromRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const makeTestData = (max = 10) =>
  range(0, max).map((catId) => ({
    catId,
    name: `category${catId}`,
    subcategories: range(0, randomFromRange(3, 6)).map((subCatId) => ({
      subCatId: `${catId}${subCatId}`,
      name: `subcategory${subCatId}`,
      products: range(0, randomFromRange(50, 120)).map((index) => ({
        index: `${catId}${subCatId}${index}`,
        name: `${catId}${subCatId}${index}product`,
        quantity: randomFromRange(0, 300),
        price: randomFromRange(3, 50),
      })),
    })),
  }));

export type TestDataType = ReturnType<typeof makeTestData>[number];
