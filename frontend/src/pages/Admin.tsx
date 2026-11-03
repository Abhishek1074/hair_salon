import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type Stats = { totalAppointments:number; todayAppointments:number; pending:number; confirmed:number; completed:number; customers:number; revenue:number };
type Appointment = { _id:string; bookingId:string; date:string; startTime:string; status:string; customer?:{name:string;email:string}; service?:{name:string;price:number}; stylist?:{name:string} };
export default function Admin() {
  const { user } = useAuth();
  const [stats,setStats] = useState<Stats|null>(null);
  const [appointments,setAppointments] = useState<Appointment[]>([]);
  const [error,setError] = useState("");
  async function load() {
    try {
      const [s,a] = await Promise.all([api.get("/admin/dashboard"),api.get("/appointments")]);
      setStats(s.data); setAppointments(a.data);
    } catch (e:any) { setError(e.response?.data?.message || "Could not load admin data."); }
  }
  useEffect(()=>{ if(user?.role==="admin") load(); },[user]);
  async function updateStatus(id:string,status:string) {
    await api.patch(`/appointments/${id}/status`,{status}); load();
  }
  if (!user || user.role !== "admin") return <Navigate to="/login" replace/>;
  const metrics = stats ? [
    ["All appointments",stats.totalAppointments],["Today",stats.todayAppointments],["Pending",stats.pending],
    ["Confirmed",stats.confirmed],["Completed",stats.completed],["Customers",stats.customers],["Revenue",`£${stats.revenue}`]
  ] : [];
  return <><Navbar/><main className="admin-page"><div className="admin-heading"><div><p className="eyebrow">STUDIO NORA / CONTROL ROOM</p><h1>OVERVIEW<span>.</span></h1></div><button className="button button-small" onClick={load}>Refresh ↻</button></div>
    {error && <p className="error">{error}</p>}
    <div className="stats-grid">{metrics.map(([label,value])=><div className="stat-card" key={String(label)}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="table-heading"><h2>Appointments</h2><span>{appointments.length} records</span></div>
    <div className="table-wrap"><table><thead><tr><th>Booking</th><th>Client</th><th>Service</th><th>Stylist</th><th>Date / Time</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {appointments.map(a=><tr key={a._id}><td>{a.bookingId}</td><td>{a.customer?.name || "—"}<small>{a.customer?.email}</small></td><td>{a.service?.name || "—"}</td><td>{a.stylist?.name || "—"}</td><td>{a.date}<small>{a.startTime}</small></td><td><span className="status">{a.status}</span></td><td><select value={a.status} onChange={e=>updateStatus(a._id,e.target.value)}><option>Pending</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></td></tr>)}
      {!appointments.length && <tr><td colSpan={7}>No appointments yet.</td></tr>}
    </tbody></table></div>
  </main></>;
}
