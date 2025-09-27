import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddCar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    brand: "SUV",
    model: "",
    pricePerDay: "",
    location: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-bold text-red-600">Login required</h2>
        <p className="mt-2 text-gray-700">Please login to add a car.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        pricePerDay: Number(formData.pricePerDay), // ensure number type
      };

      await axios.post("http://localhost:5000/api/cars", payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setSuccess("Car added successfully!");
      setFormData({
        title: "",
        brand: "SUV",
        model: "",
        pricePerDay: "",
        location: "",
        image: "",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">➕ Add a Car</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Car Title */}
        <div>
          <label className="block text-gray-700">Car Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Car Brand */}
        <div>
          <label className="block text-gray-700">Car Brand</label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Truck">Truck</option>
          </select>
        </div>

        {/* Car Model */}
        <div>
          <label className="block text-gray-700">Car Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g., 2022"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price per Day */}
        <div>
          <label className="block text-gray-700">Price per Day ($)</label>
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City or address"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-gray-700">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/car.jpg"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Preview Image */}
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="mt-3 w-48 h-32 object-cover rounded"
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Car"}
        </button>
      </form>
    </div>
  );
}
