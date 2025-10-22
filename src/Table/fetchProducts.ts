export const fetchProducts = async (page: any, pageSize: any) => {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${pageSize}&skip=${
      (page - 1) * pageSize
    }`
  );
  const data = await response.json();
  const filteredProducts = data.products.map(
    ({ title, category, price, rating, stock }: any) => ({
      title,
      category,
      price,
      rating,
      stock,
    })
  );
  return {
    products: filteredProducts,
    total: data.total,
  };
};
