import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Step 1: Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Step 2: Ensure user object exists before inserting into profiles table
    if (!data || !data.user) {
      setError("User registration failed. Please try again.");
      return;
    }

    // Step 3: Insert user data into the 'profiles' table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id, // Use the correct ID from Supabase auth
        email,
        full_name: fullName,
      },
    ]);

    if (profileError) {
      setError(`Profile save failed: ${profileError.message}`);
      return;
    }

    // Step 4: Redirect to Dashboard after successful signup
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-red rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSignup}>
        <div className="mb-4">
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;


