import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load bookings")
      );

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    load();
  }, [navigate]);

  const cancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel");
    }
  };

  return (
    <div className="container">
      <div className="topbar">
        <h2>My Bookings</h2>
        <Link to="/labs">Back to labs</Link>
      </div>

      {error && <p className="error">{error}</p>}
      {bookings.length === 0 && !error && <p>No bookings yet.</p>}

      {bookings.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Lab</th>
              <th>Date</th>
              <th>Time</th>
              <th>Purpose</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.lab?.name}</td>
                <td>{b.date}</td>
                <td>
                  {b.startTime} - {b.endTime}
                </td>
                <td>{b.purpose}</td>
                <td className={`status ${b.status}`}>{b.status}</td>
                <td>
                  {(b.status === "pending" || b.status === "approved") && (
                    <button onClick={() => cancel(b._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}