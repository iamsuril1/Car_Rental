import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("User registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <input
        type="text"
        placeholder="Name"
        className="w-full border p-2 mb-3 rounded"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-3 rounded"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-3 rounded"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* Role Selection */}
      <select
        className="w-full border p-2 mb-3 rounded"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        defaultValue="tenant"
      >
        <option value="tenant">Tenant</option>
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
        Register
      </button>
    </form>
  );
}
