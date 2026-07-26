// frontend/src/components/PageHeader.jsx
// Shared header used across pages — icon-badge eyebrow + display title + subtitle.
import { Terminal } from "lucide-react";

export default function PageHeader({ eyebrow, title, subtitle, accent = "accent" }) {
  const classes = {
    accent: "text-accent bg-accent/10 border-accent/20",
    "accent-2": "text-accent-2 bg-accent-2/10 border-accent-2/20",
    "accent-3": "text-accent-3 bg-accent-3/10 border-accent-3/20",
    "accent-4": "text-accent-4 bg-accent-4/10 border-accent-4/20",
  }[accent];

  return (
    <div className="mb-8">
      <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider rounded-full border px-2.5 py-1 mb-3 ${classes}`}>
        <Terminal size={12} strokeWidth={2.5} />
        {eyebrow}
      </span>
      <h1 className="font-display font-semibold text-2xl md:text-3xl text-text-bright">{title}</h1>
      {subtitle && <p className="text-sm text-text mt-2 max-w-lg">{subtitle}</p>}
    </div>
  );
}