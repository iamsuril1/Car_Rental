import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentingCar, setRentingCar] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/cars");
        setCars(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Rent car
  const handleRent = async (carId) => {
    if (!user) return alert("Please login to rent a car.");

    try {
      setRentingCar(carId);
      await axios.post(
        "http://localhost:5000/api/rentals/request",
        { carId, rentalDays: 1, paymentMethod: "cash" }, // Adjust as needed
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Rental request sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send rental request.");
    } finally {
      setRentingCar(null);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setType("all");
    setMaxPrice("");
    setSort("default");
  };

  // Apply filters
  let filteredCars = cars.filter((car) => {
    const matchesSearch = (car.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      type === "all" || (car.brand || "").toLowerCase() === type.toLowerCase();
    const matchesPrice =
      !maxPrice || (car.pricePerDay || 0) <= Number(maxPrice);
    return matchesSearch && matchesType && matchesPrice;
  });

  // Apply sorting
  if (sort === "lowToHigh") {
    filteredCars = [...filteredCars].sort(
      (a, b) => a.pricePerDay - b.pricePerDay
    );
  } else if (sort === "highToLow") {
    filteredCars = [...filteredCars].sort(
      (a, b) => b.pricePerDay - a.pricePerDay
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🚗 Available Cars</h1>

      {/* Filter Section */}
      <div className="bg-white p-4 shadow rounded-lg mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Truck">Truck</option>
        </select>

        <input
          type="number"
          placeholder="Max Price ($)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Sort By</option>
          <option value="lowToHigh">Price: Low → High</option>
          <option value="highToLow">Price: High → Low</option>
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
        >
          Reset Filters
        </button>
      </div>

      {loading && <p>Loading cars...</p>}

      {/* Car Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div
              key={car._id}
              className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
            >
              <Link to={`/cars/${car._id}`}>
                <img
                  src={car.image || "https://via.placeholder.com/300x200"}
                  alt={car.title}
                  className="w-full h-40 object-cover hover:opacity-90 transition"
                />
              </Link>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{car.title}</h2>
                  <p className="text-gray-600">{car.brand}</p>
                  <p className="mt-2 font-bold">${car.pricePerDay} / day</p>
                  {car.model && <p className="text-gray-500">Model: {car.model}</p>}
                  {car.location && <p className="text-gray-500">Location: {car.location}</p>}
                </div>

                <button
                  onClick={() => handleRent(car._id)}
                  disabled={!user || rentingCar === car._id}
                  className={`mt-4 w-full py-2 rounded-lg text-white ${
                    user
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {rentingCar === car._id
                    ? "Processing..."
                    : user
                    ? "Rent Now"
                    : "Login to Rent"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No cars match your filters.</p>
        )}
      </div>
    </div>
  );
}
