import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CarDetails from "./pages/CarDetails";
import Profile from "./pages/Profile";
import AddCar from "./pages/AddCar";
import MyRentals from "./pages/MyRentals";
import OwnerRentals from "./pages/OwnerRentals";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Router>
          {/* Navbar */}
          <Navbar />

          {/* Main content grows to fill space */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/add-car" element={<AddCar />} />
              <Route path="/my-rentals" element={<MyRentals />} />
              <Route path="/rentals/manage" element={<OwnerRentals />} />
              <Route path="/cars/:id" element={<CarDetails />} />

              {/* Redirect any unknown routes to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}
