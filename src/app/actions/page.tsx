// pages/actions.tsx

// This file is a client-side component
"use client";

import { useState } from "react";

// Server-side function to handle the form submission
// Server-side logic (doesn't use React hooks)
async function submitForm(formData: { name: string; email: string }) {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
  console.log("Form submitted", formData);
  return "Form submitted successfully!";
}

const ActionsPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const result = await submitForm(formData); // Call the server-side function
      setMessage(result); // Display result
    } catch (error) {
      console.error("Action failed:", error);
      setMessage("Failed to submit form.");
    }
  };

  return (
    <div>
      <h1>React 19 - Server Actions Example</h1>
      {message && <p>{message}</p>}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default ActionsPage;
