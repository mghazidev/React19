import React from "react";

async function updateName(name: string) {
  if (name.length < 3) {
    return "Name must be at least 3 characters long"; // Simulate validation error
  }
  // Simulate a network request
  return new Promise<string | null>((resolve) =>
    setTimeout(() => resolve(null), 1000)
  ); // Success: No error
}

const ChangeName = () => {
  // Using `useActionState` to manage async updates
  const [error, submitAction, isPending] = React.useActionState(
    async (prevState: any, formData: any) => {
      const name = formData.get("name") as string;
      const error = await updateName(name);
      if (error) {
        return error; // Return error if validation fails
      }
      // Perform success actions, e.g., redirect or state update
      console.log("Name updated successfully:", name);
      return null; // No error
    },
    null // Initial error state
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" placeholder="Enter name" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Name"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default ChangeName;
