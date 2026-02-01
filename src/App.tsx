import Products from "./components/Products";
import Projects from "./components/Projects";
import Todo from "./components/Todo";

function App() {
  return (
    <>
    {/* giới thiệu tổng quan */}
      <Todo />
      {/* giới thiệu phân trang */}
      <Projects/>
      {/* giới thiệu scroll vô hạn */}
      <Products/>
    </>
  );
}

export default App;
