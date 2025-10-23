import { ProductTable } from "./Table/ProductTable";

function App() {

  return(
    <div style={{ padding: '20px 60px' , display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Material React Table</h1>
      <ProductTable />
    </div>
  );
}

export default App;
