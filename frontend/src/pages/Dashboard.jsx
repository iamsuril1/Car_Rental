import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/cars"); // replace with your API
        setCars(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Filter cars live as user types
  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🚗 Available Cars</h1>

      {/* Live Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cars..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading state */}
      {loading && <p>Loading cars...</p>}

      {/* Car Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div
              key={car._id}
              className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={car.image || "https://via.placeholder.com/300x200"}
                alt={car.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{car.name}</h2>
                  <p className="text-gray-600">{car.type}</p>
                  <p className="mt-2 font-bold">${car.price} / day</p>
                </div>

                {/* Rent Button */}
                <button
                  disabled={!user}
                  className={`mt-4 w-full py-2 rounded-lg text-white ${
                    user ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {user ? "Rent Now" : "Login to Rent"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No cars match your search.</p>
        )}
      </div>
    </div>
  );
}
