import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Labs() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [labs, setLabs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    api
      .get("/labs")
      .then((res) => setLabs(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load labs")
      );
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="topbar">
        <h2>Electronics Lab Booking</h2>
        <div>
                      {user?.role === "admin" && (
            <Link to="/admin" style={{ marginRight: 12 }}>
              Admin
            </Link>
          )}
          <Link to="/my-bookings" style={{ marginRight: 12 }}>
            My Bookings
          </Link>
          <span>
            {user?.name} ({user?.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {labs.length === 0 && !error && <p>No labs available yet.</p>}

      <div className="grid">
        {labs.map((lab) => (
          <div className="lab-card" key={lab._id}>
            <h3>{lab.name}</h3>
            <p>{lab.description}</p>
            <p>Location: {lab.location}</p>
            <p>Capacity: {lab.capacity}</p>
            <span className={lab.isAvailable ? "ok" : "no"}>
              {lab.isAvailable ? "Available" : "Not available"}
            </span>
            <button
              disabled={!lab.isAvailable}
              onClick={() => navigate(`/book/${lab._id}`)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}