import { useMemo } from "react";
import { ListChildComponentProps, VariableSizeList } from "react-window";

import { TestDataType } from "../data/range";
import { getRowDataByIndex } from "./getRowDataByIndex";

type Props = {
  data: TestDataType[];
};

const getItemSize = (index: number, data: TestDataType[]) => {
  const rowData = getRowDataByIndex(data, index);
  if (rowData.type === "category") return 80;
  if (rowData.type === "subcategory") return 60;
  return 40;
};

const Row = ({ index, style, data }: ListChildComponentProps) => {
  const rowData = getRowDataByIndex(data, index);

  switch (rowData.type) {
    case "category":
      return (
        <div
          style={style}
          className="border-b flex items-center justify-center"
        >
          {rowData.data.name}
        </div>
      );
    case "subcategory":
      return (
        <div
          style={style}
          className="border-b flex items-center justify-center"
        >
          {rowData.data.name}
        </div>
      );
    case "product":
      return (
        "index" in rowData.data && (
          <div style={style} className="flex justify-between border-b h-[40px]">
            <div className="border-r w-1/4 flex justify-center items-center">
              {rowData.data.index}
            </div>
            <div className="border-r w-1/4 flex justify-center items-center">
              {rowData.data.name}
            </div>
            <div className="border-r w-1/4 flex justify-center items-center">
              {rowData.data.quantity}
            </div>
            <div className="w-1/4 flex justify-center items-center">
              {rowData.data.price}
            </div>
          </div>
        )
      );
    default:
      return null;
  }
};

export const DataTable = ({ data }: Props) => {
  const itemCount = useMemo(() => calculateTotalRowCount(data), [data]);

  return (
    <div className="rounded-md border">
      <VariableSizeList
        width="100%"
        height={600}
        itemCount={itemCount}
        itemSize={(i) => getItemSize(i, data)}
        itemData={data}
      >
        {Row}
      </VariableSizeList>
    </div>
  );
};

function calculateTotalRowCount(dataArray: TestDataType[]): number {
  let rowCount = 0;

  dataArray.forEach((category) => {
    rowCount += 1;
    category.subcategories.forEach((subcategory) => {
      rowCount += 1;
      rowCount += subcategory.products.length;
    });
  });

  return rowCount;
}
