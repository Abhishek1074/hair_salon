import { FormEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

type Service = { _id: string; name: string; price: number; durationMinutes: number };
type Stylist = { _id: string; name: string; specialty: string };
export default function Book() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [stylistId, setStylistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/services"), api.get("/stylists")]).then(([s, st]) => {
      setServices(s.data); setStylists(st.data);
      if (s.data[0]) setServiceId(s.data[0]._id);
      if (st.data[0]) setStylistId(st.data[0]._id);
    }).catch(() => setError("Could not load salon services. Please try again."));
  }, []);

  useEffect(() => {
    if (!serviceId || !stylistId || !date) { setSlots([]); return; }
    api.get("/appointments/availability", { params: { serviceId, stylistId, date } })
      .then(r => setSlots(r.data.slots)).catch(() => setSlots([]));
  }, [serviceId, stylistId, date]);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setMessage("");
    if (!user) { setError("Please sign in before booking. Use the login page."); return; }
    setBusy(true);
    try {
      const { data } = await api.post("/appointments", { serviceId, stylistId, date, startTime: time, customerNotes: notes });
      setMessage(`Your booking request is saved. Booking ID: ${data.bookingId}. Status: ${data.status}.`);
      setTime(""); setNotes("");
    } catch (err: any) { setError(err.response?.data?.message || "Booking failed. Please try another slot."); }
    finally { setBusy(false); }
  }

  return <><Navbar/><main className="booking-page"><div className="booking-intro"><p className="eyebrow">MAKE IT YOURS</p><h1>BOOK YOUR<br/><em>APPOINTMENT.</em></h1><p>Choose your service, stylist, and a time that works for you.</p></div>
    <form className="booking-form" onSubmit={submit}>
      <div className="step-title"><span>01</span><div><h2>Choose your service</h2><p>Every great hair day starts here.</p></div></div>
      <div className="choice-grid">{services.map(s=><button type="button" key={s._id} className={`choice ${serviceId===s._id?"selected":""}`} onClick={()=>{setServiceId(s._id);setTime("");}}><b>{s.name}</b><span>£{s.price} · {s.durationMinutes} min</span></button>)}</div>
      <div className="step-title"><span>02</span><div><h2>Choose your stylist</h2><p>Good hands make all the difference.</p></div></div>
      <div className="choice-grid">{stylists.map(s=><button type="button" key={s._id} className={`choice ${stylistId===s._id?"selected":""}`} onClick={()=>{setStylistId(s._id);setTime("");}}><b>{s.name}</b><span>{s.specialty}</span></button>)}</div>
      <div className="step-title"><span>03</span><div><h2>Find your time</h2><p>Times shown are based on current availability.</p></div></div>
      <label className="field-label">Appointment date<input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>{setDate(e.target.value);setTime("");}} required/></label>
      {date && <div className="slot-grid">{slots.length ? slots.map(slot=><button type="button" key={slot} className={`slot ${time===slot?"selected":""}`} onClick={()=>setTime(slot)}>{slot}</button>) : <p className="muted">No available times for this date. Try another day.</p>}</div>}
      <label className="field-label">Special requests (optional)<textarea value={notes} onChange={e=>setNotes(e.target.value)} maxLength={500} placeholder="Tell us anything your stylist should know..."/></label>
      {!user && <p className="notice">You need to <Link to="/login">sign in</Link> before confirming an appointment. Ask the salon admin to create a customer account or extend the app with customer registration.</p>}
      {error && <p className="error">{error}</p>}{message && <p className="success">{message}</p>}
      <button className="button full" disabled={busy || !time}>{busy ? "Confirming..." : "Confirm appointment ↗"}</button>
    </form>
  </main><Footer/></>;
}
