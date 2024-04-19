import { ListChildComponentProps } from "react-window";
import { getRowDataByIndex } from "./getRowDataByIndex";

export const Row = ({ index, style, data }: ListChildComponentProps) => {
  const rowData = getRowDataByIndex(data, index);

  switch (rowData.type) {
    case "category":
      return (
        <div style={style} className="border-b">
          {rowData.data.name}
        </div>
      );
    case "subcategory":
      return (
        <div style={style} className="border-b">
          {rowData.data.name}
        </div>
      );
    case "product":
      return (
        "index" in rowData.data && (
          <div style={style} className="flex justify-between border-b h-[40px]">
            <div className="border-r w-1/4">{rowData.data.index}</div>
            <div className="border-r w-1/4">{rowData.data.name}</div>
            <div className="border-r w-1/4">{rowData.data.quantity}</div>
            <div className="w-1/4">{rowData.data.price}</div>
          </div>
        )
      );
    default:
      return null;
  }
};
