import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Store, ShieldCheck, Banknote, TrendingDown, ArrowRight, Phone } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`font-display text-2xl font-bold ${light ? "text-[#4CAF50]" : "text-[#2E7D32]"}`}>AgriLink</span>
      <span className="text-[10px] uppercase tracking-widest text-[#F9A825]">Solutions</span>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white">
        <img
          src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1600"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-6">
          <nav className="flex items-center justify-between">
            <Logo light />
            <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
              <a href="#how" className="hover:text-white">How it works</a>
              <a href="#tools" className="hover:text-white">For Farmers</a>
              <a href="#tools" className="hover:text-white">For Buyers</a>
              <Link to="/signin" className="hover:text-white">Sign In</Link>
            </div>
            <Link to="/signin" className="md:hidden text-sm text-white/80 hover:text-white">Sign In</Link>
          </nav>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Connecting Farmers.<br />Financing Growth.
            </h1>
            <p className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg text-white/70">
              Ghana's first Agri-Fintech marketplace — fair prices, secure payments, instant financing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link to="/signup" className="inline-flex items-center justify-center rounded-lg bg-[#2E7D32] px-6 py-3 text-sm font-medium text-white hover:bg-[#256528]">
                Join as Farmer
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-[#0F172A]">
                Join as Buyer
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link to="/farmer/dashboard" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 border border-white/20">
                Preview as Farmer <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/buyer/dashboard" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 backdrop-blur px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 border border-white/20">
                Preview as Buyer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TWO TOOLS */}
      <section id="tools" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#1E293B]">Two powerful tools in one platform</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F5E9]">
                <Store className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">AgriLink Market</h3>
              <p className="mt-2 text-sm text-[#64748B]">Buy and sell produce directly across Ghana.</p>
              <ul className="mt-6 space-y-3 text-sm text-[#1E293B]">
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Direct farmer-to-buyer listings, no middlemen</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Escrow-protected payments</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Cold-chain ready logistics</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Real-time commodity prices</li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F5E9]">
                <Banknote className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">AgriLink Finance</h3>
              <p className="mt-2 text-sm text-[#64748B]">Credit, invoice financing and insurance built for farmers.</p>
              <ul className="mt-6 space-y-3 text-sm text-[#1E293B]">
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Input credit — seeds and fertilizer now, repay at harvest</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Invoice financing — 80% upfront</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Crop insurance for weather and price shocks</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Instant MoMo payouts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#1E293B]">The problem we solve</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingDown, title: "Market Access Gap", desc: "Farmers sell 30–50% below market value due to middlemen." },
              { icon: Banknote, title: "Financial Exclusion", desc: "6M+ farming households across Ghana without access to credit." },
              { icon: ShieldCheck, title: "Supply Chain Loss", desc: "$200M+ in post-harvest losses every year." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-[#E2E8F0] bg-white p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F5E9]">
                  <Icon className="h-6 w-6 text-[#2E7D32]" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-[#64748B]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: "4.5M", l: "Smallholder farmers in Ghana" },
            { v: "GHS 7.2M", l: "Year 1 GMV target" },
            { v: "68%", l: "Mobile money penetration" },
            { v: "GHS 480K", l: "Year 1 revenue target" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl md:text-5xl font-bold text-[#2E7D32]">{s.v}</div>
              <div className="mt-2 text-sm text-[#64748B]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#1E293B]">How it works</h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {[
              { title: "For Farmers", steps: ["List your produce in seconds", "Get paid securely via MoMo", "Apply for input credit instantly"] },
              { title: "For Buyers", steps: ["Browse verified farmer listings", "Pay into escrow", "Confirm delivery, funds release"] },
            ].map((g) => (
              <div key={g.title} className="rounded-xl border border-[#E2E8F0] bg-white p-8">
                <h3 className="font-display text-xl font-semibold text-[#2E7D32]">{g.title}</h3>
                <ol className="mt-6 space-y-4">
                  {g.steps.map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-xs font-semibold text-white">{i + 1}</span>
                      <span className="text-sm text-[#1E293B] pt-0.5">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USSD */}
      <section className="bg-[#0F172A] text-white py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">No smartphone? No problem.</h2>
          <p className="mt-4 text-white/70">
            AgriLink works on any phone. Dial <span className="text-[#F9A825] font-semibold">*789#</span> to access prices, list produce, and apply for credit — no internet needed.
          </p>
          <Link to="/ussd" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium hover:bg-[#256528]">
            <Phone className="h-4 w-4" /> Try the USSD simulator
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-[#64748B]">Connecting farmers. Financing growth.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-[#1E293B]">Contact</h4>
            <p className="mt-2 text-sm text-[#64748B]">agrilink@gmail.com</p>
            <p className="text-sm text-[#64748B]">+233 XX XXX XXXX</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-[#1E293B]">Try it now</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link to="/farmer/dashboard" className="inline-flex items-center gap-1.5 rounded-lg bg-[#2E7D32] px-4 py-2 text-xs font-medium text-white">
                Preview as Farmer <ArrowRight className="h-3 w-3" />
              </Link>
              <Link to="/buyer/dashboard" className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#2E7D32] bg-transparent px-4 py-2 text-xs font-medium text-[#2E7D32]">
                Preview as Buyer <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Link to="/ussd" className="mt-3 inline-block text-xs text-[#2E7D32] hover:underline">USSD simulator →</Link>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 mt-8 pt-6 border-t border-[#E2E8F0] text-xs text-[#64748B] text-center">
          © 2026 AgriLink Solutions · Built for Ghana 🇬🇭
        </div>
      </footer>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const _leaf = Leaf;
