import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import { fetchProducts , fetchCategoryList, brandsList} from "./fetchProducts";
import { sortProducts } from "./sortProducts";

interface Product {
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  brand: string;
}

export const ProductTable = () => {
  fetchCategoryList();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnFilters, setColumnFilters] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [productData, setProductData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandsList] = useState([]);
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
  async function sort(){
    if(sorting.length === 0) return;
    const products= await sortProducts(sorting, pagination);
    setProductData(products);
  }
  sort();
}, [sorting]);




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
    loadData();
  }, [pagination.pageIndex, pagination.pageSize, columnFilters]);
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
          max: 500, 
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
        size: 150,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        filterVariant: "text",
        size: 150,
      },
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
