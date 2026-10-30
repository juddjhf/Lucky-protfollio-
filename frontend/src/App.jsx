import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { About, Contact, Home, ProjectDetails, Projects, Services, Skills } from "./pages/PublicPages";
import { AdminGate, AdminLogin, AdminShell, ContentManager, Dashboard, MessageManager, ProjectEditor, ProjectManager } from "./pages/AdminPages";

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="skills" element={<Skills />} />
      <Route path="services" element={<Services />} />
      <Route path="projects" element={<Projects />} />
      <Route path="projects/:slug" element={<ProjectDetails />} />
      <Route path="contact" element={<Contact />} />
    </Route>
    <Route path="admin/login" element={<AdminLogin />} />
    <Route path="admin" element={<AdminGate />}>
      <Route element={<AdminShell />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectManager />} />
        <Route path="projects/new" element={<ProjectEditor />} />
        <Route path="projects/:id/edit" element={<ProjectEditor />} />
        <Route path="skills" element={<ContentManager type="skills" />} />
        <Route path="services" element={<ContentManager type="services" />} />
        <Route path="messages" element={<MessageManager />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
