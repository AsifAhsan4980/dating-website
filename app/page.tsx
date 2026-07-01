"use client";

import { useState, useEffect, useCallback } from "react";

// ── Constants ────────────────────────────────────────────────────

const INTRO_MESSAGES = [
  "Hey 👋",
  "So...",
  "I've been meaning to ask you something.",
  "It's kind of a big deal.",
  "I've been practicing in the mirror. 🪞",
  "Are you ready?",
];

const REASONS = [
  { emoji: "💸", text: "I'll pay for everything. Obviously.", grad: "from-pink-500 to-rose-500" },
  { emoji: "📊", text: "I'm statistically 27% funnier than the average person.", grad: "from-sky-500 to-blue-500" },
  { emoji: "🤖", text: "I asked AI and it said I'm a great date.", grad: "from-emerald-500 to-teal-500" },
  { emoji: "👩‍👦", text: "My mom says I'm a total catch.", grad: "from-orange-400 to-amber-500" },
  { emoji: "🪄", text: "I will not make it weird. Probably.", grad: "from-fuchsia-500 to-pink-500" },
];

const COURAGE_PHASES = [
  { emoji: "😰", label: "Getting ready…" },
  { emoji: "😤", label: "Warming up! 🏃" },
  { emoji: "💪", label: "Almost there…" },
  { emoji: "🔥", label: "HERE WE GO!!! 🚀" },
  { emoji: "💥", label: "MAX COURAGE UNLOCKED!" },
];

const FLOATING_HEARTS = [
  { e: "💕", style: { top: "2%",  left: "2%",  animationDelay: "0s",    animationDuration: "4s"   } },
  { e: "💖", style: { top: "8%",  right: "4%", animationDelay: "0.8s",  animationDuration: "3.5s" } },
  { e: "🌹", style: { top: "40%", left: "0%",  animationDelay: "1.4s",  animationDuration: "5s"   } },
  { e: "💗", style: { top: "30%", right: "0%", animationDelay: "0.3s",  animationDuration: "4.2s" } },
  { e: "✨", style: { bottom: "15%", left: "4%",  animationDelay: "2s", animationDuration: "3.8s" } },
  { e: "💝", style: { bottom: "10%", right: "2%", animationDelay: "1s", animationDuration: "4.5s" } },
];

// ── Types ────────────────────────────────────────────────────────

type Step = "intro" | "reasons" | "courage" | "question" | "datepick" | "celebrate";
type TimeState = { hour: number; minute: number; ampm: "AM" | "PM" };

// ── Root ─────────────────────────────────────────────────────────

export default function Home() {
  const [step, setStep]               = useState<Step>("intro");
  const [reasonIdx, setReasonIdx]     = useState(0);
  const [courage, setCourage]         = useState(0);
  const [noPos, setNoPos]             = useState({ x: 0, y: 0 });
  const [noCount, setNoCount]         = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<TimeState>({ hour: 7, minute: 0, ampm: "PM" });
  const [fadeIn, setFadeIn]           = useState(true);

  const go = (next: Step) => {
    setFadeIn(false);
    setTimeout(() => { setStep(next); setFadeIn(true); }, 300);
  };

  useEffect(() => {
    if (step !== "courage") return;
    setCourage(0);
    const iv = setInterval(() => {
      setCourage((c) => {
        if (c >= 100) { clearInterval(iv); setTimeout(() => go("question"), 700); return 100; }
        return c + 2;
      });
    }, 40);
    return () => clearInterval(iv);
  }, [step]);

  const runAway = useCallback(() => {
    const mobile = window.innerWidth < 500;
    setNoPos({
      x: (Math.random() - 0.5) * (mobile ? 130 : 480),
      y: (Math.random() - 0.5) * (mobile ? 130 : 280),
    });
    setNoCount((c) => c + 1);
  }, []);

  const nextReason = () =>
    reasonIdx < REASONS.length - 1 ? setReasonIdx((i) => i + 1) : go("courage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-fuchsia-100 overflow-hidden">
      <div
        style={{ opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.3s ease, transform 0.3s ease" }}
        className="flex flex-col items-center text-center gap-6 px-4 max-w-sm w-full py-10"
      >
        {step === "intro"    && <IntroStep onNext={() => go("reasons")} />}
        {step === "reasons"  && <ReasonsStep reason={REASONS[reasonIdx]} idx={reasonIdx} total={REASONS.length} onNext={nextReason} />}
        {step === "courage"  && <CourageStep courage={courage} />}
        {step === "question" && <QuestionStep noPos={noPos} noCount={noCount} onRunAway={runAway} onYes={() => go("datepick")} />}
        {step === "datepick" && (
          <DatePickStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onConfirm={async () => {
              await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: selectedDate, time: selectedTime }),
              }).catch(() => {});
              go("celebrate");
            }}
          />
        )}
        {step === "celebrate" && <CelebrationStep date={selectedDate} time={selectedTime} />}
      </div>
    </div>
  );
}

// ── Step 1 — Intro (chat bubbles) ────────────────────────────────

function IntroStep({ onNext }: { onNext: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const [typing,   setTyping]   = useState(true);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => {
      setRevealed((r) => r + 1);
      setTyping(false);
    }, revealed === 0 ? 700 : 950);
    return () => clearTimeout(t);
  }, [typing, revealed]);

  useEffect(() => {
    if (revealed === 0 || revealed >= INTRO_MESSAGES.length) return;
    const t = setTimeout(() => setTyping(true), 350);
    return () => clearTimeout(t);
  }, [revealed]);

  return (
    <div className="w-full flex flex-col gap-3 text-left">
      {/* Sender badge */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-base shadow-md">💝</div>
        <div>
          <p className="text-pink-700 font-bold text-sm leading-none">Someone special</p>
          <p className="text-pink-400 text-xs">is typing…</p>
        </div>
      </div>

      {/* Bubbles */}
      {INTRO_MESSAGES.slice(0, revealed).map((msg, i) => (
        <div key={i} className="flex items-start gap-2" style={{ animation: "slideUp 0.35s ease forwards" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 mt-3 flex-shrink-0 shadow" />
          <div className="bg-white rounded-2xl rounded-tl-md px-4 py-2.5 shadow-md border border-pink-100 max-w-[90%]">
            <p className="text-gray-800 font-medium text-base">{msg}</p>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {typing && (
        <div className="flex items-start gap-2" style={{ animation: "slideUp 0.2s ease forwards" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 mt-3 flex-shrink-0 shadow" />
          <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-md border border-pink-100">
            <div className="flex gap-1.5 items-center">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-pink-300 rounded-full"
                  style={{ animation: `blink 1.1s ${i * 0.18}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      {revealed >= INTRO_MESSAGES.length && !typing && (
        <div className="flex justify-center mt-3" style={{ animation: "slideUp 0.4s ease forwards" }}>
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-95 text-white font-bold text-lg px-10 py-3 rounded-full shadow-lg transition-all"
            style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
          >
            I&apos;m ready! 🙋
          </button>
        </div>
      )}
    </div>
  );
}

// ── Step 2 — Reasons (gradient cards) ───────────────────────────

function ReasonsStep({ reason, idx, total, onNext }: {
  reason: typeof REASONS[0]; idx: number; total: number; onNext: () => void;
}) {
  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Progress dots */}
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="rounded-full transition-all duration-500"
            style={{
              width:  i === idx ? 24 : i < idx ? 20 : 8,
              height: 8,
              background: i <= idx ? "#ec4899" : "#fce7f3",
              opacity: i > idx ? 0.5 : 1,
            }} />
        ))}
      </div>

      {/* Card */}
      <div
        key={idx}
        className={`w-full rounded-3xl bg-gradient-to-br ${reason.grad} p-8 shadow-2xl flex flex-col items-center gap-5`}
        style={{ animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">
          Reason {idx + 1} of {total}
        </p>

        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl shadow-inner"
          style={{ animation: "popIn 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          {reason.emoji}
        </div>

        <p className="text-white font-extrabold text-2xl leading-snug text-center drop-shadow"
          style={{ animation: "slideUp 0.35s 0.15s ease both" }}>
          {reason.text}
        </p>
      </div>

      <button
        onClick={onNext}
        className="bg-white hover:bg-pink-50 active:scale-95 text-pink-600 font-bold text-lg px-10 py-3 rounded-full shadow-lg border-2 border-pink-200 transition-all"
      >
        {idx < total - 1 ? "Next reason →" : "Okay I get it, ask me! 😂"}
      </button>
    </div>
  );
}

// ── Step 3 — Courage bar ─────────────────────────────────────────

function CourageStep({ courage }: { courage: number }) {
  const phaseIdx = courage >= 100 ? 4 : courage >= 85 ? 3 : courage >= 60 ? 2 : courage >= 30 ? 1 : 0;
  const phase = COURAGE_PHASES[phaseIdx];

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-pink-100 p-8 w-full flex flex-col items-center gap-5">
        <p className="text-pink-400 text-xs font-bold uppercase tracking-widest">Loading confidence…</p>

        <div className="text-7xl" key={phaseIdx}
          style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          {phase.emoji}
        </div>

        <p className="text-pink-700 font-bold text-xl">{phase.label}</p>

        {/* Bar */}
        <div className="w-full">
          <div className="w-full bg-pink-100 rounded-full h-5 overflow-hidden border border-pink-200 shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-75 relative overflow-hidden"
              style={{
                width: `${courage}%`,
                background: "linear-gradient(90deg, #f9a8d4, #ec4899, #e11d48)",
                boxShadow: courage > 10 ? "0 0 12px rgba(236,72,153,0.6)" : "none",
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>
          {/* Milestone ticks */}
          <div className="flex justify-between px-1 mt-1">
            {["30%", "60%", "85%", "🔥"].map((label, i) => (
              <span key={i} className="text-xs text-pink-300 font-medium">{label}</span>
            ))}
          </div>
        </div>

        <p className="text-4xl font-black text-pink-600">{courage}%</p>
      </div>
    </div>
  );
}

// ── Step 4 — The Question ────────────────────────────────────────

function QuestionStep({ noPos, noCount, onRunAway, onYes }: {
  noPos: { x: number; y: number }; noCount: number; onRunAway: () => void; onYes: () => void;
}) {
  const noLabels = ["No 🙅", "Still no", "Nope 😤", "Not happening", "Why won't this work??", "HELP 😭", "..."];
  const label = noLabels[Math.min(noCount, noLabels.length - 1)];
  const subtitle = noCount === 0
    ? "Think carefully. 😇"
    : noCount < 3 ? "The No button has a mind of its own…"
    : noCount < 6 ? "The universe is clearly telling you something 🌌"
    : "Scientists are baffled. The button refuses to cooperate.";

  return (
    <div className="relative w-full flex flex-col items-center gap-5">
      {/* Floating hearts */}
      {FLOATING_HEARTS.map((h, i) => (
        <div key={i} className="absolute text-2xl pointer-events-none select-none"
          style={{ ...h.style, animation: `float ${h.style.animationDuration} ${h.style.animationDelay} ease-in-out infinite` }}>
          {h.e}
        </div>
      ))}

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 px-7 py-9 w-full flex flex-col items-center gap-4">
        <div className="text-7xl" style={{ animation: "heartbeat 1.4s ease-in-out infinite" }}>🥺</div>

        <h1 className="text-3xl font-black text-pink-700 leading-tight">
          Will you go on a<br />date with me?
        </h1>

        <p className="text-pink-400 text-sm font-medium min-h-[20px]">{subtitle}</p>

        <div className="relative flex gap-4 items-center justify-center flex-wrap mt-2" style={{ minHeight: 64 }}>
          <button
            onClick={onYes}
            className="text-white font-black text-xl px-10 py-3.5 rounded-full shadow-xl transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #f472b6, #ec4899, #db2777)",
              animation: "glow-pulse 1.8s ease-in-out infinite",
            }}
          >
            Yes!! 💕
          </button>

          <button
            onMouseEnter={onRunAway}
            onTouchStart={onRunAway}
            onClick={onRunAway}
            style={{
              transform: `translate(${noPos.x}px, ${noPos.y}px)`,
              transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            className="bg-gray-100 text-gray-400 font-bold text-base px-6 py-3 rounded-full shadow-sm select-none cursor-default border border-gray-200"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step 5 — Date + Time pick ────────────────────────────────────

function Calendar({ selectedDate, onChange }: { selectedDate: string; onChange: (d: string) => void }) {
  const today = new Date(2026, 5, 2); // June 2, 2026 — earliest selectable date
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(5); // June

  const DAYS   = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const toKey = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => viewMonth === 0 ? (setViewMonth(11), setViewYear((y) => y - 1)) : setViewMonth((m) => m - 1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0), setViewYear((y) => y + 1)) : setViewMonth((m) => m + 1);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-4 w-full select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-100 text-pink-500 font-bold text-xl transition-colors">‹</button>
        <span className="font-bold text-pink-700">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-100 text-pink-500 font-bold text-xl transition-colors">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => <div key={d} className="text-center text-xs font-bold text-pink-300 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key      = toKey(viewYear, viewMonth, day);
          const cellDate = new Date(viewYear, viewMonth, day);
          const isPast   = cellDate < today;
          const isToday  = cellDate.getTime() === today.getTime();
          const isSel    = key === selectedDate;
          return (
            <div key={i} className="flex justify-center py-0.5">
              <button disabled={isPast} onClick={() => onChange(key)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition-all duration-150 ${
                  isPast  ? "text-gray-200 cursor-not-allowed" :
                  isSel   ? "bg-pink-500 text-white shadow-md scale-110" :
                  isToday ? "border-2 border-pink-400 text-pink-600 hover:bg-pink-50" :
                            "text-pink-800 hover:bg-pink-100"
                }`}>
                {day}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-center">
        <button onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); onChange(toKey(today.getFullYear(), today.getMonth(), today.getDate())); }}
          className="text-xs text-pink-400 hover:text-pink-600 font-medium transition-colors">
          Jump to today
        </button>
      </div>
    </div>
  );
}

function TimePicker({ time, onChange }: { time: TimeState; onChange: (t: TimeState) => void }) {
  const hours   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes = [0, 15, 30, 45];
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-4 w-full select-none">
      <p className="text-center text-xs font-bold text-pink-300 uppercase tracking-widest mb-3">Pick a time ⏰</p>
      <div className="grid grid-cols-6 gap-1 mb-3">
        {hours.map((h) => (
          <button key={h} onClick={() => onChange({ ...time, hour: h })}
            className={`py-1.5 rounded-xl text-sm font-bold transition-all duration-150 ${
              time.hour === h ? "bg-pink-500 text-white shadow scale-105" : "text-pink-700 hover:bg-pink-100"
            }`}>{h}</button>
        ))}
      </div>
      <div className="flex gap-2 justify-center mb-3">
        {minutes.map((m) => (
          <button key={m} onClick={() => onChange({ ...time, minute: m })}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all duration-150 ${
              time.minute === m ? "bg-pink-500 text-white shadow scale-105" : "text-pink-700 hover:bg-pink-100"
            }`}>:{String(m).padStart(2, "0")}</button>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="flex bg-pink-50 rounded-full p-1 gap-1 border border-pink-100">
          {(["AM", "PM"] as const).map((p) => (
            <button key={p} onClick={() => onChange({ ...time, ampm: p })}
              className={`px-6 py-1 rounded-full text-sm font-black transition-all duration-150 ${
                time.ampm === p ? "bg-pink-500 text-white shadow" : "text-pink-400 hover:text-pink-600"
              }`}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DatePickStep({ selectedDate, selectedTime, onDateChange, onTimeChange, onConfirm }: {
  selectedDate: string; selectedTime: TimeState;
  onDateChange: (d: string) => void; onTimeChange: (t: TimeState) => void; onConfirm: () => void;
}) {
  const [error, setError] = useState(false);
  const confirm = () => { if (!selectedDate) { setError(true); return; } onConfirm(); };

  const formattedDate = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : null;
  const formattedTime = `${selectedTime.hour}:${String(selectedTime.minute).padStart(2, "0")} ${selectedTime.ampm}`;

  return (
    <>
      {/* Header banner */}
      <div className="w-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-5 shadow-xl flex flex-col items-center gap-1"
        style={{ animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
        <div className="text-4xl" style={{ animation: "heartbeat 1s ease-in-out infinite" }}>🎉</div>
        <h2 className="text-2xl font-black text-white">SHE SAID YES!</h2>
        <p className="text-white/80 text-sm">Now pick a date & time — I&apos;ll be counting down.</p>
      </div>

      <Calendar selectedDate={selectedDate} onChange={(d) => { onDateChange(d); setError(false); }} />
      <TimePicker time={selectedTime} onChange={onTimeChange} />

      {formattedDate ? (
        <div className="bg-white rounded-2xl border-2 border-pink-300 px-5 py-3 shadow text-pink-700 font-semibold text-base w-full"
          style={{ animation: "slideUp 0.3s ease forwards" }}>
          📅 {formattedDate} &nbsp;·&nbsp; ⏰ {formattedTime}
        </div>
      ) : error ? (
        <p className="text-red-400 text-sm font-medium">Please pick a date first! 😤</p>
      ) : (
        <p className="text-pink-300 text-sm">No date selected yet…</p>
      )}

      <button onClick={confirm}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-95 text-white font-black text-xl py-4 rounded-2xl shadow-xl transition-all">
        Lock it in! 🔒
      </button>
    </>
  );
}

// ── Step 6 — Celebrate ───────────────────────────────────────────

function CelebrationStep({ date, time }: { date: string; time: TimeState }) {
  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const formattedTime = `${time.hour}:${String(time.minute).padStart(2, "0")} ${time.ampm}`;

  const topEmojis    = ["🎊", "🥂", "🌹", "✨"];
  const bottomEmojis = ["💖", "😍", "🦋", "🎉"];

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Top emoji burst */}
      <div className="flex justify-center gap-3">
        {topEmojis.map((e, i) => (
          <span key={i} className="text-4xl"
            style={{ animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 90}ms both` }}>{e}</span>
        ))}
      </div>

      {/* Title */}
      <div style={{ animation: "slideUp 0.4s 0.25s ease both" }}>
        <h1 className="text-4xl font-black leading-tight"
          style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          It&apos;s officially<br />a date! 💝
        </h1>
      </div>

      {/* Date card */}
      <div className="w-full bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-2"
        style={{ animation: "popIn 0.5s 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Marked in my heart & calendar</p>
        <p className="text-white font-black text-xl leading-tight">{formattedDate}</p>
        <div className="w-16 h-px bg-white/30 my-1" />
        <p className="text-white/90 font-bold text-lg">⏰ {formattedTime}</p>
      </div>

      {/* Bottom emoji burst */}
      <div className="flex justify-center gap-3">
        {bottomEmojis.map((e, i) => (
          <span key={i} className="text-4xl"
            style={{ animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${400 + i * 90}ms both` }}>{e}</span>
        ))}
      </div>

      <p className="text-pink-500 font-semibold text-base" style={{ animation: "slideUp 0.4s 0.8s ease both" }}>
        See you then. I&apos;m already nervous. 😅
      </p>

      <div className="text-5xl" style={{ animation: "heartbeat 1s ease-in-out infinite" }}>💗</div>
    </div>
  );
}