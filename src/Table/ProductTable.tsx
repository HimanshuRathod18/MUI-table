import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import { fetchProducts } from "./fetchProducts";

interface Product {
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

export const ProductTable = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [columnFilters, setColumnFilters] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [productData, setProductData] = useState([]);
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
        filterVariant: "text",
        size: 150,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        filterVariant: "range-slider",
        size: 150,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        filterVariant: "text",
        size: 150,
      },
    ],
    []
  );
  const data = productData || [];
  const table = useMaterialReactTable({
    columns,
    data,
    manualPagination: true,
    rowCount: totalRecords,
    state: { pagination, columnFilters },
    manualFiltering: true,
    initialState: { showColumnFilters: true },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  });

  return productData.length === 0 ? (
    <div>Loading…</div>
  ) : (
    <MaterialReactTable table={table} />
  );
};
