import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api";

export default function Book() {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    api
      .get("/labs")
      .then((res) => setLab(res.data.find((l) => l._id === labId)))
      .catch(() => setError("Could not load lab"));
  }, [labId, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/bookings", { ...form, lab: labId });
      setSuccess("Booking request submitted! Status: pending");
      setForm({ date: "", startTime: "", endTime: "", purpose: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="card">
      <h2>Book: {lab ? lab.name : "..."}</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Date</label>
        <input name="date" type="date" min={today} value={form.date} onChange={handleChange} required />
        <label>Start time</label>
        <input name="startTime" type="time" value={form.startTime} onChange={handleChange} required />
        <label>End time</label>
        <input name="endTime" type="time" value={form.endTime} onChange={handleChange} required />
        <input name="purpose" placeholder="Purpose (optional)" value={form.purpose} onChange={handleChange} />
        <button type="submit">Book Slot</button>
      </form>
      <p><Link to="/labs">Back to labs</Link></p>
    </div>
  );
}