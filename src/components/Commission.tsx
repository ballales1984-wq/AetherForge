"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function Commission() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    budget: "",
    timeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/commissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          brief: formData.project,
          budget_range: formData.budget || undefined,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", project: "", budget: "", timeline: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="commission" className="relative bg-[#050505] py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-100" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-400/10 blur-100" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div data-reveal className="mb-12 max-w-3xl">
          <p className="font-display text-sm uppercase tracking-wide text-cyan-300">Commission</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">Custom commission pipeline.</span>
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" data-reveal>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="project">Project Details</label>
            <textarea
              id="project"
              rows={4}
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
              placeholder="Describe your concept..."
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="budget">Budget Range</label>
              <input
                id="budget"
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                placeholder="$10k - $25k"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="timeline">Timeline</label>
              <input
                id="timeline"
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                placeholder="3-6 months"
              />
            </div>
          </div>
          {submitStatus === "success" && (
            <p className="text-cyan-300 text-sm">Commission request submitted successfully!</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-400 text-sm">Failed to submit. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-r from-cyan-300 to-cyan-400 px-8 py-4 font-semibold text-black transition hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.4)] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Commission Request"}
          </button>
        </form>
      </div>
    </section>
  );
}