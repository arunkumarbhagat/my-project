import React from "react";
import "./App.css";
import ProductCard from "./ProductCard";

export default function App() {
  return (
    <div className="container">
      <h2>Products List</h2>
      <div className="products">
        <ProductCard name="Wireless Mouse" price={25.99} status="In Stock" />
        <ProductCard name="Keyboard" price={45.5} status="Out of Stock" />
        <ProductCard name="Monitor" price={199.99} status="In Stock" />
      </div>
    </div>
  );
}

