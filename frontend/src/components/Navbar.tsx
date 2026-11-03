import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const links = [["Services", "/#services"], ["Our Work", "/#work"], ["About", "/#about"], ["Book", "/book"]];
  return <header className="nav">
    <Link to="/" className="brand">Divine Beauty — Hair Expert | Luxury Salon <span>®</span></Link>
    <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
    <nav className={open ? "nav-links show" : "nav-links"}>
      {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      {user?.role === "admin" && <Link to="/admin">Dashboard</Link>}
      {user ? <button className="text-link" onClick={logout}>Log out</button> : <Link to="/login">Login</Link>}
      <Link to="/book" className="button button-small">Book now <span>↗</span></Link>
    </nav>
  </header>;
}
