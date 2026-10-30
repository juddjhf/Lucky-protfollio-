import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [["Home", "/"], ["About", "/about"], ["Skills", "/skills"], ["Services", "/services"], ["Projects", "/projects"]];

export function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <header className="site-header">
        <nav className="container flex h-[76px] items-center justify-between" aria-label="Main navigation">
          <Link to="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark">L</span><span>lucky<span className="text-cyan">.</span></span></Link>
          <div className="hidden items-center gap-8 md:flex">
            {links.map(([label, path]) => <NavLink key={path} to={path} end={path === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>{label}</NavLink>)}
          </div>
          <Link to="/contact" className="button button-outline hidden md:inline-flex">Let’s talk <ArrowUpRight size={16} /></Link>
          <button className="icon-button md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </nav>
        {open && <div className="mobile-menu md:hidden">{links.map(([label, path]) => <NavLink onClick={() => setOpen(false)} key={path} to={path}>{label}</NavLink>)}<Link onClick={() => setOpen(false)} to="/contact">Let’s talk ↗</Link></div>}
      </header>
      <main><Outlet /></main>
      <footer className="border-t border-white/10 py-8">
        <div className="container flex flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} Lucky Kumar. Built with curiosity.</span><span>MERN Stack Developer · Available for freelance</span></div>
      </footer>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, description, centered = false }) {
  return <div className={`mb-10 ${centered ? "text-center" : ""}`}><p className="eyebrow">{eyebrow}</p><h2 className="section-title">{title}</h2>{description && <p className="mt-4 max-w-2xl text-slate-400">{description}</p>}</div>;
}
