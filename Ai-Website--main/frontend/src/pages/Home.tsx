import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Sparkles, Zap, LayoutGrid, ArrowRight, ShieldCheck, Wand } from 'lucide-react';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute left-[-140px] top-1/3 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <Wand2 className="h-5 w-5 text-blue-300" />
          </div>
          <div className="text-sm font-semibold tracking-wide text-white/90">Website Builder AI</div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">Gemini-powered</div>
          <button
            type="button"
            onClick={() => navigate('/builder', { state: { prompt } })}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/10 transition hover:bg-white/15"
          >
            Open builder
          </button>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-14">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-blue-300" />
              Turn a prompt into a polished website
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              Build a modern website
              <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent"> in minutes</span>
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-white/70 sm:text-lg">
              Describe what you want. I’ll generate a clean project structure, components, and step-by-step edits you can preview instantly.
            </p>

            <form onSubmit={handleSubmit} className="mt-7">
              <div className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10 backdrop-blur">
                <label className="mb-2 block text-xs font-medium text-white/70">Your website idea</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A sleek portfolio for a UI designer with a dark theme, case studies, and a contact form"
                  className="min-h-[130px] w-full resize-none rounded-xl bg-black/30 p-4 text-sm text-white/90 ring-1 ring-white/10 placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-white/50">Tip: mention style, pages, and sections you need.</div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(59,130,246,0.75)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                  >
                    <Zap className="h-4 w-4" />
                    Generate website plan
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/50">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-200" />
                No credit card required
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                <Wand className="h-4 w-4 text-blue-200" />
                Tailwind + React by default
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/20">
                    <LayoutGrid className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="text-sm font-semibold text-white/90">Production-ready UI</div>
                </div>
                <div className="mt-3 text-sm leading-6 text-white/65">Modern layout, typography, icons, and responsive sections out of the box.</div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/15 ring-1 ring-fuchsia-400/20">
                    <Sparkles className="h-5 w-5 text-fuchsia-200" />
                  </div>
                  <div className="text-sm font-semibold text-white/90">Iterate fast</div>
                </div>
                <div className="mt-3 text-sm leading-6 text-white/65">Chat to refine sections, regenerate components, and adjust styling with ease.</div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-400/20">
                    <Zap className="h-5 w-5 text-cyan-200" />
                  </div>
                  <div className="text-sm font-semibold text-white/90">Live preview</div>
                </div>
                <div className="mt-3 text-sm leading-6 text-white/65">See changes instantly as the project evolves, right in your browser.</div>
              </div>
              <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                    <Wand2 className="h-5 w-5 text-white/80" />
                  </div>
                  <div className="text-sm font-semibold text-white/90">Guided structure</div>
                </div>
                <div className="mt-3 text-sm leading-6 text-white/65">Organized steps so you can understand, edit, and ship confidently.</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 ring-1 ring-white/10">
              <div className="text-xs font-medium uppercase tracking-wider text-white/60">Example prompts</div>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => setPrompt("A landing page for a SaaS product with pricing, testimonials, and a waitlist form")}
                  className="text-left rounded-xl bg-black/20 px-4 py-3 text-sm text-white/75 ring-1 ring-white/10 transition hover:bg-black/30"
                >
                  SaaS landing with pricing + testimonials
                </button>
                <button
                  type="button"
                  onClick={() => setPrompt("A restaurant website with a hero image, menu section, reservation form, and location map")}
                  className="text-left rounded-xl bg-black/20 px-4 py-3 text-sm text-white/75 ring-1 ring-white/10 transition hover:bg-black/30"
                >
                  Restaurant site with menu + reservations
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <div className="rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-white/55">Trusted by builders</div>
                <div className="mt-2 text-lg font-semibold text-white/90">Made for indie hackers, teams, and startups</div>
                <div className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                  From quick MVPs to marketing sites — generate clean structure you can own, edit, and ship.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['NOVA', 'PULSE', 'ARC', 'STUDIO'].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-center rounded-2xl bg-black/20 px-4 py-3 text-xs font-semibold tracking-widest text-white/60 ring-1 ring-white/10"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-black/20 p-5 ring-1 ring-white/10">
                <div className="text-2xl font-semibold text-white/90">10x</div>
                <div className="mt-1 text-sm text-white/60">Faster from idea to first draft</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-5 ring-1 ring-white/10">
                <div className="text-2xl font-semibold text-white/90">60s</div>
                <div className="mt-1 text-sm text-white/60">Average time to generate a plan</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-5 ring-1 ring-white/10">
                <div className="text-2xl font-semibold text-white/90">1</div>
                <div className="mt-1 text-sm text-white/60">Prompt to start building</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <div className="text-xs font-medium uppercase tracking-wider text-white/55">How it works</div>
              <h2 className="mt-3 text-2xl font-semibold text-white/90 sm:text-3xl">From prompt to preview — step by step</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                You stay in control. The builder proposes changes as structured steps and generates the project files you can inspect.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-4">
                {[{
                  title: 'Describe your website',
                  desc: 'Explain style, pages, and sections. Add references if you have them.',
                }, {
                  title: 'Get a clean project plan',
                  desc: 'A structured set of steps and files is generated based on your prompt.',
                }, {
                  title: 'Preview + iterate',
                  desc: 'Refine with chat, regenerate sections, and keep improving until it’s perfect.',
                }].map((item, idx) => (
                  <div key={item.title} className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10">
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-semibold text-blue-200 ring-1 ring-blue-400/20">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white/90">{item.title}</div>
                        <div className="mt-1 text-sm leading-6 text-white/65">{item.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-fuchsia-600/15 p-6 ring-1 ring-white/10 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-white/70">Ready to ship?</div>
                <div className="mt-2 text-2xl font-semibold text-white/95 sm:text-3xl">Start building your next startup landing page</div>
                <div className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Drop an idea above, or jump straight into the builder and iterate with chat.</div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/builder', { state: { prompt: prompt || 'A modern startup landing page with pricing, testimonials, and a waitlist form' } })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_60px_-18px_rgba(255,255,255,0.35)] transition hover:bg-white/90"
              >
                Launch builder
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-14 border-t border-white/10 pt-8 text-center text-xs text-white/40">
          Built with React + Tailwind. Generate, preview, refine.
        </footer>
      </main>
    </div>
  );
}