import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samarth Naik — AI-Assisted Builder" },
      { name: "description", content: "Portfolio of Samarth Naik — AI-assisted builder, web creator, digital problem solver." },
      { property: "og:title", content: "Samarth Naik — Portfolio" },
      { property: "og:description", content: "Quiet, motion-first portfolio of an AI-assisted builder." },
    ],
  }),
  component: Page,
});

/* ─────────────────────────  primitives  ───────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, y = 28 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function MaskText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.1em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: delay + i * 0.05, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Magnetic({ children, strength = 22 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * strength);
        y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────  cursor  ───────────────────────── */

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const rx = useSpring(x, { stiffness: 90, damping: 18 });
  const ry = useSpring(y, { stiffness: 90, damping: 18 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-cursor]"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);
  return (
    <>
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block"
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-paper" />
      </motion.div>
      <motion.div
        style={{ x: rx, y: ry }}
        animate={{ scale: hover ? 2.2 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="pointer-events-none fixed left-0 top-0 z-[199] hidden md:block"
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-paper/40" />
      </motion.div>
    </>
  );
}

/* ─────────────────────────  loader  ───────────────────────── */

function Loader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / 1600);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 300);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.1, ease: EASE }}
      className="fixed inset-0 z-[300] bg-paper text-ink flex flex-col justify-between px-6 md:px-12 py-8"
    >
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.3em] text-ink-soft">
        <span>S.N — 2026</span>
        <span>Reel №01</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="font-display text-[18vw] md:text-[10vw] leading-none tabular-nums">
          {String(count).padStart(3, "0")}
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-soft pb-4 hidden md:block">
          Loading quiet reel
        </div>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: count / 100 }}
        transition={{ ease: "linear" }}
        className="h-px bg-ink origin-left"
      />
    </motion.div>
  );
}

/* ─────────────────────────  chrome  ───────────────────────── */

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ["index", "00"], ["work", "01"], ["about", "02"], ["contact", "03"],
  ];
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[120] text-ink">
        <div className="flex items-center justify-between px-6 md:px-10 py-6 font-mono text-xs uppercase tracking-[0.25em] backdrop-blur-sm">
          <a href="#top" className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
            <span>Samarth Naik</span>
          </a>
          <nav className="hidden md:flex gap-8">
            {links.slice(1).map(([id, n]) => (
              <a key={id} href={`#${id}`} className="group inline-flex items-center gap-2">
                <span className="text-ink-soft">{n}</span>
                <span className="relative">
                  {id}
                  <span className="absolute left-0 -bottom-1 h-px w-0 bg-ink group-hover:w-full transition-all duration-500" />
                </span>
              </a>
            ))}
          </nav>
          <button
            onClick={() => setOpen(true)}
            className="md:hidden flex flex-col gap-1.5"
            aria-label="menu"
            data-cursor
          >
            <span className="block w-6 h-px bg-ink" />
            <span className="block w-6 h-px bg-ink" />
          </button>
          <span className="hidden md:inline text-ink-soft">Available · MMXXVI</span>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[140] bg-paper text-ink flex flex-col p-6"
          >
            <div className="flex justify-between font-mono text-xs uppercase tracking-[0.25em]">
              <span>menu</span>
              <button onClick={() => setOpen(false)} data-cursor>close ×</button>
            </div>
            <ul className="flex-1 flex flex-col justify-center gap-4 font-display text-5xl">
              {links.map(([id, n], i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: EASE }}
                >
                  <a href={`#${id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-ink-soft">{n}</span>
                    <span className="italic">{id}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div style={{ scaleX: sx }} className="fixed top-0 left-0 right-0 h-px bg-paper origin-left z-[150]" />;
}

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata", hour12: false,
      }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{t} IST</span>;
}

/* ─────────────────────────  hero  ───────────────────────── */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(6px)"]);

  // mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 30);
      my.set((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [mx, my]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen overflow-hidden">
      {/* glow */}
      <motion.div
        style={{ x: smx, y: smy }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] md:w-[70vw] aspect-square rounded-full pointer-events-none"
      >
        <div className="absolute inset-0 rounded-full bg-crimson/15 blur-[120px]" />
        <div className="absolute inset-1/4 rounded-full bg-indigo/20 blur-[100px]" />
      </motion.div>

      {/* fine grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--ink) 1px, transparent 1px), linear-gradient(to bottom, var(--ink) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <motion.div style={{ y, opacity, filter: blur }} className="relative h-screen flex flex-col justify-between px-6 md:px-10 pt-28 pb-10">
        {/* meta row */}
        <div className="flex items-start justify-between font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-ink-soft">
          <div className="space-y-1">
            <div>Portfolio / 2026</div>
            <div className="text-ink/60">Belgaum · 15.85°N</div>
          </div>
          <div className="space-y-1 text-right">
            <Clock />
            <div className="text-ink/60">Quiet rain</div>
          </div>
        </div>

        {/* title block */}
        <div className="relative">
          <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-crimson mb-6">
            <MaskText text="— AI-assisted builder, est. 2024" />
          </div>
          <h1 className="font-display font-light leading-[0.88] tracking-[-0.03em] text-[22vw] md:text-[15vw]">
            <div className="overflow-hidden"><MaskText text="Samarth" delay={0.1} /></div>
            <div className="overflow-hidden italic text-ink-soft pl-[12vw] md:pl-[18vw]">
              <MaskText text="Naik" delay={0.2} />
            </div>
          </h1>
        </div>

        {/* bottom row */}
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-12 md:col-span-5 text-sm md:text-base leading-relaxed text-ink max-w-md">
            <Reveal delay={0.7}>
              I build apps, websites, and working robots — with AI as my co-pilot. Curious by default, quiet by design.
            </Reveal>
          </div>
          <div className="col-span-6 md:col-span-4 md:col-start-6 hidden md:block">
            <Reveal delay={0.8}>
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-ink-soft">
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >↓</motion.span>
                Scroll to begin
              </div>
            </Reveal>
          </div>
          <div className="col-span-6 md:col-span-3 md:col-start-10 text-right">
            <Reveal delay={0.9}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-1">Index</div>
              <div className="font-display text-2xl tabular-nums">01 / 04</div>
            </Reveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────  marquee  ───────────────────────── */

function Marquee() {
  const items = ["Web", "·", "Motion", "·", "AI-Assisted", "·", "Curiosity", "·", "Editorial", "·", "Quiet", "·"];
  return (
    <section className="border-y border-rule py-8 md:py-10 overflow-hidden">
      <div className="flex gap-12 whitespace-nowrap">
        <motion.div
          className="flex gap-12 shrink-0 font-display text-4xl md:text-6xl italic"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...items, ...items, ...items, ...items].map((w, i) => (
            <span key={i} className={i % 2 === 0 ? "text-ink" : "text-crimson"}>{w}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────  about  ───────────────────────── */

function About() {
  return (
    <section id="about" className="relative px-6 md:px-10 py-32 md:py-56">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          <Reveal>02 / About</Reveal>
        </div>
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight max-w-4xl">
            <MaskText text="I don't consider myself an expert. I'm someone who enjoys" />
            <span className="text-ink-soft">
              <MaskText delay={0.2} text="bringing ideas to life with AI — experimenting, shipping, improving." />
            </span>
            <span className="text-crimson italic">
              <MaskText delay={0.4} text="Curiosity is the engine." />
            </span>
          </h2>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 font-mono text-xs uppercase tracking-[0.25em]">
            {[
              ["Name", "Samarth Naik"],
              ["Based", "Belgaum, KA"],
              ["Education", "12th · 2024"],
              ["Status", "Open to work"],
            ].map(([k, v], i) => (
              <Reveal key={k} delay={i * 0.08}>
                <div className="border-t border-rule pt-3">
                  <div className="text-ink-soft text-[10px] mb-1">{k}</div>
                  <div className={`text-sm normal-case tracking-normal font-display ${k === "Status" ? "text-crimson" : "text-ink"}`}>{v}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  work  ───────────────────────── */

type Project = {
  no: string;
  title: string;
  meta: string;
  year: string;
  desc: string;
  href: string;
  status: "live" | "wip";
};

const PROJECTS: Project[] = [
  {
    no: "01",
    title: "Fort Cafe Cibus",
    meta: "Client · Restaurant",
    year: "2025",
    desc: "A modern website for a local café to establish a stronger online presence. First real client project.",
    href: "https://fortcafecibus.lovable.app/",
    status: "live",
  },
  {
    no: "02",
    title: "Guitar Learning App",
    meta: "Long-term · Personal",
    year: "2026",
    desc: "AI-assisted project making guitar learning interactive — visual lessons, note recognition, gentle practice loops.",
    href: "#",
    status: "wip",
  },
];

function WorkRow({ p, idx }: { p: Project; idx: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });

  return (
    <motion.a
      ref={ref}
      href={p.href}
      target={p.href === "#" ? undefined : "_blank"}
      rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); x.set(0); y.set(0); }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top - 100);
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: idx * 0.1, ease: EASE }}
      className="group relative block border-t border-rule py-8 md:py-12"
      data-cursor
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-2 md:col-span-1 font-mono text-xs text-ink-soft">{p.no}</div>
        <div className="col-span-10 md:col-span-5">
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ y: hover ? "-100%" : "0%" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-display text-3xl md:text-6xl lg:text-7xl tracking-tight"
            >
              {p.title}
            </motion.div>
            <motion.div
              animate={{ y: hover ? "-100%" : "0%" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-display italic text-3xl md:text-6xl lg:text-7xl tracking-tight text-crimson absolute left-0 top-full"
            >
              {p.title}
            </motion.div>
          </div>
        </div>
        <div className="col-span-7 md:col-span-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-ink-soft">
          {p.meta}
        </div>
        <div className="col-span-3 md:col-span-2 font-mono text-xs text-ink-soft text-right">
          {p.year}
        </div>
        <div className="col-span-2 md:col-span-1 flex justify-end">
          {p.status === "wip" ? (
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" /> WIP
            </span>
          ) : (
            <span className="font-mono text-xs">↗</span>
          )}
        </div>
      </div>

      {/* hover preview */}
      <AnimatePresence>
        {hover && p.status === "live" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-40 hidden md:block"
          >
            <div className="w-72 aspect-[4/3] overflow-hidden border border-rule">
              <div className="w-full h-full bg-gradient-to-br from-crimson/80 via-paper to-indigo/70 flex items-end p-5">
                <div className="font-display text-ink text-xl leading-tight">
                  {p.title}
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] mt-1 text-ink-soft">visit live →</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Reveal delay={idx * 0.1 + 0.2}>
        <p className="mt-6 max-w-xl md:ml-[8.33%] text-sm md:text-base text-ink-soft leading-relaxed">
          {p.desc}
        </p>
      </Reveal>
    </motion.a>
  );
}

function Work() {
  return (
    <section id="work" className="relative px-6 md:px-10 py-32 md:py-56">
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <Reveal>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">01 / Selected Work</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight">
              Small films. <span className="italic text-ink-soft">Real things shipped.</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div className="hidden md:block font-mono text-xs text-ink-soft">({String(PROJECTS.length).padStart(2, "0")})</div>
        </Reveal>
      </div>

      <div className="border-b border-rule">
        {PROJECTS.map((p, i) => <WorkRow key={p.no} p={p} idx={i} />)}
      </div>
    </section>
  );
}

/* ─────────────────────────  craft / skills  ───────────────────────── */

const SKILLS = [
  "HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS",
  "Git", "GitHub", "Lovable", "ChatGPT", "Cursor AI",
  "Web Development", "Digital Marketing", "Prompt Engineering",
];

function Craft() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const x2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  return (
    <section ref={ref} className="relative py-24 md:py-32 border-y border-rule overflow-hidden">
      <div className="px-6 md:px-10 mb-12 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        <Reveal>Toolkit / Quiet edges</Reveal>
      </div>
      <motion.div style={{ x: x1 }} className="flex gap-3 whitespace-nowrap mb-3">
        {SKILLS.concat(SKILLS).map((s, i) => (
          <span key={`a${i}`} className="font-display text-3xl md:text-5xl italic px-4 text-ink-soft hover:text-ink transition-colors duration-500">
            {s}<span className="text-crimson not-italic"> ·</span>
          </span>
        ))}
      </motion.div>
      <motion.div style={{ x: x2 }} className="flex gap-3 whitespace-nowrap">
        {SKILLS.slice().reverse().concat(SKILLS).map((s, i) => (
          <span key={`b${i}`} className="font-display text-3xl md:text-5xl px-4 text-ink hover:text-crimson transition-colors duration-500">
            {s}<span className="text-ink-soft"> /</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ─────────────────────────  philosophy  ───────────────────────── */

function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const words = [
    "I'm", "not", "chasing", "perfection.",
    "I'm", "chasing", "progress.",
    "AI", "lets", "me", "move", "faster,",
    "but", "curiosity", "is", "what",
    "keeps", "me", "building.",
  ];
  return (
    <section ref={ref} className="relative px-6 md:px-10 py-40 md:py-64">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-12">
        <Reveal>— A note to self</Reveal>
      </div>
      <p className="font-display text-3xl md:text-6xl lg:text-7xl leading-[1.15] tracking-tight max-w-5xl">
        {words.map((w, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          const Word = () => {
            const o = useTransform(scrollYProgress, [start * 0.7 + 0.1, end * 0.7 + 0.1], [0.18, 1]);
            const isAccent = ["progress.", "curiosity"].includes(w);
            return (
              <motion.span style={{ opacity: o }} className={`inline-block mr-[0.25em] ${isAccent ? "italic text-crimson" : ""}`}>
                {w}
              </motion.span>
            );
          };
          return <Word key={i} />;
        })}
      </p>
    </section>
  );
}

/* ─────────────────────────  hobbies  ───────────────────────── */

const HOBBIES = [
  ["Guitar", "♪"], ["Singing", "♫"], ["Vibecoding", "{ }"],
  ["Learning", "✦"], ["Side Projects", "◐"],
];

function Hobbies() {
  return (
    <section className="px-6 md:px-10 py-32 md:py-48 border-t border-rule">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          <Reveal>— Off screen</Reveal>
        </div>
        <ul className="col-span-12 md:col-span-9">
          {HOBBIES.map(([name, icon], i) => (
            <motion.li
              key={name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
              whileHover={{ x: 12 }}
              className="group flex items-baseline justify-between border-b border-rule py-6 md:py-8 cursor-default"
              data-cursor
            >
              <span className="flex items-baseline gap-6">
                <span className="font-mono text-xs text-ink-soft w-6">0{i + 1}</span>
                <span className="font-display text-3xl md:text-5xl tracking-tight group-hover:italic group-hover:text-crimson transition-all duration-500">{name}</span>
              </span>
              <span className="font-mono text-sm text-ink-soft">{icon}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────  contact  ───────────────────────── */

function Contact() {
  return (
    <section id="contact" className="relative px-6 md:px-10 py-32 md:py-48">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-16">
        <Reveal>03 / Contact</Reveal>
      </div>

      <Reveal>
        <h2 className="font-display text-5xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tight">
          Let's make<br />
          <span className="italic text-ink-soft">something</span><br />
          <span className="text-crimson">quiet.</span>
        </h2>
      </Reveal>

      <div className="mt-20 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <Reveal>
            <Magnetic strength={30}>
              <a
                href="mailto:naiksam027@gmail.com"
                className="group inline-flex items-center gap-4 font-display text-2xl md:text-4xl border-b border-ink pb-2"
                data-cursor
              >
                naiksam027@gmail.com
                <span className="text-crimson transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-1">↗</span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-8 grid grid-cols-2 gap-y-10 gap-x-6">
          {[
            ["Phone", "+91 90718 74027", "tel:+919071874027"],
            ["GitHub", "soon", "#"],
            ["LinkedIn", "soon", "#"],
            ["Location", "Belgaum, KA", null],
          ].map(([k, v, href], i) => (
            <Reveal key={k} delay={i * 0.05}>
              <div className="border-t border-rule pt-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-2">{k}</div>
                {href ? (
                  <a href={href} className="font-display text-lg md:text-xl hover:text-crimson transition-colors" data-cursor>{v}</a>
                ) : (
                  <div className="font-display text-lg md:text-xl">{v}</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-32 flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-end justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        <span>© Samarth Naik · MMXXVI</span>
        <span>Crafted slowly, with AI.</span>
        <Clock />
      </div>
    </section>
  );
}

/* ─────────────────────────  shell  ───────────────────────── */

function Page() {
  const [loading, setLoading] = useState(true);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (!loading) setShowCursor(true);
  }, [loading]);

  // optional: lock scroll while loading
  useEffect(() => {
    document.documentElement.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  // intersection-driven section indicator
  const [sec, setSec] = useState("00");
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.18) setSec("00");
    else if (v < 0.45) setSec("01");
    else if (v < 0.75) setSec("02");
    else setSec("03");
  });

  return (
    <div className="relative bg-paper text-ink min-h-screen">
      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>
      {showCursor && <Cursor />}
      <ScrollBar />
      <Nav />

      {/* section badge */}
      <div className="fixed bottom-6 left-6 z-[110] font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft hidden md:flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
        <span>section · {sec}</span>
      </div>

      <main>
        <Hero />
        <Marquee />
        <Work />
        <Craft />
        <About />
        <Philosophy />
        <Hobbies />
        <Contact />
      </main>
    </div>
  );
}
