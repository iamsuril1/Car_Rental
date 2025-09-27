import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({ ...formData, name: user.name, email: user.email });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessage("Profile updated successfully!");
      // Update AuthContext with new user info
      setUser(res.data.user);
      setFormData((prev) => ({ ...prev, password: "", newPassword: "" }));
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-bold text-red-600">Login required</h2>
        <p className="mt-2 text-gray-700">Please login to view your profile.</p>
      </div>
    );
  }

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">👤 My Profile</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-gray-700">Current Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter current password to change info"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>

      <div className="mt-6">
        <p>
          <span className="font-semibold">Role:</span> {user.role}
        </p>
      </div>
    </div>
  );
}
