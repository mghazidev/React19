"use client";

import React, { useState, useTransition } from "react";

const UseTransitionWithMockAPI = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const fetchItems = async (query: string) => {
    try {
      // Add a filter query parameter to the URL
      const response = await fetch(
        `https://670985e1af1a3998baa1c076.mockapi.io/api/v1/items?name=${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Use startTransition to mark the search update as low-priority
    startTransition(async () => {
      const data = await fetchItems(value); // Call MockAPI
      setResults(data);
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>React 19 - useTransition with MockAPI</h1>
      <p>
        Type in the search box below to fetch items from a MockAPI in a deferred
        way without blocking the UI.
      </p>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search items..."
        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
      />
      {isPending && <p style={{ color: "blue" }}>Loading results...</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {results.map((item: { id: number; name: string }) => (
          <li key={item.id} style={{ marginBottom: "10px" }}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UseTransitionWithMockAPI;
