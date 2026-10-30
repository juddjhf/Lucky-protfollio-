import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Check, ChevronRight, FolderKanban, LayoutDashboard, LogOut, Mail, Plus, Settings2, Trash2, UploadCloud, Wrench } from "lucide-react";
import api, { getErrorMessage } from "../api";
import { ErrorState, Loading, Notice } from "../components/Ui";

export function AdminGate() {
  const [state, setState] = useState("checking");
  useEffect(() => {
    if (!localStorage.getItem("portfolio_admin_token")) { setState("guest"); return; }
    api.get("/admin/me").then(() => setState("admin")).catch(() => {
      localStorage.removeItem("portfolio_admin_token");
      setState("guest");
    });
  }, []);
  if (state === "checking") return <Loading label="Checking admin session..." />;
  return state === "admin" ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export function AdminShell() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("portfolio_admin_token");
    navigate("/admin/login", { replace: true });
  }
  const navigation = [
    ["/admin", "Overview", LayoutDashboard],
    ["/admin/projects", "Projects", FolderKanban],
    ["/admin/skills", "Skills", Wrench],
    ["/admin/services", "Services", BriefcaseBusiness],
    ["/admin/messages", "Messages", Mail]
  ];
  return <div className="admin-layout">
    <aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark">L</span><span>lucky<span className="text-cyan">.</span></span></Link><p className="admin-caption">PORTFOLIO CMS</p><nav className="mt-7 space-y-1">{navigation.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === "/admin"} className={({ isActive }) => `admin-nav ${isActive ? "admin-nav-active" : ""}`}><Icon size={18} />{label}<ChevronRight className="ml-auto" size={15} /></NavLink>)}</nav><div className="mt-auto border-t border-white/10 pt-5"><Link className="admin-nav" to="/"><ArrowLeft size={18} />View website</Link><button className="admin-nav w-full" onClick={logout}><LogOut size={18} />Sign out</button></div></aside>
    <div className="admin-content"><header className="admin-topbar"><div><p className="eyebrow">LUCKY KUMAR / ADMIN</p><p className="text-sm text-slate-400">Manage your portfolio content</p></div><div className="admin-avatar">LK</div></header><main className="admin-main"><Outlet /></main></div>
  </div>;
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, setState] = useState({ loading: false, error: "" });
  async function submit(event) {
    event.preventDefault();
    setState({ loading: true, error: "" });
    try {
      const { data } = await api.post("/admin/login", form);
      localStorage.setItem("portfolio_admin_token", data.token);
      navigate("/admin", { replace: true });
    } catch (error) { setState({ loading: false, error: getErrorMessage(error) }); }
  }
  return <div className="login-page"><Link to="/" className="brand absolute left-7 top-7"><span className="brand-mark">L</span><span>lucky<span className="text-cyan">.</span></span></Link><form className="glass login-card" onSubmit={submit}><p className="eyebrow">ADMIN ACCESS</p><h1 className="mt-3 font-display text-3xl font-semibold text-white">Welcome back</h1><p className="mt-2 text-sm text-slate-400">Sign in to manage your portfolio.</p><label className="field-label mt-7">Email<input className="field" type="email" autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label><label className="field-label mt-5">Password<input className="field" type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label><Notice type="error">{state.error}</Notice><button className="button button-primary mt-6 w-full" disabled={state.loading}>{state.loading ? "Signing in..." : "Sign in"}</button></form></div>;
}

export function Dashboard() {
  const [state, setState] = useState({ loading: true, error: "", counts: {} });
  useEffect(() => {
    Promise.all(["/projects", "/skills", "/services", "/contact"].map((path) => api.get(path)))
      .then((responses) => setState({ loading: false, error: "", counts: { Projects: responses[0].data.length, Skills: responses[1].data.length, Services: responses[2].data.length, Messages: responses[3].data.length } }))
      .catch((error) => setState({ loading: false, error: getErrorMessage(error), counts: {} }));
  }, []);
  if (state.loading) return <Loading label="Loading dashboard..." />;
  return <div><p className="eyebrow">YOUR WORKSPACE</p><h1 className="admin-heading">Dashboard</h1><p className="mt-2 text-slate-400">A quick look at the content in your portfolio.</p>{state.error ? <div className="mt-6"><ErrorState message={state.error} /></div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Object.entries(state.counts).map(([label, count]) => <div className="glass stat-card" key={label}><p className="text-sm text-slate-400">{label}</p><p className="mt-3 font-display text-4xl font-semibold text-white">{count}</p><Link className="text-link mt-5 text-sm" to={`/admin/${label.toLowerCase()}`}>Manage {label.toLowerCase()} <ChevronRight size={15} /></Link></div>)}</div>}<div className="glass mt-8 flex flex-col gap-5 p-7 sm:flex-row sm:items-center"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><Settings2 /></div><div className="flex-1"><h2 className="font-display text-lg font-semibold text-white">Keep your portfolio up to date</h2><p className="mt-1 text-sm text-slate-400">Add a project, refresh your skills, or respond to a new message.</p></div><Link to="/admin/projects/new" className="button button-primary"><Plus size={16} /> Add a project</Link></div></div>;
}

const resourceConfig = {
  skills: { title: "Skills", endpoint: "/skills", label: "skill", fields: [{ key: "name", label: "Name", required: true }, { key: "category", label: "Category", required: true }, { key: "proficiency", label: "Proficiency (0–100)", type: "number" }, { key: "icon", label: "Icon name" }, { key: "order", label: "Display order", type: "number" }] },
  services: { title: "Services", endpoint: "/services", label: "service", fields: [{ key: "title", label: "Title", required: true }, { key: "description", label: "Description", type: "textarea", required: true }, { key: "icon", label: "Icon name" }, { key: "order", label: "Display order", type: "number" }] }
};

export function ContentManager({ type }) {
  const config = resourceConfig[type];
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: "", success: "" });
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState("");
  async function load() {
    setState({ loading: true, error: "", success: "" });
    try { const { data } = await api.get(config.endpoint); setItems(data); setState({ loading: false, error: "", success: "" }); }
    catch (error) { setState({ loading: false, error: getErrorMessage(error), success: "" }); }
  }
  useEffect(() => { load(); }, [type]);
  function blank() {
    setEditing("");
    setForm(Object.fromEntries(config.fields.map((field) => [field.key, field.key === "order" ? 0 : field.key === "proficiency" ? 75 : ""])));
  }
  async function submit(event) {
    event.preventDefault();
    setState({ loading: false, error: "", success: "" });
    const body = { ...form, proficiency: form.proficiency === "" ? 75 : Number(form.proficiency), order: Number(form.order) || 0 };
    try {
      if (editing) await api.patch(`${config.endpoint}/${editing}`, body);
      else await api.post(config.endpoint, body);
      setForm(null);
      setState({ loading: false, error: "", success: `${config.label[0].toUpperCase()}${config.label.slice(1)} saved.` });
      await load();
    } catch (error) { setState({ loading: false, error: getErrorMessage(error), success: "" }); }
  }
  async function remove(id) {
    if (!window.confirm(`Delete this ${config.label}?`)) return;
    try { await api.delete(`${config.endpoint}/${id}`); await load(); setState({ loading: false, error: "", success: `${config.label} deleted.` }); }
    catch (error) { setState({ ...state, error: getErrorMessage(error) }); }
  }
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">CONTENT</p><h1 className="admin-heading">Manage {config.title}</h1></div><button className="button button-primary" onClick={() => form ? setForm(null) : blank()}>{form ? "Cancel" : <><Plus size={16} /> Add {config.label}</>}</button></div><Notice type="error">{state.error}</Notice><Notice>{state.success}</Notice>
    {form && <form className="glass mt-6 grid gap-4 p-6 sm:grid-cols-2" onSubmit={submit}>{config.fields.map((field) => <label key={field.key} className={`field-label ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>{field.label}{field.type === "textarea" ? <textarea className="field min-h-28" required={field.required} value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} /> : <input className="field" type={field.type || "text"} min={field.type === "number" ? 0 : undefined} max={field.key === "proficiency" ? 100 : undefined} required={field.required} value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />}</label>)}<label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.published !== false} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Published</label><div className="sm:col-span-2"><button className="button button-primary">{editing ? "Save changes" : "Create"} {config.label}</button></div></form>}
    {state.loading ? <Loading /> : state.error ? <div className="mt-6"><ErrorState message={state.error} retry={load} /></div> : !items.length ? <div className="glass mt-6 p-8 text-center text-slate-400">No {config.title.toLowerCase()} yet. Add one to show it on your website.</div> : <div className="mt-6 space-y-3">{items.map((item) => <div key={item._id} className="glass flex flex-wrap items-center gap-4 p-5"><div className="flex-1"><p className="font-medium text-white">{item.name || item.title}</p><p className="mt-1 line-clamp-1 text-sm text-slate-400">{item.category || item.description}</p></div><span className={`tag ${item.published ? "" : "opacity-50"}`}>{item.published ? "Published" : "Hidden"}</span><button className="icon-button" aria-label={`Edit ${config.label}`} onClick={() => { setEditing(item._id); setForm({ ...item }); }}><Settings2 size={17} /></button><button className="icon-button text-rose-300" aria-label={`Delete ${config.label}`} onClick={() => remove(item._id)}><Trash2 size={17} /></button></div>)}</div>}
  </div>;
}

const emptyProject = { title: "", slug: "", shortDescription: "", description: "", image: "", technologies: "", liveUrl: "", githubUrl: "", featured: false, published: true };

export function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProject);
  const [state, setState] = useState({ loading: Boolean(id), saving: false, error: "", success: "" });
  useEffect(() => {
    if (!id) return;
    api.get("/projects").then(({ data }) => {
      const project = data.find((item) => item._id === id);
      if (!project) throw new Error("Project not found");
      setForm({ ...project, technologies: (project.technologies || []).join(", ") });
      setState({ loading: false, saving: false, error: "", success: "" });
    }).catch((error) => setState({ loading: false, saving: false, error: getErrorMessage(error), success: "" }));
  }, [id]);
  function update(event) {
    const { name, value, type, checked } = event.target;
    const next = { ...form, [name]: type === "checkbox" ? checked : value };
    if (name === "title" && !id && !form.slug) next.slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm(next);
  }
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    setState({ loading: false, saving: false, error: "", success: "Uploading image..." });
    try {
      const { data } = await api.post("/upload", body, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((current) => ({ ...current, image: data.url }));
      setState({ loading: false, saving: false, error: "", success: "Image uploaded." });
    } catch (error) { setState({ loading: false, saving: false, error: getErrorMessage(error), success: "" }); }
  }
  async function submit(event) {
    event.preventDefault();
    setState({ loading: false, saving: true, error: "", success: "" });
    const body = { ...form, technologies: form.technologies.split(",").map((item) => item.trim()).filter(Boolean) };
    try {
      if (id) await api.patch(`/projects/${id}`, body);
      else await api.post("/projects", body);
      navigate("/admin/projects", { state: { message: id ? "Project updated successfully." : "Project created successfully." } });
    } catch (error) { setState({ loading: false, saving: false, error: getErrorMessage(error), success: "" }); }
  }
  if (state.loading) return <Loading label="Loading project..." />;
  return <div><Link to="/admin/projects" className="text-link"><ArrowLeft size={15} /> Back to projects</Link><p className="eyebrow mt-7">PROJECTS</p><h1 className="admin-heading">{id ? "Edit project" : "Add a project"}</h1><Notice type="error">{state.error}</Notice><Notice>{state.success}</Notice>
    <form className="glass mt-6 grid gap-5 p-6 lg:grid-cols-2" onSubmit={submit}>
      <label className="field-label">Project title<input className="field" name="title" value={form.title} onChange={update} required maxLength={100} /></label>
      <label className="field-label">URL slug<input className="field" name="slug" value={form.slug} onChange={update} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
      <label className="field-label lg:col-span-2">Short description<input className="field" name="shortDescription" value={form.shortDescription} onChange={update} required maxLength={240} /></label>
      <label className="field-label lg:col-span-2">Full description<textarea className="field min-h-40" name="description" value={form.description} onChange={update} required maxLength={5000} /></label>
      <label className="field-label lg:col-span-2">Technologies <span className="font-normal text-slate-500">(comma-separated)</span><input className="field" name="technologies" value={form.technologies} onChange={update} placeholder="React, Node.js, MongoDB" /></label>
      <label className="field-label">Live project URL<input className="field" name="liveUrl" type="url" value={form.liveUrl} onChange={update} placeholder="https://" /></label>
      <label className="field-label">GitHub URL<input className="field" name="githubUrl" type="url" value={form.githubUrl} onChange={update} placeholder="https://github.com/..." /></label>
      <div className="field-label lg:col-span-2">Cover image <div className="mt-2 flex flex-wrap items-center gap-4">{form.image && <img className="h-20 w-32 rounded-lg object-cover" src={form.image} alt="Project cover preview" />}<label className="button button-outline cursor-pointer"><UploadCloud size={16} /> Upload image<input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={upload} /></label><span className="text-xs text-slate-500">Up to 5 MB · Cloudinary required</span></div><input className="field mt-3" aria-label="Image URL" name="image" value={form.image} onChange={update} placeholder="Or paste an image URL" /></div>
      <div className="flex flex-wrap gap-6 lg:col-span-2"><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" name="featured" checked={form.featured} onChange={update} /> Featured</label><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" name="published" checked={form.published} onChange={update} /> Published</label></div>
      <div className="lg:col-span-2"><button className="button button-primary" disabled={state.saving}>{state.saving ? "Saving..." : id ? "Save changes" : "Create project"} <Check size={16} /></button></div>
    </form>
  </div>;
}

export function ProjectManager() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: "", success: "" });
  const location = window.history.state?.usr;
  async function load() {
    setState((current) => ({ ...current, loading: true }));
    try { const { data } = await api.get("/projects"); setItems(data); setState({ loading: false, error: "", success: location?.message || "" }); }
    catch (error) { setState({ loading: false, error: getErrorMessage(error), success: "" }); }
  }
  useEffect(() => { load(); }, []);
  async function remove(id) {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try { await api.delete(`/projects/${id}`); await load(); setState({ loading: false, error: "", success: "Project deleted." }); }
    catch (error) { setState({ loading: false, error: getErrorMessage(error), success: "" }); }
  }
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">PORTFOLIO</p><h1 className="admin-heading">Manage projects</h1></div><Link className="button button-primary" to="/admin/projects/new"><Plus size={16} /> Add project</Link></div><Notice type="error">{state.error}</Notice><Notice>{state.success}</Notice>{state.loading ? <Loading /> : state.error ? <ErrorState message={state.error} retry={load} /> : !items.length ? <div className="glass mt-6 p-8 text-center text-slate-400">No projects yet. Add your first project to publish it.</div> : <div className="mt-6 space-y-3">{items.map((item) => <div className="glass flex flex-wrap items-center gap-4 p-4" key={item._id}>{item.image ? <img className="h-16 w-24 rounded-lg object-cover" src={item.image} alt="" /> : <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-white/5 text-cyan"><FolderKanban /></div>}<div className="min-w-40 flex-1"><p className="font-medium text-white">{item.title}</p><p className="mt-1 text-sm text-slate-400">{item.slug}</p></div><span className={`tag ${item.published ? "" : "opacity-50"}`}>{item.published ? "Published" : "Hidden"}</span>{item.featured && <span className="tag text-cyan">Featured</span>}<Link className="icon-button" aria-label={`Edit ${item.title}`} to={`/admin/projects/${item._id}/edit`}><Settings2 size={17} /></Link><button className="icon-button text-rose-300" aria-label={`Delete ${item.title}`} onClick={() => remove(item._id)}><Trash2 size={17} /></button></div>)}</div>}</div>;
}

export function MessageManager() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  async function load() {
    setState({ loading: true, error: "" });
    try { const { data } = await api.get("/contact"); setItems(data); setState({ loading: false, error: "" }); }
    catch (error) { setState({ loading: false, error: getErrorMessage(error) }); }
  }
  useEffect(() => { load(); }, []);
  async function toggle(item) {
    try { await api.patch(`/contact/${item._id}`, { read: !item.read }); await load(); }
    catch (error) { setState({ loading: false, error: getErrorMessage(error) }); }
  }
  async function remove(item) {
    if (!window.confirm("Delete this message?")) return;
    try { await api.delete(`/contact/${item._id}`); await load(); }
    catch (error) { setState({ loading: false, error: getErrorMessage(error) }); }
  }
  return <div><p className="eyebrow">INBOX</p><h1 className="admin-heading">Contact messages</h1><p className="mt-2 text-slate-400">Messages sent through the public contact form.</p><Notice type="error">{state.error}</Notice>{state.loading ? <Loading /> : state.error ? <ErrorState message={state.error} retry={load} /> : !items.length ? <div className="glass mt-6 p-8 text-center text-slate-400">Your inbox is empty. New contact messages will show up here.</div> : <div className="mt-6 space-y-4">{items.map((item) => <article className={`glass p-6 ${item.read ? "opacity-75" : ""}`} key={item._id}><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h2 className="font-display text-lg font-semibold text-white">{item.subject}</h2>{!item.read && <span className="h-2 w-2 rounded-full bg-cyan" />}</div><p className="mt-1 text-sm text-slate-400">{item.name} · <a className="text-cyan hover:underline" href={`mailto:${item.email}`}>{item.email}</a></p></div><time className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</time></div><p className="mt-5 whitespace-pre-wrap leading-7 text-slate-300">{item.message}</p><div className="mt-5 flex gap-3"><button className="button button-outline !px-3 !py-2 text-sm" onClick={() => toggle(item)}>{item.read ? "Mark unread" : "Mark read"}</button><button className="icon-button text-rose-300" onClick={() => remove(item)} aria-label="Delete message"><Trash2 size={17} /></button></div></article>)}</div>}</div>;
}
