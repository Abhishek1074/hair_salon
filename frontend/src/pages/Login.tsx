import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@studionora.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await login(email, password); navigate("/admin"); }
    catch (err: any) { setError(err.response?.data?.message || "Unable to sign in. Check your details."); }
    finally { setBusy(false); }
  }
  return <><Navbar/><main className="form-page"><form className="form-card" onSubmit={submit}><p className="eyebrow">WELCOME BACK</p><h1>ADMIN LOGIN<span>.</span></h1><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error && <p className="error">{error}</p>}<button className="button full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button><p className="form-note">Admin access only. Configure credentials in backend/.env.</p><Link to="/" className="under-link">Back to home</Link></form></main></>;
}
