"use client";

import React, { useState } from "react";
import { useOptimistic } from "react";

type Item = { id: number; name: string };

const UseOptimisticExample = () => {
  const [query, setQuery] = useState("");

  // Define the initial state and optimistic updater
  const [items, updateItems] = useOptimistic<Item[]>(
    [], // Initial state
    (currentItems, newItem) => [...currentItems, newItem] // Optimistic update
  );

  // Add a new item (mock API)
  const addItem = async (name: string) => {
    const newItem = { id: Date.now(), name };

    // Optimistically update the state
    updateItems(newItem);

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
      // Roll back optimistic update by removing the item
      updateItems((currentItems) =>
        currentItems.filter((item) => item.id !== newItem.id)
      );
    }
  };

  // Delete an item (mock API)
  const deleteItem = async (id: number) => {
    // Optimistically remove the item
    updateItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );

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
      // Roll back optimistic update by adding the item back
      const deletedItem = items.find((item) => item.id === id);
      if (deletedItem) updateItems(deletedItem);
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
