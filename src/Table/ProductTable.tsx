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
    pageSize: 7,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { products, total } = await fetchProducts(
        pagination.pageIndex + 1,
        pagination.pageSize
      );
      setProductData(products);
      setTotalRecords(total);
    }
    loadData();
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Product",
        size: 150,
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 150,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 150,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        size: 150,
      },
      {
        accessorKey: "rating",
        header: "Rating",
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
    state: { pagination },
    onPaginationChange: setPagination,
  });

  return <MaterialReactTable table={table} />;
};
