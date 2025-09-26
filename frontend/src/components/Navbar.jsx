import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <nav className="bg-yellow-100 shadow-md px-6 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-gray-800">
        🚗 CarRent
      </Link>

      {/* Hamburger Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col justify-between w-6 h-6 focus:outline-none z-50"
      >
        <span
          className={`block h-0.5 w-full bg-gray-800 transition-transform ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block h-0.5 w-full bg-gray-800 transition-opacity ${
            open ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block h-0.5 w-full bg-gray-800 transition-transform ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* Full-screen Overlay Menu */}
      {open && (
        <div className="fixed inset-0 bg-yellow-50 bg-opacity-95 flex flex-col justify-center items-center z-40 space-y-6 text-2xl">
          {user ? (
            <>
              <span className="text-gray-700 mb-4">Hi, {user.name}</span>

              {/* Both tenant and owner can add cars */}
              <Link
                to="/add-car"
                className="hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                Add Car
              </Link>

              {/* Both can view rented cars */}
              <Link
                to="/my-rentals"
                className="hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                Rented Cars
              </Link>

              <Link
                to="/profile"
                className="hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 mt-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-900"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
