import { TestDataType } from "../data/range";

export const getRowDataByIndex = function (
  testDataArr: TestDataType[],
  index: number
) {
  let cumulativeIndex = 0;

  for (const category of testDataArr) {
    if (cumulativeIndex === index) {
      return { type: "category", data: category };
    }
    cumulativeIndex++;

    for (const subcategory of category.subcategories) {
      if (cumulativeIndex === index) {
        return { type: "subcategory", data: subcategory };
      }
      cumulativeIndex++;

      for (const product of subcategory.products) {
        if (cumulativeIndex === index) {
          return { type: "product", data: product };
        }
        cumulativeIndex++;
      }
    }
  }

  throw new Error("Index out of range");
};
