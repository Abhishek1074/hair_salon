import { motion } from "framer-motion";
import { ArrowUpRight, Scissors, Sparkles, Wind, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Service = { _id: string; name: string; description: string; price: number; durationMinutes: number };
const fallback = [
  { _id: "1", name: "Cut & Style", description: "A tailored cut and beautifully finished style.", price: 65, durationMinutes: 60 },
  { _id: "2", name: "Colour & Balayage", description: "Bespoke colour with seamless, natural blending.", price: 95, durationMinutes: 150 },
  { _id: "3", name: "Highlights", description: "Foil and freehand highlights for dimension.", price: 85, durationMinutes: 120 },
  { _id: "4", name: "Blow-Dry", description: "A polished salon finish with lasting volume.", price: 40, durationMinutes: 45 },
  { _id: "5", name: "Keratin Treatment", description: "Smoothing treatment for softer, manageable hair.", price: 150, durationMinutes: 180 },
  { _id: "6", name: "Hair Extensions", description: "Consultation-led extensions tailored to you.", price: 200, durationMinutes: 180 }
];
const icons = [Scissors, Sparkles, Sparkles, Wind, Sparkles, Scissors];

export default function Home() {
  const [services, setServices] = useState<Service[]>(fallback);
  useEffect(() => { api.get("/services").then(r => setServices(r.data)).catch(() => setServices(fallback)); }, []);
  return <>
    <Navbar/>
    <main>
      <section className="hero">
        <div className="hero-photo"/>
        <div className="hero-watermark">NORA</div>
        <motion.div className="hero-copy" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .12 } } }}>
          <motion.p className="eyebrow" variants={rise}>HAIR BY JOSHNA , ULHASNAGR</motion.p>
          <motion.h1 variants={rise}>YOUR HAIR.<br/>YOUR STORY.<br/><em>OUR CRAFT.</em></motion.h1>
          <motion.p className="hero-sub" variants={rise}>Expert cuts, colour, and styling for women who know exactly what they want — and those still discovering it.</motion.p>
          <motion.div className="hero-actions" variants={rise}><Link className="button" to="/book">Book an appointment <ArrowUpRight size={17}/></Link><a className="under-link" href="#work">See our work</a></motion.div>
          <motion.p className="trust" variants={rise}>10+ YEARS <i/> NOTTING HILL <i/> WALK-INS WELCOME MONDAYS</motion.p>
        </motion.div>
      </section>

      <section className="section" id="services">
        <div className="section-head"><p className="eyebrow">THE STUDIO MENU</p><h2>WHAT WE DO<span>.</span></h2><p>Thoughtful services. Considered details. Hair that feels like you.</p></div>
        <div className="service-grid">{services.map((s, i) => { const Icon = icons[i % icons.length]; return <article className="service-card" key={s._id}><Icon className="service-icon"/><h3>{s.name}</h3><p>{s.description}</p><div className="service-bottom"><span>FROM £{s.price}</span><small>{s.durationMinutes} MIN</small></div></article>; })}</div>
      </section>

      <section className="gallery-section" id="work"><div className="section-head"><p className="eyebrow">A LITTLE INSPIRATION</p><h2>OUR WORK<span>.</span></h2></div>
        <div className="gallery">
          {[
            "photo-1522337360788-8b13dee7a37e",
            "photo-1512316609839-ce289d3eba0a",
            "photo-1524250502761-1ac6f2e30d43",
            "photo-1487412720507-e7ab37603c6f",
            "photo-1524504388940-b1c1722653e1"
          ].map((id, i) => <div className={`gallery-img g${i+1}`} key={id} style={{backgroundImage:`url(https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=85)`}}/>)}
        </div>
      </section>

      <section className="why-section" id="about"><div><p className="eyebrow">THE STUDIO DIFFERENCE</p><h2>WE DON'T DO<br/>CONVEYOR BELT<br/><em>HAIR.</em></h2><p className="why-copy">Every appointment starts with a conversation. No rushed bookings, no double-stacking clients. Just considered care, honest advice, and a stylist who gets to know your hair.</p><ul>{["A dedicated stylist every visit","No hidden pricing","Free colour consultations","24-hour cancellation policy"].map(x=><li key={x}><Check size={17}/>{x}</li>)}</ul></div><div className="why-photo"/></section>

      <section className="quote-section"><p className="eyebrow">KIND WORDS</p><div className="stars">★★★★★</div><blockquote>“I've been coming to Studio Nora for 3 years. The colour work is genuinely exceptional — I get compliments every time I leave.”</blockquote><p className="quote-credit">RACHEL S. · NOTTING HILL</p></section>
      <section className="booking-cta"><p className="eyebrow">YOUR CHAIR IS WAITING</p><h2>READY FOR YOUR<br/>BEST HAIR?</h2><p>Book online in 60 seconds — choose your service, stylist, and time.</p><Link to="/book" className="button button-dark">Book now <ArrowUpRight size={17}/></Link><small>NEW CLIENTS WELCOME · CONSULTATIONS ALWAYS FREE</small></section>
    </main>
    <Footer/>
  </>;
}
const rise = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: .6 } } };
