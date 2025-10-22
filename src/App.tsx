import { useEffect, useState } from "react";
import { ProductTable } from "./Table/ProductTable";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products));
  }, []);
  console.log("::: products", products);

  const filteredProducts = products.map(
    ({ title, category, price, rating, stock }) => ({
      title,
      category,
      price,
      rating,
      stock,
    })
  );
  console.log("::: products", filteredProducts);

  return (
    <div>
      <h1>Material React Table</h1>
      <ProductTable />
    </div>
  );
}

export default App;
