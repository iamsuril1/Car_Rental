import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function OwnerRentals() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/rentals/owner", {
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

  const handleUpdateStatus = async (rentalId, status) => {
    if (!user) return;
    try {
      setUpdatingId(rentalId);
      const res = await axios.put(
        `http://localhost:5000/api/rentals/${rentalId}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Update rentals in state
      setRentals((prev) =>
        prev.map((r) => (r._id === rentalId ? res.data : r))
      );
    } catch (err) {
      console.error("Error updating rental:", err);
      alert("Failed to update rental status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-red-600 font-bold text-xl">Login required</h2>
        <p>Please login to view your rentals.</p>
      </div>
    );
  }

  if (loading) return <p className="p-6">Loading rentals...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📝 Rental Requests for Your Cars</h1>

      {rentals.length === 0 ? (
        <p className="text-gray-500">No rental requests at the moment.</p>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div
              key={rental._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{rental.car.name}</h2>
                <p className="text-gray-600">
                  Tenant: {rental.tenant.name} ({rental.tenant.email})
                </p>
                <p className="text-gray-600">Price: ${rental.car.price} / day</p>
                <p className="text-gray-600">Status: {rental.status}</p>
              </div>

              <div className="mt-4 md:mt-0 flex space-x-2">
                <button
                  disabled={updatingId === rental._id || rental.status === "accepted"}
                  onClick={() => handleUpdateStatus(rental._id, "accepted")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  disabled={updatingId === rental._id || rental.status === "declined"}
                  onClick={() => handleUpdateStatus(rental._id, "declined")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
