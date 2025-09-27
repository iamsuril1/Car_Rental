import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function CarDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
        setCar(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching car:", err);
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleRent = async () => {
    if (!user) return alert("Please login to rent a car.");

    try {
      setRenting(true);
      await axios.post(
        "http://localhost:5000/api/rentals",
        { carId: id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Rental request sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send rental request.");
    } finally {
      setRenting(false);
    }
  };

  if (loading) return <p className="p-6">Loading car details...</p>;
  if (!car) return <p className="p-6">Car not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <img
        src={car.image || "https://via.placeholder.com/600x400"}
        alt={car.name}
        className="w-full h-64 object-cover rounded-lg"
      />

      <h1 className="text-3xl font-bold mt-4">{car.name}</h1>
      <p className="text-gray-600">{car.type}</p>
      <p className="mt-2 text-lg font-semibold">${car.price} / day</p>

      <div className="mt-4">
        <h3 className="font-bold text-lg">Description</h3>
        <p className="text-gray-700">{car.description || "No description available."}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-lg">Owner</h3>
        <p className="text-gray-700">{car.owner?.name || "N/A"}</p>
      </div>

      <button
        onClick={handleRent}
        disabled={!user || renting}
        className={`mt-6 w-full py-2 rounded-lg text-white ${
          user
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {renting ? "Processing..." : user ? "Rent Now" : "Login to Rent"}
      </button>
    </div>
  );
}
