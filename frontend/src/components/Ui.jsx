import { motion } from "framer-motion";
import { AlertCircle, LoaderCircle } from "lucide-react";

export function Loading({ label = "Loading..." }) {
  return <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-slate-400"><LoaderCircle className="animate-spin text-cyan" />{label}</div>;
}

export function ErrorState({ message, retry }) {
  return <div className="glass flex items-center gap-3 p-5 text-rose-200"><AlertCircle className="shrink-0" /><span>{message}</span>{retry && <button className="ml-auto text-sm underline" onClick={retry}>Retry</button>}</div>;
}

export function Reveal({ children, className = "" }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.55, ease: "easeOut" }}>{children}</motion.div>;
}

export function Notice({ children, type = "success" }) {
  if (!children) return null;
  return <p role="status" className={`notice ${type === "error" ? "notice-error" : ""}`}>{children}</p>;
}
