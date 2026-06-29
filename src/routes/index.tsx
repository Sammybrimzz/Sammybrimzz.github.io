import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samarth Naik — AI-Assisted Builder" },
      { name: "description", content: "A cinematic portfolio by Samarth Naik. AI-assisted builder, web creator, and digital problem solver." },
      { property: "og:title", content: "Samarth Naik — AI-Assisted Builder" },
      { property: "og:description", content: "A cinematic portfolio of work, ideas, and AI-assisted craft." },
    ],
  }),
  component: Portfolio,
});

/* ------------ small primitives ------------ */

function Reveal({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SplitText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Magnetic({ children, strength = 18 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
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

function SectionLabel({ no, jp, en }: { no: string; jp: string; en: string }) {
  return (
    <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-ink-soft font-mono">
      <span>{no}</span>
      <span className="h-px w-12 bg-rule" />
      <span className="font-jp not-italic text-base tracking-normal text-ink">{jp}</span>
      <span>{en}</span>
    </div>
  );
}

/* ------------ cursor ------------ */
function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 40 });
  const sy = useSpring(y, { stiffness: 400, damping: 40 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block"
    >
      <div className="-translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-crimson" />
    </motion.div>
  );
}

/* ------------ floating glyphs ------------ */
const GLYPHS = ["静", "雨", "夢", "光", "間", "墨", "風", "間"];
function FloatingGlyphs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {GLYPHS.map((g, i) => (
        <motion.span
          key={i}
          className="absolute font-jp text-ink/5 select-none"
          style={{
            left: `${(i * 37) % 90 + 5}%`,
            top: `${(i * 53) % 80 + 10}%`,
            fontSize: `${60 + (i % 4) * 40}px`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          {g}
        </motion.span>
      ))}
    </div>
  );
}

/* ------------ sections ------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 pt-8 pb-12 overflow-hidden">
      <FloatingGlyphs />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="relative z-10 flex items-center justify-between text-xs uppercase tracking-[0.25em] font-mono text-ink-soft"
      >
        <span>S.N — 2026</span>
        <span className="hidden md:inline">Belgaum · 15.85°N 74.5°E</span>
        <span>映画 / Reel №01</span>
      </motion.div>

      {/* Center stage */}
      <motion.div style={{ y, opacity }} className="relative z-10 mt-12 md:mt-0">
        <div className="font-jp text-crimson text-sm md:text-base mb-6 tracking-[0.3em]">
          <SplitText text="作品集 — A QUIET REEL" />
        </div>

        <h1 className="font-display font-medium leading-[0.95] text-[18vw] md:text-[10vw] tracking-tight">
          <div className="overflow-hidden"><SplitText text="Samarth" /></div>
          <div className="overflow-hidden italic text-ink-soft"><SplitText text="Naik." /></div>
        </h1>

        <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5 space-y-1 font-display text-2xl md:text-3xl">
            <Reveal delay={0.6}><div>AI-Assisted Builder</div></Reveal>
            <Reveal delay={0.7}><div className="text-ink-soft">Web Creator</div></Reveal>
            <Reveal delay={0.8}><div className="text-ink-soft">Digital Problem Solver</div></Reveal>
          </div>
          <div className="md:col-span-5 md:col-start-8 text-sm md:text-base leading-relaxed text-ink-soft max-w-sm">
            <Reveal delay={0.9}>
              I love turning ideas into working products with the help of AI. Every project is another step in learning, improving, and creating something meaningful.
            </Reveal>
          </div>
        </div>
      </motion.div>

      {/* Bottom */}
      <div className="relative z-10 flex items-end justify-between text-xs font-mono uppercase tracking-[0.25em] text-ink-soft">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓ Scroll · 巻
        </motion.div>
        <span className="hidden md:inline">Quiet rain — soft neon</span>
        <span>※ 01 / 06</span>
      </div>

      {/* Vertical decorative */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 writing-vertical font-jp text-xs text-ink/40 tracking-[0.3em] hidden md:block">
        東京の夜 · 静かな雨
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative px-6 md:px-12 py-32 md:py-48">
      <div className="hairline mb-16" />
      <Reveal><SectionLabel no="01" jp="自己紹介" en="About" /></Reveal>

      <div className="mt-16 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl md:text-7xl leading-[1.05]">
              I learn by <span className="italic text-crimson">building</span>.
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7 space-y-8 text-ink-soft leading-relaxed">
          <Reveal delay={0.2}>
            <p className="text-lg text-ink">
              I don't consider myself an expert developer. I'm someone who enjoys bringing ideas to life with AI-assisted development — experimenting with new tools, shipping real projects, and improving through practice.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p>Curiosity is my biggest strength. Everything else is just iteration.</p>
          </Reveal>

          <Reveal delay={0.4}>
            <dl className="grid grid-cols-2 gap-y-6 gap-x-8 pt-8 border-t border-rule text-sm font-mono uppercase tracking-wider">
              <div><dt className="text-ink-soft text-xs">Name</dt><dd className="mt-1 text-ink">Samarth Naik</dd></div>
              <div><dt className="text-ink-soft text-xs">Based</dt><dd className="mt-1 text-ink">Belgaum, KA</dd></div>
              <div><dt className="text-ink-soft text-xs">Education</dt><dd className="mt-1 text-ink">12th Grade · 2024</dd></div>
              <div><dt className="text-ink-soft text-xs">Status</dt><dd className="mt-1 text-crimson">Open to work</dd></div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const SKILLS = [
  { jp: "壱", en: "HTML" }, { jp: "弐", en: "CSS" }, { jp: "参", en: "JavaScript" },
  { jp: "四", en: "React" }, { jp: "五", en: "Next.js" }, { jp: "六", en: "Tailwind" },
  { jp: "七", en: "Git" }, { jp: "八", en: "GitHub" }, { jp: "九", en: "Lovable" },
  { jp: "拾", en: "ChatGPT" }, { jp: "拾壱", en: "Cursor AI" }, { jp: "拾弐", en: "Web Dev" },
  { jp: "拾参", en: "Digital Marketing" }, { jp: "拾四", en: "Prompt Eng." },
];

function Skills() {
  return (
    <section id="skills" className="relative px-6 md:px-12 py-32 md:py-48 bg-beige/40">
      <Reveal><SectionLabel no="02" jp="技術" en="Craft" /></Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display text-5xl md:text-7xl mt-12 mb-16 max-w-3xl leading-[1.05]">
          A small, sharpened <span className="italic">toolkit.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-rule">
        {SKILLS.map((s, i) => (
          <motion.div
            key={s.en}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: (i % 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="group relative bg-paper p-6 md:p-8 aspect-[3/4] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="font-jp text-2xl text-crimson">{s.jp}</span>
              <span className="font-mono text-[10px] text-ink-soft">№{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div>
              <div className="font-display text-xl md:text-2xl leading-tight">{s.en}</div>
              <div className="mt-2 h-px w-6 bg-ink group-hover:w-full transition-all duration-700" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    no: "01",
    title: "Fort Cafe Cibus",
    jp: "珈琲店",
    tag: "Client · Live",
    desc: "A modern website for a local café to establish a stronger online presence. My first real client project — a study in restraint, warmth, and brand voice.",
    href: "https://fortcafecibus.lovable.app/",
    year: "2025",
  },
  {
    no: "02",
    title: "Guitar Learning App",
    jp: "弦の譜",
    tag: "In Progress",
    desc: "A long-term AI-assisted project making guitar learning interactive through visual lessons, note recognition, and gentle practice loops.",
    href: "#",
    year: "2026 —",
  },
];

function Projects() {
  return (
    <section id="work" className="relative px-6 md:px-12 py-32 md:py-48">
      <Reveal><SectionLabel no="03" jp="作品" en="Selected Work" /></Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display text-5xl md:text-7xl mt-12 mb-20 max-w-4xl leading-[1.05]">
          Small films. <span className="italic text-ink-soft">Real things shipped.</span>
        </h2>
      </Reveal>

      <div className="space-y-24 md:space-y-40">
        {PROJECTS.map((p, i) => (
          <div key={p.no} className="grid md:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                {/* Editorial poster */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo via-ink to-crimson/70" />
                <motion.div
                  className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 text-paper"
                  initial={{ y: 20 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                >
                  <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
                    <span>Reel {p.no} / {String(PROJECTS.length).padStart(2, "0")}</span>
                    <span>{p.year}</span>
                  </div>
                  <div>
                    <div className="font-jp text-6xl md:text-8xl text-crimson mb-4">{p.jp}</div>
                    <div className="font-display text-3xl md:text-5xl leading-none">{p.title}</div>
                  </div>
                </motion.div>
                {/* film perforations */}
                <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-around py-2">
                  {Array.from({ length: 14 }).map((_, k) => (
                    <span key={k} className="w-1.5 h-1.5 mx-auto rounded-sm bg-paper/30" />
                  ))}
                </div>
              </div>
            </motion.div>

            <div className={`md:col-span-4 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
              <Reveal>
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-crimson mb-4">{p.tag}</div>
                <h3 className="font-display text-3xl md:text-4xl mb-4">{p.title}</h3>
                <p className="text-ink-soft leading-relaxed mb-8">{p.desc}</p>
                {p.href !== "#" ? (
                  <Magnetic>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] border-b border-ink pb-1"
                    >
                      Visit Site
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </Magnetic>
                ) : (
                  <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
                    <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
                    Currently Building
                  </span>
                )}
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={ref} id="why" className="relative px-6 md:px-12 py-40 md:py-56 bg-ink text-paper overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute -right-20 top-1/2 -translate-y-1/2 font-jp text-[40vw] md:text-[28vw] leading-none text-paper/[0.04] select-none"
      >
        進
      </motion.div>

      <div className="relative z-10">
        <Reveal>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] font-mono text-paper/60">
            <span>04</span><span className="h-px w-12 bg-paper/30" />
            <span className="font-jp not-italic text-base text-paper">理由</span>
            <span>Why I Build</span>
          </div>
        </Reveal>

        <div className="mt-16 max-w-4xl">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.15]">
            <SplitText text="I'm not chasing perfection." />
            <br />
            <span className="italic text-crimson"><SplitText text="I'm chasing progress." /></span>
          </h2>
          <Reveal delay={0.4}>
            <p className="mt-12 text-lg md:text-xl text-paper/70 max-w-2xl leading-relaxed">
              AI lets me move faster, but curiosity is what keeps me building. Every project is another opportunity to learn something new.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const HOBBIES = [
  { jp: "弦", en: "Guitar", icon: "♪" },
  { jp: "声", en: "Singing", icon: "♫" },
  { jp: "符", en: "Vibecoding", icon: "{ }" },
  { jp: "学", en: "Learning", icon: "✦" },
  { jp: "茶", en: "Side Projects", icon: "◐" },
];

function Hobbies() {
  return (
    <section className="px-6 md:px-12 py-32 md:py-48">
      <Reveal><SectionLabel no="05" jp="趣味" en="Off-screen" /></Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display text-5xl md:text-7xl mt-12 mb-16 max-w-3xl leading-[1.05]">
          When the editor closes.
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {HOBBIES.map((h, i) => (
          <motion.div
            key={h.en}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-square border border-rule p-5 flex flex-col justify-between hover:bg-beige/40 transition-colors duration-700"
          >
            <div className="font-jp text-4xl md:text-5xl text-crimson">{h.jp}</div>
            <div>
              <div className="font-mono text-xs text-ink-soft">{h.icon}</div>
              <div className="font-display text-lg md:text-xl mt-1">{h.en}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative px-6 md:px-12 py-32 md:py-48 border-t border-rule">
      <Reveal><SectionLabel no="06" jp="連絡" en="Get in touch" /></Reveal>

      <div className="mt-16 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl md:text-8xl leading-[0.95]">
              Let's make<br />
              <span className="italic text-crimson">something quiet</span><br />
              that lasts.
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <Magnetic strength={28}>
              <a
                href="mailto:naiksam027@gmail.com"
                className="group mt-12 inline-flex items-center gap-4 font-display text-2xl md:text-3xl border-b-2 border-ink pb-2"
              >
                naiksam027@gmail.com
                <span className="text-crimson transition-transform group-hover:translate-x-2">↗</span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <div className="md:col-span-4 md:col-start-9 space-y-8">
          <Reveal delay={0.2}>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft mb-2">Phone</div>
              <a href="tel:+919071874027" className="font-display text-xl hover:text-crimson transition-colors">+91 90718 74027</a>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft mb-2">Elsewhere</div>
              <ul className="space-y-2 font-display text-xl">
                <li><a href="#" className="hover:text-crimson transition-colors inline-flex items-center gap-2">GitHub <span className="text-xs text-ink-soft">— soon</span></a></li>
                <li><a href="#" className="hover:text-crimson transition-colors inline-flex items-center gap-2">LinkedIn <span className="text-xs text-ink-soft">— soon</span></a></li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft mb-2">Based</div>
              <div className="font-display text-xl">Belgaum, Karnataka</div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-32 flex items-end justify-between font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
        <span>© Samarth Naik · MMXXVI</span>
        <span className="font-jp not-italic">完 — fin</span>
        <span className="hidden md:inline">Crafted slowly, with AI.</span>
      </div>
    </section>
  );
}

/* ------------ loader ------------ */
function Loader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= 100) { clearInterval(id); setTimeout(onDone, 400); return 100; }
        return c + 4;
      });
    }, 40);
    return () => clearInterval(id);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-paper flex items-end justify-between px-6 md:px-12 py-8"
    >
      <div className="font-jp text-crimson text-2xl">読込中</div>
      <div className="font-mono text-sm tabular-nums">{String(count).padStart(3, "0")} / 100</div>
    </motion.div>
  );
}

/* ------------ shell ------------ */
function Portfolio() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="grain relative bg-paper text-ink">
      {loading && <Loader onDone={() => setLoading(false)} />}
      <Cursor />

      {/* progress */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-px bg-crimson origin-left z-[150]" />

      {/* nav */}
      <nav className="fixed top-0 right-0 z-[120] hidden md:flex flex-col gap-3 p-8 font-mono text-[10px] uppercase tracking-[0.25em]">
        {[
          ["about", "01"], ["skills", "02"], ["work", "03"], ["why", "04"], ["contact", "06"],
        ].map(([id, n]) => (
          <a key={id} href={`#${id}`} className="group flex items-center gap-2 text-ink-soft hover:text-ink">
            <span className="h-px w-4 bg-rule group-hover:w-8 group-hover:bg-crimson transition-all duration-500" />
            <span>{n}</span>
          </a>
        ))}
      </nav>

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Philosophy />
        <Hobbies />
        <Contact />
      </main>
    </div>
  );
}
