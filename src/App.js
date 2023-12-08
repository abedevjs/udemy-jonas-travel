import React, { useState } from "react";
import "./App.css";

// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Charger", quantity: 12, packed: true },
// ];

function Logo() {
  return <h1>🌴 Traveling App 🧳</h1>;
}

function Form({ onAddItem }) {
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { quantity, description, packed: false, id: Date.now() };

    onAddItem(newItem);

    setQuantity(1);
    setDescription("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (__, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function Item({ object, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={object.packed}
        onChange={() => onToggleItem(object.id)}
      />
      <span style={object.packed ? { textDecoration: "line-through" } : {}}>
        {object.quantity}&nbsp;
        {object.description}
      </span>
      <button onClick={() => onDeleteItem(object.id)}>❌</button>
    </li>
  );
}

function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            object={item}
            onToggleItem={onToggleItem}
            onDeleteItem={onDeleteItem}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button
          onClick={onClearList}
          style={
            !items.length
              ? { opacity: 0.2, cursor: "not-allowed" }
              : { opacity: 1 }
          }
        >
          Clear List
        </button>
      </div>
    </div>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>There are no items, start packing! 😒😤</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "👍 You are good to go ✈️"
          : `🧳 You have ${numItems} items on your list, and you already packed
        ${numPacked} items, (${percentage}%).`}
      </em>
    </footer>
  );
}

export default function App() {
  // const [items, setItems] = useState(initialItems);
  const [items, setItems] = useState([]);

  function handleAddItem(itemArr) {
    //* This is how we update the state, with a function
    setItems((item) => [...item, itemArr]);
  }

  function handleToggleItem(id) {
    //* This is how we update the state, with a function
    setItems(
      (items) =>
        items.map((item) =>
          item.id === id ? { ...item, packed: !item.packed } : item
        ) //* This is how we update an Object in an Array
    );
  }

  function handleDeleteItem(id) {
    //* This is how we update the state, with a function
    setItems((items) => items.filter((item) => item.id !== id)); //* This is how we update an Object in an Array
  }

  function handleClearList() {
    if (items.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={handleAddItem} />
      <PackingList
        items={items}
        onToggleItem={handleToggleItem}
        onDeleteItem={handleDeleteItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}
