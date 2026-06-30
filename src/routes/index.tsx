import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Store, ShieldCheck, Banknote, TrendingDown, Smartphone, Share2 } from "lucide-react";
import heroImg from "@/assets/hero-farmer-ghana.jpg";
import { usePWA } from "@/hooks/use-pwa";

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

function InstallSection() {
  const { installPrompt, promptInstall, isInstalled, isIOS, isAndroid } = usePWA();

  if (isInstalled) {
    return (
      <div className="bg-[#E8F5E9] py-4 text-center text-sm text-[#1B5E20] font-medium">
        ✅ AgriLink is installed on your device
      </div>
    );
  }

  return (
    <section className="bg-[#0F172A] py-12 sm:py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32] mb-5">
          <Smartphone className="h-7 w-7 text-white" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold">Get the app — free, always</h2>
        <p className="mt-3 text-white/70 max-w-md mx-auto text-sm sm:text-base">
          Install AgriLink directly from your browser. No App Store, no Play Store, no fee.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Android / Desktop Chrome */}
          {(installPrompt || isAndroid) && (
            <button
              onClick={installPrompt ? promptInstall : undefined}
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#2E7D32] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#256528] min-w-[200px] justify-center"
            >
              <Smartphone className="h-5 w-5" />
              Install on Android
            </button>
          )}

          {/* iOS */}
          {isIOS && (
            <div className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-left max-w-xs">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#F9A825]">
                <Share2 className="h-4 w-4" /> iPhone / iPad
              </div>
              <ol className="space-y-1.5 text-xs text-white/80">
                <li>1. Open this page in <strong className="text-white">Safari</strong></li>
                <li>2. Tap the <strong className="text-white">Share</strong> button (bottom toolbar)</li>
                <li>3. Tap <strong className="text-white">"Add to Home Screen"</strong></li>
              </ol>
            </div>
          )}

          {/* Generic — no install prompt available yet (desktop non-Chrome) */}
          {!installPrompt && !isIOS && !isAndroid && (
            <div className="text-sm text-white/60">
              Open this site in <strong className="text-white">Chrome on Android</strong> or <strong className="text-white">Safari on iPhone</strong> to install as an app.
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-white/40">
          PWA — works offline · No storage required · Instant updates
        </p>
      </div>
    </section>
  );
}

function Landing() {
  const { installPrompt, promptInstall, isInstalled } = usePWA();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white">
        <img
          src={heroImg}
          alt="Ghanaian farmer in a maize field at golden hour"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/70 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-6">
          <nav className="flex items-center justify-between">
            <Logo light />
            <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
              <a href="#how" className="hover:text-white">How it works</a>
              <a href="#tools" className="hover:text-white">For Farmers</a>
              <a href="#tools" className="hover:text-white">For Buyers</a>
              <Link to="/signin" className="hover:text-white">Sign In</Link>
              {installPrompt && !isInstalled && (
                <button onClick={promptInstall} className="rounded-lg bg-[#2E7D32] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#256528]">
                  Install App
                </button>
              )}
            </div>
            <Link to="/signin" className="md:hidden text-sm text-white/80 hover:text-white">Sign In</Link>
          </nav>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
              Connecting Farmers.<br />Financing Growth.
            </h1>
            <p className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg text-white/80">
              Ghana's first Agri-Fintech marketplace — fair prices, secure payments, instant financing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link to="/signup" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#2E7D32] px-6 py-3 text-sm font-medium text-white hover:bg-[#256528]">
                Join as Farmer
              </Link>
              <Link to="/signup" className="inline-flex min-h-[48px] items-center justify-center rounded-lg border-2 border-white bg-transparent px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-[#0F172A]">
                Join as Buyer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TWO TOOLS */}
      <section id="tools" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#1E293B]">Two powerful tools in one platform</h2>
          <div className="mt-10 sm:mt-12 grid md:grid-cols-2 gap-5 sm:gap-6">
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F5E9]">
                <Store className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <h3 className="mt-4 font-display text-xl sm:text-2xl font-semibold">AgriLink Market</h3>
              <p className="mt-2 text-sm text-[#64748B]">Buy and sell produce directly across Ghana.</p>
              <ul className="mt-6 space-y-3 text-sm text-[#1E293B]">
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Direct farmer-to-buyer listings, no middlemen</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Escrow-protected payments</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Cold-chain ready logistics</li>
                <li className="flex gap-2"><span className="text-[#2E7D32]">✓</span> Real-time commodity prices</li>
              </ul>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F5E9]">
                <Banknote className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <h3 className="mt-4 font-display text-xl sm:text-2xl font-semibold">AgriLink Finance</h3>
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
      <section className="bg-[#F8FAFC] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#1E293B]">The problem we solve</h2>
          <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: TrendingDown, title: "Market Access Gap", desc: "Farmers sell 30–50% below market value due to middlemen." },
              { icon: Banknote, title: "Financial Exclusion", desc: "6M+ farming households across Ghana without access to credit." },
              { icon: ShieldCheck, title: "Supply Chain Loss", desc: "$200M+ in post-harvest losses every year." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-[#E2E8F0] bg-white p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F5E9]">
                  <Icon className="h-6 w-6 text-[#2E7D32]" />
                </div>
                <h3 className="mt-4 font-display text-lg sm:text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-[#64748B]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { v: "4.5M", l: "Smallholder farmers in Ghana" },
            { v: "GHS 7.2M", l: "Year 1 GMV target" },
            { v: "68%", l: "Mobile money penetration" },
            { v: "GHS 480K", l: "Year 1 revenue target" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#2E7D32]">{s.v}</div>
              <div className="mt-2 text-xs sm:text-sm text-[#64748B]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="bg-[#F8FAFC] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#1E293B]">How it works</h2>
          <div className="mt-10 sm:mt-12 grid md:grid-cols-2 gap-6 sm:gap-8">
            {[
              { title: "For Farmers", steps: ["List your produce in seconds", "Get paid securely via MoMo", "Apply for input credit instantly"] },
              { title: "For Buyers", steps: ["Browse verified farmer listings", "Pay into escrow", "Confirm delivery, funds release"] },
            ].map((g) => (
              <div key={g.title} className="rounded-xl border border-[#E2E8F0] bg-white p-6 sm:p-8">
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
          <div className="mt-10 text-center">
            <Link to="/signup" className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#2E7D32] px-6 py-3 text-sm font-medium text-white hover:bg-[#256528]">
              Get started — it's free
            </Link>
          </div>
        </div>
      </section>

      <InstallSection />

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0] py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-[#64748B]">Connecting farmers. Financing growth.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-[#1E293B]">Contact</h4>
            <p className="mt-2 text-sm text-[#64748B]">agrilink@gmail.com</p>
            <p className="text-sm text-[#64748B]">
              <a href="tel:+233532672380" className="hover:text-[#2E7D32]">+233 53 267 2380</a>
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-[#1E293B]">Get started</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link to="/signup" className="inline-flex items-center gap-1.5 rounded-lg bg-[#2E7D32] px-4 py-2 text-xs font-medium text-white">
                Create account
              </Link>
              <Link to="/signin" className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#2E7D32] bg-transparent px-4 py-2 text-xs font-medium text-[#2E7D32]">
                Sign in
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 pt-6 border-t border-[#E2E8F0] text-xs text-[#64748B] text-center">
          © 2026 AgriLink Solutions · Built for Ghana 🇬🇭
        </div>
      </footer>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const _leaf = Leaf;