import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Admin() {
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    capacity: 1,
  });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [l, b] = await Promise.all([
        api.get("/labs"),
        api.get("/bookings"),
      ]);
      setLabs(l.data);
      setBookings(b.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load data");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    if (user?.role !== "admin") {
      navigate("/labs");
      return;
    }
    load();
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addLab = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/labs", { ...form, capacity: Number(form.capacity) });
      setForm({ name: "", description: "", location: "", capacity: 1 });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add lab");
    }
  };

  const toggleAvailability = async (lab) => {
    try {
      await api.put(`/labs/${lab._id}`, { isAvailable: !lab.isAvailable });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update lab");
    }
  };

  const removeLab = async (id) => {
    if (!window.confirm("Delete this lab?")) return;
    try {
      await api.delete(`/labs/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete lab");
    }
  };

  const setStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update booking");
    }
  };

  return (
    <div className="container">
      <div className="topbar">
        <h2>Admin Dashboard</h2>
        <Link to="/labs">Back to labs</Link>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="section">
        <h3>Add Lab</h3>
        <form onSubmit={addLab}>
          <input name="name" placeholder="Lab name" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <input name="capacity" type="number" min="1" placeholder="Capacity" value={form.capacity} onChange={handleChange} />
          <button type="submit">Add Lab</button>
        </form>
      </div>

      <div className="section">
        <h3>Manage Labs</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab._id}>
                <td>{lab.name}</td>
                <td>{lab.location}</td>
                <td className={lab.isAvailable ? "ok" : "no"}>
                  {lab.isAvailable ? "Available" : "Not available"}
                </td>
                <td className="row">
                  <button className="small" onClick={() => toggleAvailability(lab)}>
                    {lab.isAvailable ? "Disable" : "Enable"}
                  </button>
                  <button className="small danger" onClick={() => removeLab(lab._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3>All Bookings</h3>
        {bookings.length === 0 && <p>No bookings yet.</p>}
        {bookings.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Lab</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.user?.name}</td>
                  <td>{b.lab?.name}</td>
                  <td>{b.date}</td>
                  <td>
                    {b.startTime} - {b.endTime}
                  </td>
                  <td className={`status ${b.status}`}>{b.status}</td>
                  <td className="row">
                    {b.status === "pending" && (
                      <>
                        <button className="small green" onClick={() => setStatus(b._id, "approved")}>
                          Approve
                        </button>
                        <button className="small danger" onClick={() => setStatus(b._id, "rejected")}>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}