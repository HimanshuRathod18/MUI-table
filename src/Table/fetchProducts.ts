export const fetchProducts = async (
  page: any,
  pageSize: any,
  filterObj: any
) => {
  let url = `https://dummyjson.com/products?limit=${pageSize}&skip=${
    (page - 1) * pageSize
  }`;
  const categoryFilter = filterObj.find((f: any) => f.id === "category");
  const productFilter = filterObj.find((f: any) => f.id === "title");

  console.log("::: cate", categoryFilter);
  if (categoryFilter) {
    url = `https://dummyjson.com/products/category/${
      categoryFilter.value
    }?limit=${pageSize}&skip=${(page - 1) * pageSize}`;
  }
  if (productFilter) {
    url = `https://dummyjson.com/products/search?q=${
      productFilter.value
    }&limit=${pageSize}&skip=${(page - 1) * pageSize}`;
  }
  const response = await fetch(url);

  const data = await response.json();
  console.log("::: data", data);
  const filteredProducts = filterProducts(data.products);
  return {
    products: filteredProducts,
    total: data.total,
  };
};

export const fetchProductsByCategories = async (categoryName: string) => {
  const response = await fetch(
    `https://dummyjson.com/products/category/${categoryName}`
  );
  const data = await response.json();
  const filteredProducts = filterProducts(data.products);
  return {
    products: filteredProducts,
    total: data.total,
  };
};

const filterProducts = (products: any) =>
  products.map(({ title, category, price, rating, stock }: any) => ({
    title,
    category,
    price,
    rating,
    stock,
  }));
