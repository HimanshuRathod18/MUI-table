import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import { fetchProducts , fetchCategoryList, brandsList,sortProducts,deleteProductById, type Product} from "../api";
import { MultiSelectAutocompleteFilter } from "../components/MultiSelectAutoComplete";

export const ProductTable = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnFilters, setColumnFilters] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [productData, setProductData] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandsList] = useState<any>([]);
  const [sorting, setSorting] = useState<any>([]);

  useEffect(() => {
  async function getDataOnLoad(){
    const dataList = await fetchCategoryList();
      setCategoryList(dataList);
    const brands = await brandsList();
    setBrandsList(brands);
  }
  getDataOnLoad();
},[]);

  useEffect(() => {
    async function loadData() {
      const { products, total } = await fetchProducts(
        pagination.pageIndex + 1,
        pagination.pageSize,
        columnFilters
      );
      setProductData(products);
      setTotalRecords(total);
    }
    async function sort(){
      if(sorting.length === 0) return;
      const products= await sortProducts(sorting, pagination);
      setProductData(products);
  }
    loadData();
    sort();
  }, [pagination.pageIndex, pagination.pageSize, columnFilters, sorting]);

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Product",
        filterVariant: "text",
        size: 150,
      },
      {
        accessorKey: "price",
        header: "Price",
        filterVariant: "range",
        size: 150,
      },
      {
        accessorKey: "category",
        header: "Category",
        filterVariant: "select",
        filterSelectOptions: categoryList || [],
        size: 150,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        filterVariant: "range-slider",
         filterFn: 'betweenInclusive',
        muiFilterSliderProps: {
          marks: true,
          max: 200, 
          min: 0, 
          step: 10,
        },
        size: 150,
      },
      {
        accessorKey: 'brand',
        header: 'Brand',
        filterVariant: 'multi-select',
        filterSelectOptions: brandList || [],
        Filter: (props) => <MultiSelectAutocompleteFilter {...props} filterSelectOptions={brandList || []} />,
        size: 250,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        filterVariant: "text",
        size: 150,
      },
      {
        accessorKey: "id",
        header: 'Delete',
        size: 100,
        Cell:({row})=>(
          <button
            onClick={async ()=>{
              const idToRemove = row.original.id;
              const delProuct = await deleteProductById(idToRemove);
              setProductData((prevData) => prevData.filter((item) => item.id !== idToRemove));
              setTotalRecords((prevTotal) => prevTotal - 1);
            }}
          >
            Delete
          </button>
        )
      }
    ],
    [categoryList, brandList]
  );

  const data = productData || [];
  const table = useMaterialReactTable({
    columns,
    data,
    manualPagination: true,
    rowCount: totalRecords,
    state: { pagination, columnFilters, sorting },
    manualFiltering: true,
    initialState: { showColumnFilters: true },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
  });

  return productData.length === 0 ? (
    <div>Loading…</div>
  ) : (
    <MaterialReactTable table={table} />
  );
};
