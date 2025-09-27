import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function MyRentals() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRentals = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/rentals/mine", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRentals(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rentals:", err);
        setLoading(false);
      }
    };

    fetchRentals();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-bold text-red-600">Login required</h2>
        <p className="mt-2 text-gray-700">Please login to view your rentals.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📑 My Rentals</h1>

      {loading && <p>Loading rentals...</p>}

      {!loading && rentals.length === 0 && (
        <p className="text-gray-600">No rentals found.</p>
      )}

      {/* Rentals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rentals.map((rental) => (
          <div
            key={rental._id}
            className="bg-white shadow rounded-lg overflow-hidden flex flex-col"
          >
            <img
              src={rental.car?.image || "https://via.placeholder.com/300x200"}
              alt={rental.car?.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">{rental.car?.name}</h2>
                <p className="text-gray-600">{rental.car?.type}</p>
                <p className="mt-2 font-bold">${rental.car?.price} / day</p>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {rental.status}
                </p>
                {user.role === "tenant" ? (
                  <p>
                    <span className="font-semibold">Owner:</span>{" "}
                    {rental.owner?.name || "N/A"}
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Rented By:</span>{" "}
                    {rental.tenant?.name || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
