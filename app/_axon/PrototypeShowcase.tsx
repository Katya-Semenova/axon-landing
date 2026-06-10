"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { InsightCard } from "./InsightCard";
import { TOKENS, COLORS } from "./rawData";
import { SHOWCASE_INSIGHTS, SHOWCASE_DATASET, SHOWCASE_SLIDE } from "./showcaseData";
import { NAVY, GOLD, BORDER, T2, T3, NAVY_300, CANVAS_BG, SURFACE, SURFACE_RAISE } from "./tokens";

/* ── Timing (seconds) — tweak to retune the loop ──
   Per-phase holds: raw is shortest (it resolves into the vortex), the
   "insight emerges → immediately connects" beat is brief. */
const CROSSFADE = 0.38; // transitions snappier still
const PHASE_HOLD = [1.0, 0.95, 1.35, 1.6]; // raw · insight · connect · slide — shorter mid-state holds
const PHASES = 4;

const MONO = "'JetBrains Mono', monospace";
const noop = () => {};
const round = (n: number) => Math.round(n * 100) / 100;

/* Window-scaled variant of the product's makeBezier — proportional control
   points (no hard floor) so short node edges stay smooth, never loop. */
function flowEdge(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.max(8, (x2 - x1) * 0.42);
  return `M ${round(x1)} ${round(y1)} C ${round(x1 + dx)} ${round(y1)} ${round(x2 - dx)} ${round(y2)} ${round(x2)} ${round(y2)}`;
}

/* ════════════════ Phase 0 — Raw data (Hero token vortex) ════════════════ */
const RAW_LAYOUT = [
  { i: 2, x: 14, y: 24, s: 12, c: 4, r: 12, d: 5.8 },
  { i: 0, x: 128, y: 18, s: 11, c: 0, r: 10, d: 6.5 },
  { i: 8, x: 18, y: 64, s: 10, c: 1, r: 9, d: 5.4 },
  { i: 4, x: 160, y: 48, s: 12, c: 5, r: 14, d: 7.0 },
  { i: 12, x: 74, y: 54, s: 9, c: 1, r: 8, d: 5.0 },
  { i: 16, x: 12, y: 108, s: 10, c: 0, r: 11, d: 6.1 },
  { i: 6, x: 142, y: 92, s: 13, c: 4, r: 13, d: 6.3 },
  { i: 10, x: 56, y: 104, s: 9, c: 1, r: 9, d: 5.7 },
  { i: 13, x: 132, y: 128, s: 10, c: 0, r: 10, d: 6.7 },
  { i: 3, x: 26, y: 150, s: 12, c: 5, r: 12, d: 5.9 },
  { i: 15, x: 86, y: 152, s: 10, c: 1, r: 9, d: 5.3 },
  { i: 9, x: 144, y: 168, s: 9, c: 0, r: 8, d: 6.4 },
  { i: 5, x: 184, y: 110, s: 13, c: 4, r: 11, d: 5.8 },
  { i: 17, x: 18, y: 184, s: 11, c: 5, r: 10, d: 6.2 },
];

function RawLayer({ phase }: { phase: number }) {
  const active = phase === 0;
  return (
    <motion.div
      initial={false}
      /* On exit the whole field spins inward + collapses to a point — a vortex. */
      animate={active ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.06, rotate: 130 }}
      transition={{ duration: active ? CROSSFADE : 0.5, ease: active ? "easeOut" : [0.42, 0, 0.7, 0.22] }}
      style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%" }}
    >
      {RAW_LAYOUT.map((d, k) => (
        <motion.span
          key={k}
          style={{ position: "absolute", left: d.x, top: d.y, fontFamily: MONO, fontSize: d.s, color: COLORS[d.c], whiteSpace: "nowrap", willChange: "transform, opacity" }}
          initial={false}
          animate={active
            ? { opacity: [0, 1, 1, 1, 1], scale: [0.4, 1, 1, 1, 1], x: [0, d.r, 0, -d.r, 0], y: [-d.r, 0, d.r, 0, -d.r] }
            : { opacity: 0 }}
          transition={active
            ? {
                opacity: { duration: 0.44, ease: "easeOut" },
                scale: { duration: 0.52, ease: "easeOut" },
                x: { duration: d.d * 0.8, repeat: Infinity, ease: "easeInOut" },
                y: { duration: d.d * 0.8, repeat: Infinity, ease: "easeInOut" },
              }
            : { opacity: { duration: 0.62 } } /* linger so tokens stay visible through the swirl */}
        >
          {TOKENS[d.i]}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ════════════════ Light dataset replica (product palette) ════════════════ */
function DatasetReplica({ width = 138 }: { width?: number }) {
  const rows = SHOWCASE_DATASET.rows.slice(0, 4);
  return (
    <div style={{ width, background: SURFACE_RAISE, border: `1px solid ${BORDER}`, fontFamily: "Inter, sans-serif", boxShadow: "0 4px 14px rgba(27,40,64,0.12)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 7px", borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
        <span style={{ fontFamily: MONO, fontSize: 7, letterSpacing: "0.1em", color: T3, textTransform: "uppercase" }}>Data set</span>
        <span style={{ fontSize: 8.5, fontWeight: 500, color: NAVY, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{SHOWCASE_DATASET.title}</span>
      </div>
      <div style={{ padding: "6px 7px", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr", gap: 4, paddingBottom: 3, borderBottom: `1px solid ${BORDER}` }}>
          {SHOWCASE_DATASET.columns.map((h, i) => (
            <span key={h} style={{ fontFamily: MONO, fontSize: 7, color: T3, textTransform: "uppercase", textAlign: i === 0 ? "left" : "right" }}>{h}</span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.metric} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 0.8fr", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 8, color: NAVY }}>{row.metric}</span>
            <span style={{ fontFamily: MONO, fontSize: 7.5, color: T2, textAlign: "right" }}>{row.q2}</span>
            <span style={{ fontFamily: MONO, fontSize: 7.5, color: NAVY, textAlign: "right" }}>{row.q3}</span>
            <span style={{ fontFamily: MONO, fontSize: 7.5, fontWeight: 600, color: row.pos ? GOLD : T3, textAlign: "right" }}>{row.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════ Phases 1–2 — Insights emerge, then nodes link to dataset ════════════════
   Positioned directly in window coordinates and visually centered. Edges are
   MEASURED from the real port circles, so every leg starts/ends on a node. */
const CARD_SCALE = 0.5;
const POS = {
  a: { left: 16, top: 20 },   // insight A (text)
  b: { left: 16, top: 114 },  // insight B (data) — ~24px clear gap below A
  ds: { left: 122, top: 84 }, // dataset (vertically between the two insights)
};

function FlowLayer({ phase }: { phase: number }) {
  const visible = phase === 1 || phase === 2;
  const connect = phase === 2;
  const wrapRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const dsRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<{ d: string }[]>([]);

  /* Measure the rendered port circles → exact bezier endpoints. */
  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wb = wrap.getBoundingClientRect();
      const portCenter = (host: HTMLElement | null, sel: string) => {
        const p = host?.querySelector(sel) as HTMLElement | null;
        if (!p) return null;
        const r = p.getBoundingClientRect();
        return { x: r.left + r.width / 2 - wb.left, y: r.top + r.height / 2 - wb.top };
      };
      const aOut = portCenter(aRef.current, '[data-port="output"]');
      const bOut = portCenter(bRef.current, '[data-port="output"]');
      const dIn = portCenter(dsRef.current, '[data-port="input"]');
      if (aOut && bOut && dIn) {
        setEdges([{ d: flowEdge(aOut.x, aOut.y, dIn.x, dIn.y) }, { d: flowEdge(bOut.x, bOut.y, dIn.x, dIn.y) }]);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [phase]);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      /* delay the reveal so the raw vortex finishes collapsing on a clean bg first */
      transition={{ duration: CROSSFADE, ease: "easeInOut", delay: visible ? 0.48 : 0 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
        {/* node edges */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
          {edges.map((e, i) => (
            <motion.path
              key={i}
              d={e.d}
              fill="none" stroke={GOLD} strokeWidth={1.4} strokeLinecap="round"
              initial={false}
              animate={connect ? { pathLength: 1, opacity: 0.75 } : { pathLength: 0, opacity: 0 }}
              transition={{ pathLength: { duration: 0.35, ease: "easeInOut", delay: connect ? 0.12 + i * 0.1 : 0 }, opacity: { duration: 0.14, delay: connect ? 0.12 + i * 0.1 : 0 } }}
            />
          ))}
        </svg>

        {/* insight nodes — emerge in place, persist into the connect phase */}
        <div style={{ position: "absolute", left: POS.a.left, top: POS.a.top, width: 150, transform: `scale(${CARD_SCALE})`, transformOrigin: "top left" }}>
          <motion.div ref={aRef} initial={false} animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.32, ease: "easeOut", delay: visible && phase === 1 ? 0.5 : 0 }}>
            <InsightCard insight={SHOWCASE_INSIGHTS[0]} isConnecting={connect} onExpand={noop} onOutputPortDown={noop} />
          </motion.div>
        </div>
        <div style={{ position: "absolute", left: POS.b.left, top: POS.b.top, width: 150, transform: `scale(${CARD_SCALE})`, transformOrigin: "top left" }}>
          <motion.div ref={bRef} initial={false} animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.32, ease: "easeOut", delay: visible && phase === 1 ? 0.59 : 0 }}>
            <InsightCard insight={SHOWCASE_INSIGHTS[2]} isConnecting={connect} onExpand={noop} onOutputPortDown={noop} />
          </motion.div>
        </div>

        {/* dataset — opacity-only entrance so its input port stays put for measuring */}
        <div style={{ position: "absolute", left: POS.ds.left, top: POS.ds.top, width: 138, transform: `scale(${CARD_SCALE})`, transformOrigin: "top left" }}>
          <motion.div ref={dsRef} initial={false} animate={connect ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.32, ease: "easeOut", delay: connect ? 0.06 : 0 }} style={{ position: "relative" }}>
            <div data-port="input" style={{ position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)", width: 11, height: 11, borderRadius: "50%", background: NAVY_300, border: `2px solid ${SURFACE_RAISE}`, zIndex: 2 }} />
            <DatasetReplica />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════ Phase 3 — Slide (contained, ~square, light replica) ════════════════ */
const SLIDE_W = 150, SLIDE_H = 126;

function SlideLayer({ phase }: { phase: number }) {
  const active = phase === 3;
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: CROSSFADE, ease: "easeInOut" }}
      style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <motion.div
        initial={false}
        animate={active ? { scale: 1, y: 0 } : { scale: 0.92, y: 6 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          width: SLIDE_W, height: SLIDE_H, background: SURFACE_RAISE, border: `1px solid ${BORDER}`,
          boxShadow: "0 8px 24px rgba(27,40,64,0.16)", padding: "9px 11px", overflow: "hidden",
          display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif",
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 6, letterSpacing: "0.16em", color: GOLD, marginBottom: 3 }}>{SHOWCASE_SLIDE.kicker}</span>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 6 }}>{SHOWCASE_SLIDE.title}</span>
        <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 9, overflow: "hidden" }}>
          {/* bullets — small type so the chart keeps its room */}
          <div style={{ flex: 1.05, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", overflow: "hidden" }}>
            {SHOWCASE_SLIDE.bullets.map((b, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                transition={{ duration: 0.21, delay: active ? 0.21 + i * 0.06 : 0 }}
                style={{ display: "flex", gap: 4, alignItems: "flex-start" }}
              >
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: GOLD, marginTop: 2.5, flexShrink: 0 }} />
                <span style={{ fontSize: 6.5, color: T2, lineHeight: 1.25 }}>{b}</span>
              </motion.div>
            ))}
          </div>
          {/* animated bar chart — the signature beat */}
          <div style={{ flex: 0.82, display: "flex", alignItems: "flex-end", gap: 3, paddingBottom: 1 }}>
            {SHOWCASE_SLIDE.bars.map((h, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={active ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.32, ease: "easeOut", delay: active ? 0.29 + i * 0.05 : 0 }}
                style={{ flex: 1, height: `${h * 100}%`, background: i === 4 ? GOLD : NAVY, opacity: i === 4 ? 0.95 : 0.45 + i * 0.08, transformOrigin: "bottom" }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════ Orchestrator ════════════════ */
export function PrototypeShowcase({ inView }: { inView: boolean }) {
  const [phase, setPhase] = useState(0);

  /* Chained timeline so each beat can hold for a different length. The parent
     starts/pauses this by toggling `inView` (at 30% of the section). */
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setPhase((p) => (p + 1) % PHASES), (PHASE_HOLD[phase] + CROSSFADE) * 1000);
    return () => clearTimeout(id);
  }, [inView, phase]);

  return (
    <div style={{ position: "absolute", inset: 0, background: CANVAS_BG, overflow: "hidden" }}>
      <RawLayer phase={phase} />
      <FlowLayer phase={phase} />
      <SlideLayer phase={phase} />
    </div>
  );
}
