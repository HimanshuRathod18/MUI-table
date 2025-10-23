export const fetchProducts = async (
  page: any,
  pageSize: any,
  filterObj: any
) => {
  let url = `https://dummyjson.com/products?limit=${pageSize}&skip=${(page - 1) * pageSize
    }`;
  const categoryFilter = filterObj.find((f: any) => f.id === "category");
  const productFilter = filterObj.find((f: any) => f.id === "title");
  const stockFilter = filterObj.find((f: any) => f.id === 'stock');
  const brandFilter = filterObj.find((f: any) => f.id === 'brand');
  const prizeFilter = filterObj.find((f: any) => f.id === 'price');

  if (categoryFilter) {
    url = `https://dummyjson.com/products/category/${categoryFilter.value
      }?limit=${pageSize}&skip=${(page - 1) * pageSize}`;
  }
  if (productFilter) {
    url = `https://dummyjson.com/products/search?q=${productFilter.value
      }&limit=${pageSize}&skip=${(page - 1) * pageSize}`;
  }
console.log(':::', prizeFilter);
  const response = await fetch(url);

  const data = await response.json();
  let filteredProducts = filterProducts(data.products);
  let stockFilteredProducts = [];
  if (stockFilter) {
    const stockMin = stockFilter.value[0];
    const stockMax = stockFilter.value[1];
    stockFilteredProducts = filteredProducts.filter((a: any) => a.stock >= stockMin && a.stock <= stockMax)
  }
  if (prizeFilter && prizeFilter.value[0] && prizeFilter.value[1]) {
    const prizeMin = Number(prizeFilter.value[0]);
    const prizeMax = Number(prizeFilter.value[1]);
    console.log('::: prizeMin, prizeMax', prizeMin, prizeMax);
    filteredProducts = filteredProducts.filter((a: any) => a.price >= prizeMin && a.price <= prizeMax);
  }
  if (brandFilter) {
    const brandFilteredProducts = await filterBrands(brandFilter);
    filteredProducts = brandFilteredProducts;
  }
  return {
    products: stockFilter ? stockFilteredProducts : filteredProducts,
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

export const fetchCategoryList = async () => {
  const res = await fetch('https://dummyjson.com/products/category-list');
  const dataList = await res.json();
  return dataList;
}

export const brandsList = async () => {
  const res = await fetch('https://dummyjson.com/products');
  const data = await res.json();
  const brandList = data.products.filter((li: any) => li.brand).map((list: any) => list.brand);
  return brandList;
}

export const filterBrands = async (brandFilter: any) => {

  const res = await fetch('https://dummyjson.com/products');
  const data = await res.json();
  let products = filterProducts(data.products);
  const toStringArray = (v: any) => {
    if (Array.isArray(v)) {
      return v.map((x) => (typeof x === "string" ? x : x?.value ?? x?.label ?? "")).filter(Boolean);
    }
    if (!v) return [];
    return [typeof v === "string" ? v : v?.value ?? v?.label ?? ""].filter(Boolean);
  };
   if (brandFilter) {
    const allowedBrands = toStringArray(brandFilter.value);
    if (allowedBrands.length > 0) {
      products = data.products.filter((p: any) => allowedBrands.includes(p.brand));
    }
  }
  return products;
}
const filterProducts = (products: any) =>
  products.map(({ title, category, price, rating, stock, brand }: any) => ({
    title,
    category,
    price,
    rating,
    stock,
    brand,
  }));
