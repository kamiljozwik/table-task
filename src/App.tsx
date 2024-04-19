import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";

import { DataTable } from "./components/Table";
import { TestDataType, makeTestData } from "./data/range";
import "./App.css";

const testData = makeTestData(3);

const sortStates = {
  NONE: "NONE",
  ASC: "ASC",
  DESC: "DESC",
};

const getNextSortState = (
  currentState: (typeof sortStates)[keyof typeof sortStates]
) => {
  switch (currentState) {
    case sortStates.NONE:
      return sortStates.ASC;
    case sortStates.ASC:
      return sortStates.DESC;
    case sortStates.DESC:
      return sortStates.NONE;
    default:
      return sortStates.NONE;
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedSubcategories, setSelectedSubcategories] = useState(new Set());
  const [sortState, setSortState] = useState(sortStates.NONE);

  const debouncedSetSearchTerm = useMemo(
    () => debounce(setSearchTerm, 300),
    []
  );

  const handleCategorySelection = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const newSelection = new Set(selectedCategories);

      Array.from(event.target.options ?? []).forEach((option) => {
        if (option.selected) newSelection.add(option.value);
        else newSelection.delete(option.value);
      });

      setSelectedCategories(newSelection);
      setSelectedSubcategories(new Set());
    },
    [selectedCategories]
  );

  const handleSubcategorySelection = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const newSelection = new Set(selectedSubcategories);

      Array.from(event.target.options ?? []).forEach((option) => {
        if (option.selected) newSelection.add(option.value);
        else newSelection.delete(option.value);
      });

      setSelectedSubcategories(newSelection);
    },
    [selectedSubcategories]
  );

  // Show only subcategories that match selected category / categories
  const subcategoriesOptions = useMemo(() => {
    const options: Array<TestDataType["subcategories"][number]> = [];

    testData.forEach((category) => {
      if (selectedCategories.has(String(category.catId))) {
        category.subcategories.forEach((subcategory) => {
          options.push(subcategory);
        });
      }
    });

    return options.length > 0
      ? options
      : testData.flatMap((category) => category.subcategories);
  }, [selectedCategories]);

  const handleSortButtonClick = () => {
    setSortState(getNextSortState(sortState));
  };

  /**
   * In a real-word application, this code could be splitted and refactored using more functional approach (like "pipe" for example),
   * but for the sake of homework I kept it simple.
   */
  const filteredData = useMemo(() => {
    let data = testData;

    // Filter by search term if necessary
    if (searchTerm.length >= 3) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      data = testData
        .map((category) => ({
          ...category,
          subcategories: category.subcategories
            .map((subcategory) => ({
              ...subcategory,
              products: subcategory.products.filter((product) =>
                product.name.toLowerCase().includes(lowercaseSearchTerm)
              ),
            }))
            .filter((subcategory) => subcategory.products.length > 0),
        }))
        .filter((category) => category.subcategories.length > 0);
    }

    // Filter by selected categories
    if (selectedCategories.size > 0) {
      data = data.filter((category) =>
        selectedCategories.has(String(category.catId))
      );
    }

    // Filter by selected subcategories
    if (selectedSubcategories.size > 0) {
      data = data
        .map((category) => ({
          ...category,
          subcategories: category.subcategories.filter((subcategory) =>
            selectedSubcategories.has(subcategory.subCatId)
          ),
        }))
        .filter((category) => category.subcategories.length > 0);
    }

    return data;
  }, [searchTerm, selectedCategories, selectedSubcategories]);

  const sortedAndFilteredData = useMemo(() => {
    let data = filteredData;

    if (sortState !== sortStates.NONE) {
      data = data.map((category) => ({
        ...category,
        subcategories: category.subcategories.map((subcategory) => ({
          ...subcategory,
          products: [...subcategory.products].sort((a, b) => {
            if (sortState === sortStates.ASC) {
              return a.price - b.price;
            }
            if (sortState === sortStates.DESC) {
              return b.price - a.price;
            }
            return 0;
          }),
        })),
      }));
    }

    return data;
  }, [filteredData, sortState]);

  return (
    <main>
      <div className="space-x-8 mb-8">
        <input
          type="text"
          placeholder="Search by product name..."
          onChange={(e) => debouncedSetSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <select multiple onChange={handleCategorySelection}>
          {testData.map((category) => (
            <option key={category.catId} value={category.catId}>
              {category.name}
            </option>
          ))}
        </select>

        <select multiple onChange={handleSubcategorySelection}>
          {subcategoriesOptions.map((subcategory) => (
            <option key={subcategory.subCatId} value={subcategory.subCatId}>
              {subcategory.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSortButtonClick}
          className="p-2 bg-gray-600 rounded"
        >
          Sort by Price:{" "}
          {sortState === sortStates.NONE
            ? "None"
            : sortState === sortStates.ASC
            ? "Ascending"
            : "Descending"}
        </button>
      </div>
      <DataTable data={sortedAndFilteredData} />
    </main>
  );
}

export default App;
