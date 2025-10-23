export type Product = {
  title: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  brand: string;
};

type Filter = { id: string; value: string | string[] | number[] };

const URL = 'https://dummyjson.com/products';

const pageUrl = (page: any, pageSize: any) => URL + `?limit=${pageSize}&skip=${(page - 1) * pageSize}`;

const categoryUrl = (category: string, page: any, pageSize: any) => URL + `/category/${category}?limit=${pageSize}&skip=${(page - 1) * pageSize}`;

const searchUrl = (query: string, page: any, pageSize: any) => URL + `/search?q=${query}&limit=${pageSize}&skip=${(page - 1) * pageSize}`;

const toStringArray = (v: any) => {
  if (Array.isArray(v)) {
    return v.map((x) => (typeof x === "string" ? x : x?.value ?? x?.label ?? "")).filter(Boolean);
  }
  if (!v) return [];
  return [typeof v === "string" ? v : v?.value ?? v?.label ?? ""].filter(Boolean);
};

const pick = (filters: Filter[], id: string) => filters.find((f) => f.id === id);

const getAllProducts = async () => {
  const response = await fetch(URL);
  const data = await response.json();
  return data.products;
}

export const fetchProducts = async (
  page: number,
  pageSize: number,
  filterObj: Filter[]
) => {

  const categoryFilter = pick(filterObj, 'category');
  const productFilter = pick(filterObj, 'title');
  const stockFilter = pick(filterObj, 'stock');
  const brandFilter = pick(filterObj, 'brand');
  const priceFilter = pick(filterObj, 'price');
  // console.log('::: filters in fetchProducts', filterObj);
  const url = categoryFilter?.value ? categoryUrl(Array.isArray(categoryFilter.value) ? String(categoryFilter.value[0]) : String(categoryFilter.value), page, pageSize) : productFilter?.value ? searchUrl(Array.isArray(productFilter.value) ? String(productFilter.value[0]) : String(productFilter.value), page, pageSize) : pageUrl(page, pageSize);

  const response = await fetch(url);
  const data = await response.json();

  const products: Product[] = (data.products || []).map((p: any) => ({
    title: p.title,
    category: p.category,
    price: p.price,
    stock: p.stock,
    rating: p.rating,
    brand: p.brand,
  }));

  let out = products;

  // price 
  if(priceFilter && Array.isArray(priceFilter.value) && priceFilter.value.length === 2){
    const [min, max] = priceFilter.value.map(Number);
    if(!isNaN(min) && !isNaN(max)) {
      out = out.filter(p => p.price >= min && p.price <= max);
    }
  }

  // stock
  if(stockFilter && Array.isArray(stockFilter.value) && stockFilter.value.length === 2){
    const [min, max] = stockFilter.value as number[];
    out = out.filter(p => p.stock >= min && p.stock <= max);
  }

  // brand
  if(brandFilter){
    const allproducts = await getAllProducts();
    const allowedBrands = toStringArray(brandFilter.value);
    if(allowedBrands.length > 0){
      out = allproducts.filter((p: any) => allowedBrands.includes(p.brand));
    }
  }
  return { products: out, total: data.total ?? out.length };

};

export const fetchCategoryList = async () => {
  const res = await fetch(`${URL}/category-list`);
  const dataList = await res.json();
  return dataList;
}

export const brandsList = async () => {
  const res = await fetch(URL);
  const data = await res.json();
  const brandList = Array.from(
    new Set(data.products.filter((p: any) => p.brand).map((p: any) => p.brand))
  ).sort();
  return brandList;
}

export const filterBrands = async (brandFilter: any) => {

  const res = await fetch(URL);
  const data = await res.json();
  let products = filterProducts(data.products);

  if (brandFilter) {
    const allowedBrands = toStringArray(brandFilter.value);
    if (allowedBrands.length > 0) {
      products = data.products.filter((p: any) => allowedBrands.includes(p.brand));
    }
  }
  return products;
}

export const sortProducts = async (sorting: any, pagination: any
) => {
        const {pageIndex, pageSize} = pagination;
        const sortId = sorting[0]?.id;
        const sortDesc = sorting[0]?.desc ? 'desc' : 'asc';
        const response = await fetch(`${URL}?sortBy=${sortId}&order=${sortDesc}&limit=${pageSize}&skip=${pageIndex * pageSize}`);
        const data = await response.json();
        let products = data.products;
    
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
