import React, { useState } from "react";
import "./App.css";

function App() {
  // Initial grocery list
  const [groceryList, setGroceryList] = useState([
    { id: 1, name: "Apples", price: 50, quantity: 2 },
    { id: 2, name: "Milk", price: 30, quantity: 1 },
    { id: 3, name: "Rice", price: 60, quantity: 5 },
  ]);

  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "" });

  // Add new item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.quantity) return;

    const newGrocery = {
      id: groceryList.length + 1,
      name: newItem.name,
      price: parseFloat(newItem.price),
      quantity: parseInt(newItem.quantity),
    };

    setGroceryList([...groceryList, newGrocery]);
    setNewItem({ name: "", price: "", quantity: "" });
  };

  return (
    <div className="app">
      <h1>🛒 Grocery List</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {groceryList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAddItem} className="form">
        <input
          type="text"
          placeholder="Item name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default App;

