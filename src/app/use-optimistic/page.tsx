"use client";

import React, { useState } from "react";
import { useOptimistic } from "react";

// Define types for items and actions
type Item = { id: number; name: string };
type Action =
  | { type: "add"; payload: Item }
  | { type: "delete"; payload: Item };

const UseOptimisticExample = () => {
  const [query, setQuery] = useState("");

  // Initialize useOptimistic with a typed updater function
  const [items, updateItems] = useOptimistic<Item[], Action>(
    [],
    (currentItems, action) => {
      switch (action.type) {
        case "add":
          return [...currentItems, action.payload];
        case "delete":
          return currentItems.filter((item) => item.id !== action.payload.id);
        default:
          return currentItems;
      }
    }
  );

  // Add a new item (mock API)
  const addItem = async (name: string) => {
    const newItem = { id: Date.now(), name };

    // Optimistically update the state
    updateItems({ type: "add", payload: newItem });

    try {
      const response = await fetch(
        `https://670985e1af1a3998baa1c076.mockapi.io/api/v1/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        }
      );

      if (!response.ok) throw new Error("Failed to add item");
      console.log("Item successfully added:", await response.json());
    } catch (error) {
      console.error("Error adding item, rolling back...", error);
      // Rollback by removing the optimistically added item
      updateItems({ type: "delete", payload: newItem });
    }
  };

  // Delete an item (mock API)
  const deleteItem = async (id: number) => {
    const deletedItem = items.find((item) => item.id === id);

    if (!deletedItem) return;

    // Optimistically remove the item
    updateItems({ type: "delete", payload: deletedItem });

    try {
      const response = await fetch(
        `https://670985e1af1a3998baa1c076.mockapi.io/api/v1/items/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete item");
      console.log("Item successfully deleted:", id);
    } catch (error) {
      console.error("Error deleting item, rolling back...", error);
      // Rollback by re-adding the item
      updateItems({ type: "add", payload: deletedItem });
    }
  };

  const handleAddItem = () => {
    if (!query.trim()) return;
    addItem(query);
    setQuery(""); // Reset input field
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>React 19 - useOptimistic Example</h1>
      <p>
        Add or delete items using optimistic updates. Changes will appear
        immediately on the UI before the server response.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Add an item..."
          style={{ padding: "10px", width: "80%" }}
        />
        <button
          onClick={handleAddItem}
          style={{
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {item.name}
            <button
              onClick={() => deleteItem(item.id)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UseOptimisticExample;
