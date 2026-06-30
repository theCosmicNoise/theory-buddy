import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, Sparkles, Send, Check, CheckCircle2, Plus, Youtube,
  Loader2, Menu, X, RotateCcw, ChevronDown, ChevronRight,
  GraduationCap, ArrowRight, Music2
} from "lucide-react";

const MODEL = "claude-sonnet-4-6";

/* ---------- ids + seed ---------- */
function uid() {
  return "id_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
}

const L1_CONTENT = `## Sound is vibration
Something physical vibrates (your vocal folds, a harmonica reed, a tabla skin), pushes the air into a repeating pressure wave, and that wave reaches your eardrum. No vibration, no sound.

## Frequency
How fast the vibration repeats, measured in cycles per second, called **Hertz (Hz)**. Faster vibration means higher frequency. The human ear hears roughly 20 Hz to 20,000 Hz.

## Pitch
How high or low a sound feels. Frequency is the physical fact; pitch is your perception of it. A physicist says "440 Hz", a musician says "the note A".

## A note vs noise
A note has one steady, definite frequency, so it has a clear pitch. A clap is many frequencies at once with no clear pitch. Sa is a note; a cymbal crash is closer to noise.

## Amplitude and loudness
Amplitude is how big the vibration is, and it controls loudness, not pitch. You can sing the same Sa softly or loudly without changing the note. Pitch and loudness are independent.

## Timbre (tone colour)
Why the same note sounds different on your voice versus a harmonica. Every note is a **fundamental frequency** plus quieter higher frequencies called **overtones** stacked on top. That mix is the instrument's fingerprint, and the root of vocal resonance later.

## The octave
The most important relationship in music. Double the frequency equals the same note, higher. 220, 440, and 880 Hz are all A (A3, A4, A5). The brain hears octave-related notes as the same note because their overtones line up. Your saptak is the Western octave.

## How the 12 notes get frequencies
The world fixed **A4 = 440 Hz** as a reference. Each semitone above is about 1.059 times the one below. The octave is split into 12 equal steps. This is equal temperament.

## Bridge to Hindustani
Sa is movable: you pick its frequency and the tanpura drones it. Western letter names are fixed (A is anchored to 440 Hz), and a harmonium fixes every pitch the same way. Same 12 tones, different convention about where home sits.

## Practice
Open a tone generator app. Play 220, 440, 880 Hz and hear the same note rising. Hum your Sa, then its octave up. Then play one note on harmonica and sing it: pitch matches, colour does not. That gap is overtones.`;

const L2_CONTENT = `## The 7 letter names
Western music uses 7 letters for the natural notes: C, D, E, F, G, A, B, then it repeats at C. These are your shuddha swaras. Set Sa = C and the natural scale lines up:

\`\`\`
C    D    E    F    G    A    B    C
Sa   Re   Ga   Ma   Pa   Dha  Ni   Sa
\`\`\`

This natural scale is **Bilawal thaat**, which in Western terms is the **C major scale**.

## 12 notes, sharps and flats
Between the 7 letters sit 5 more notes, 12 in total. **Sharp (#)** raises a note one semitone; **flat (b)** lowers it one semitone. The same pitch can have two names (C# = Db); these are enharmonic equivalents.

Komal and tivra map directly:
- komal Re = Db
- komal Ga = Eb
- tivra Ma = F#
- komal Dha = Ab
- komal Ni = Bb

## Fixed vs movable
In Western music letter names are fixed pitches (C is always about 261.63 Hz). Movable-Sa behaviour comes from a separate tool, solfege, covered in Module 7. For now treat C as a fixed Sa.

## The keyboard
Black keys come in groups of 2 and 3. **C is the white key just left of the group of 2 black keys.** Find that landmark and you can name everything. There is no black key between E and F, or between B and C, which is why those pairs are only a semitone apart.

## Octave numbering
The same note higher is double the frequency. Middle Sa is **C4** (middle C). C5 is the next Sa up, C3 the next down.

## Practice
At a keyboard or app, find every C using the 2-black-key landmark, then play C D E F G A B C while singing Sa Re Ga Ma Pa Dha Ni Sa. Then play the 5 black keys and name each as both its sharp and flat name.`;

function L(title, extra = {}) {
  return {
    id: uid(),
    title,
    content: extra.content || "",
    video: extra.video || null,
    videos: [],
    done: false,
    addedByDoubt: false
  };
}

function makeSeed() {
  return [
    {
      id: uid(), title: "Module 0 · Foundations & Bridging",
      lessons: [
        L("Sound, frequency, and pitch", { content: L1_CONTENT, video: { title: "Why Do Instruments Sound Different? (Audio University)", url: "https://www.youtube.com/watch?v=EeEspQ6-Gzk" } }),
        L("The keyboard and the 12 note names", { content: L2_CONTENT, video: { title: "Learn music theory in half an hour (Andrew Huang)", url: "https://www.youtube.com/watch?v=rgaTLrZGlk0" } }),
        L("Movable Sa vs fixed pitch: thaat vs scale")
      ]
    },
    {
      id: uid(), title: "Module 1 · Notes & Notation",
      lessons: [
        L("The staff, lines, and spaces"),
        L("Treble and bass clefs"),
        L("The grand staff and middle C"),
        L("Ledger lines and octave registers"),
        L("Sharps, flats, naturals, and accidentals"),
        L("Enharmonic equivalents")
      ]
    },
    {
      id: uid(), title: "Module 2 · Scales & Keys",
      lessons: [
        L("Half steps and whole steps"),
        L("The chromatic scale"),
        L("The major scale formula"),
        L("Scale degrees and their names"),
        L("Solfege and movable-do (mapping to sargam)"),
        L("Natural minor scale"),
        L("Harmonic and melodic minor"),
        L("Key signatures"),
        L("The circle of fifths"),
        L("The modes, and thaat parallels")
      ]
    },
    {
      id: uid(), title: "Module 3 · Intervals",
      lessons: [
        L("Naming intervals by number"),
        L("Interval quality: major, minor, perfect"),
        L("Consonance and dissonance"),
        L("Inverting and hearing intervals")
      ]
    },
    {
      id: uid(), title: "Module 4 · Rhythm & Meter",
      lessons: [
        L("Beat, pulse, and tempo"),
        L("Note values, whole to sixteenth"),
        L("Rests"),
        L("Time signatures (simple meter)"),
        L("Dotted notes and ties"),
        L("Compound meter"),
        L("Syncopation and off-beats"),
        L("Tala vs Western meter")
      ]
    },
    {
      id: uid(), title: "Module 5 · Harmony & Chords",
      lessons: [
        L("What a chord is; building triads"),
        L("Major and minor triads"),
        L("Diminished and augmented triads"),
        L("Triad inversions"),
        L("Seventh chords"),
        L("Extended chords (9, 11, 13)"),
        L("Diatonic chords of the major scale"),
        L("Roman numeral analysis"),
        L("Common chord progressions"),
        L("Cadences"),
        L("Voice leading basics"),
        L("Harmonizing a melody")
      ]
    },
    {
      id: uid(), title: "Module 6 · Melody, Form & Analysis",
      lessons: [
        L("Phrases and cadence points"),
        L("Motifs and development"),
        L("Song form (verse, chorus, AABA)"),
        L("Transposition"),
        L("Analyzing a simple song")
      ]
    },
    {
      id: uid(), title: "Module 7 · Ear Training & Sight-Singing",
      lessons: [
        L("Matching pitch"),
        L("Singing the major scale with solfege"),
        L("Hearing intervals"),
        L("Hearing chord qualities"),
        L("Rhythmic dictation"),
        L("Sight-singing simple melodies")
      ]
    },
    {
      id: uid(), title: "Module 8 · Voice Foundations",
      lessons: [
        L("Vocal anatomy: folds, breath, resonators"),
        L("Posture and alignment"),
        L("Diaphragmatic breathing and support"),
        L("Onset and phonation"),
        L("Registers: chest, head, mix"),
        L("Falsetto and whistle"),
        L("Resonance and placement"),
        L("A daily warm-up routine")
      ]
    },
    {
      id: uid(), title: "Module 9 · Vocal Technique & Expression",
      lessons: [
        L("Vibrato"),
        L("Vowels and diction"),
        L("Dynamics and control"),
        L("Agility and runs"),
        L("Extending your range safely"),
        L("Belting basics"),
        L("Ornamentation, and meend/gamak parallels"),
        L("Vocal health and care")
      ]
    },
    {
      id: uid(), title: "Module 10 · Harmonica Integration",
      lessons: [
        L("Diatonic harmonica layout"),
        L("Blow and draw notes"),
        L("Playing single notes cleanly"),
        L("Positions and keys"),
        L("Bending notes"),
        L("Applying scales and theory on harmonica")
      ]
    },
    {
      id: uid(), title: "Module 11 · Synthesis & Application",
      lessons: [
        L("Improvisation basics"),
        L("Mapping ragas to Western scales and modes"),
        L("Accompanying yourself"),
        L("Putting it all together: perform a piece")
      ]
    }
  ];
}

/* ---------- api proxy ---------- */
async function callClaude({ system, messages, useSearch = false }) {
  const body = { model: MODEL, max_tokens: 1000, messages };
  if (system) body.system = system;
  if (useSearch) body.tools = [{ type: "web_search_20260209", name: "web_search" }];
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("API error " + res.status);
  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

function extractJson(text) {
  if (!text) return null;
  let t = text.trim();
  t = t.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const fObj = t.indexOf("{");
  const fArr = t.indexOf("[");
  let start = -1, close = "}";
  if (fArr !== -1 && (fObj === -1 || fArr < fObj)) { start = fArr; close = "]"; }
  else { start = fObj; }
  if (start === -1) return null;
  const end = t.lastIndexOf(close);
  if (end === -1 || end < start) return null;
  try { return JSON.parse(t.slice(start, end + 1)); } catch (e) { return null; }
}

const PERSONA =
  "You are Theory Buddy, a Western music theory and vocal technique tutor for a student trained in Hindustani classical music who also plays harmonica. Explain clearly and concisely, bridge to sargam, thaat, and raga ideas when it helps, and avoid filler.";

function askSystem(modules) {
  const map = modules
    .map((m) => `${m.id} | ${m.title}\n` + m.lessons.map((l) => `   ${l.id} | ${l.title}`).join("\n"))
    .join("\n");
  return (
    PERSONA +
    "\n\nThe student may ask a genuine music theory / vocal technique question, OR send a meta-command or chit-chat that has nothing to do with music (e.g. \"clear chat\", \"reset\", \"delete this\", \"start over\", \"hello\", \"thanks\", \"help\"). " +
    "If the message is NOT a genuine music/vocal question, respond with ONLY this JSON and nothing else:\n" +
    '{"answer":"Sorry, I can only answer music theory and vocal technique questions here. Use the Reset button in the sidebar to clear your curriculum.","fits":"none","moduleId":null,"lessonId":null,"newLessonTitle":null,"videoQuery":null}\n\n' +
    "Otherwise, answer the student's question, then decide where it belongs in her curriculum below.\n" +
    "Respond with ONLY raw JSON, no code fences, no commentary, shaped exactly like:\n" +
    '{"answer":"<concise markdown answer; use ## subheads, **bold**, - bullets, ``` for diagrams; keep under ~250 words>","fits":"existing"|"new","moduleId":"<module id>","lessonId":"<lesson id or null>","newLessonTitle":"<short title or null>","videoQuery":"<a good youtube search query for this concept>"}\n' +
    'Use "existing" only if the concept genuinely belongs inside a listed lesson. Otherwise use "new", give a short newLessonTitle, and the best fitting moduleId. Use ids exactly as listed.\n\nCurriculum:\n' +
    map
  );
}

const GEN_SYSTEM =
  PERSONA +
  "\nWrite the requested lesson. Use ## subheads, **bold**, - bullets, and ``` diagrams where useful. Bridge to Hindustani when relevant. End with a short **Practice** task. Output only the markdown lesson, no preamble.";

const VIDEO_SYSTEM =
  "Find up to 3 high-quality YouTube videos that teach the given music topic. Use web search. Return ONLY a raw JSON array, no other text: " +
  '[{"title":"...","url":"https://www.youtube.com/watch?v=..."}]. Only real youtube.com URLs taken from your search results.';

function deriveTitle(q) {
  let s = q.trim().replace(/[?.!]+$/, "");
  s = s.replace(/^(what\s+(is|are|do|does)|explain|define|tell me about|how\s+(do|does|to))\s+/i, "");
  s = s.replace(/\bfor me\b/gi, "").trim();
  if (!s) s = q.trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ---------- localStorage helpers ---------- */
function storageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

/* ---------- tiny markdown ---------- */
function inline(str) {
  const nodes = [];
  let rest = str;
  let k = 0;
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/;
  let m;
  while ((m = rest.match(re))) {
    const idx = m.index;
    if (idx > 0) nodes.push(rest.slice(0, idx));
    if (m[2] !== undefined)
      nodes.push(<strong key={k++} className="font-semibold text-slate-900">{m[2]}</strong>);
    else if (m[3] !== undefined)
      nodes.push(<em key={k++} className="italic">{m[3]}</em>);
    else if (m[4] !== undefined)
      nodes.push(<code key={k++} className="px-1 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs">{m[4]}</code>);
    rest = rest.slice(idx + m[0].length);
  }
  if (rest) nodes.push(rest);
  return nodes;
}

function MarkdownLite({ text }) {
  if (!text) return null;
  const lines = text.replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0, key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { buf.push(lines[i]); i++; }
      i++;
      out.push(
        <pre key={key++} className="bg-slate-900 text-slate-100 text-xs sm:text-sm rounded-lg p-3 overflow-x-auto my-3 font-mono leading-relaxed">{buf.join("\n")}</pre>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(<h3 key={key++} className="font-serif text-lg text-slate-900 mt-5 mb-1">{inline(line.slice(3))}</h3>);
      i++; continue;
    }
    if (line.startsWith("# ")) {
      out.push(<h2 key={key++} className="font-serif text-xl text-slate-900 mt-5 mb-2">{inline(line.slice(2))}</h2>);
      i++; continue;
    }
    // horizontal rule: --- or *** or ___ alone on a line
    if (/^(\s*[-*_]){3,}\s*$/.test(line) && !line.trim().startsWith("- ")) {
      out.push(<hr key={key++} className="my-4 border-slate-200" />);
      i++; continue;
    }
    if (line.trim().startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) { items.push(lines[i].trim().slice(2)); i++; }
      out.push(
        <ul key={key++} className="list-disc pl-5 my-2 space-y-1 text-slate-700">
          {items.map((it, idx) => <li key={idx}>{inline(it)}</li>)}
        </ul>
      );
      continue;
    }
    // table
    if (line.trim().startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i]); i++; }
      const isSep = (r) => /^\s*\|(\s*[-:]+\s*\|)+\s*$/.test(r);
      const dataRows = rows.filter((r) => !isSep(r));
      const cells = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      if (dataRows.length > 0) {
        out.push(
          <div key={key++} className="overflow-x-auto my-3">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  {cells(dataRows[0]).map((c, ci) => (
                    <th key={ci} className="border border-slate-200 px-3 py-1.5 text-left font-semibold text-slate-800">{inline(c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.slice(1).map((r, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    {cells(r).map((c, ci) => (
                      <td key={ci} className="border border-slate-200 px-3 py-1.5 text-slate-700">{inline(c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }
    if (line.trim() === "") { i++; continue; }
    const buf = [line];
    i++;
    while (
      i < lines.length && lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") && !lines[i].startsWith("# ") &&
      !lines[i].trim().startsWith("- ") && !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("|") &&
      !/^(\s*[-*_]){3,}\s*$/.test(lines[i])
    ) { buf.push(lines[i]); i++; }
    out.push(<p key={key++} className="text-slate-700 leading-relaxed my-2">{inline(buf.join(" "))}</p>);
  }
  return <div>{out}</div>;
}

/* ---------- app ---------- */
export default function App() {
  const [modules, setModules] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [ready, setReady] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("lesson");
  const [expanded, setExpanded] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [genBusy, setGenBusy] = useState(false);
  const [vidBusy, setVidBusy] = useState(null);
  const [error, setError] = useState("");
  const askEndRef = useRef(null);

  /* persistence */
  function persistModules(arr) {
    storageSet("tb_curriculum", JSON.stringify(arr));
  }
  function persistDoubts(arr) {
    storageSet("tb_doubts", JSON.stringify(arr));
  }
  function updateModules(fn) {
    setModules((prev) => { const n = fn(prev); persistModules(n); return n; });
  }
  function updateDoubts(fn) {
    setDoubts((prev) => { const n = fn(prev); persistDoubts(n); return n; });
  }

  useEffect(() => {
    let mods = null, dbts = null;
    try { const r = storageGet("tb_curriculum"); if (r) mods = JSON.parse(r); } catch {}
    try { const r = storageGet("tb_doubts"); if (r) dbts = JSON.parse(r); } catch {}
    if (!mods || !Array.isArray(mods) || mods.length === 0) { mods = makeSeed(); persistModules(mods); }
    setModules(mods);
    setDoubts(dbts || []);
    const first = mods[0];
    setSelectedId(first && first.lessons[0] ? first.lessons[0].id : null);
    setExpanded({ [first.id]: true });
    setReady(true);
  }, []);

  useEffect(() => {
    if (view === "ask" && askEndRef.current) askEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [doubts, view]);

  /* lookups */
  function lessonById(id) {
    for (const m of modules) for (const l of m.lessons) if (l.id === id) return l;
    return null;
  }
  function moduleOfLesson(id) {
    for (const m of modules) for (const l of m.lessons) if (l.id === id) return m;
    return null;
  }

  const selected = lessonById(selectedId);
  const selMod = moduleOfLesson(selectedId);
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const doneLessons = modules.reduce((a, m) => a + m.lessons.filter((l) => l.done).length, 0);

  /* actions */
  function toggleModule(id) { setExpanded((e) => ({ ...e, [id]: !e[id] })); }
  function selectLesson(id) { setSelectedId(id); setView("lesson"); setSidebarOpen(false); }
  function toggleDone(lesson) {
    updateModules((prev) => prev.map((m) => ({ ...m, lessons: m.lessons.map((l) => l.id === lesson.id ? { ...l, done: !l.done } : l) })));
  }

  async function generate(lesson) {
    setGenBusy(true); setError("");
    try {
      const mod = moduleOfLesson(lesson.id);
      const text = await callClaude({
        system: GEN_SYSTEM,
        messages: [{ role: "user", content: `Write the lesson titled "${lesson.title}" (in ${mod ? mod.title : "the course"}).` }]
      });
      if (!text) throw new Error("empty");
      updateModules((prev) => prev.map((m) => ({ ...m, lessons: m.lessons.map((l) => l.id === lesson.id ? { ...l, content: text } : l) })));
    } catch (e) { setError("Couldn't write that lesson. Try again."); }
    finally { setGenBusy(false); }
  }

  async function findVideos(topic, attach) {
    setError("");
    try {
      const text = await callClaude({ system: VIDEO_SYSTEM, messages: [{ role: "user", content: "Topic: " + topic }], useSearch: true });
      let vids = extractJson(text);
      if (!Array.isArray(vids)) vids = [];
      vids = vids.filter((v) => v && v.url).slice(0, 3);
      if (vids.length === 0)
        vids = [{ title: 'Search YouTube for "' + topic + '"', url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(topic) }];
      attach(vids);
    } catch (e) { setError("Couldn't fetch videos. Try again."); }
  }

  async function findVideosForLesson(lesson) {
    setVidBusy(lesson.id);
    await findVideos(lesson.title, (vids) =>
      updateModules((prev) => prev.map((m) => ({ ...m, lessons: m.lessons.map((l) => l.id === lesson.id ? { ...l, videos: vids } : l) })))
    );
    setVidBusy(null);
  }

  async function findVideosForDoubt(entry) {
    setVidBusy(entry.id);
    await findVideos(entry.videoQuery || entry.q, (vids) =>
      updateDoubts((prev) => prev.map((d) => d.id === entry.id ? { ...d, videos: vids } : d))
    );
    setVidBusy(null);
  }

  function applyPlacement(parsed, q) {
    if (parsed.fits === "none") {
      return { mods: modules, ans: parsed.answer || "", placementText: "", targetLessonId: null };
    }
    const mods = modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => ({ ...l })) }));
    const ans = parsed.answer || "";
    let mod = mods.find((m) => m.id === parsed.moduleId);
    if (!mod && selMod) mod = mods.find((m) => m.id === selMod.id);
    if (!mod) mod = mods[0];
    let placementText = "", targetLessonId = null;

    if (parsed.fits === "existing") {
      const lesson = mod.lessons.find((l) => l.id === parsed.lessonId) ||
        (mods.flatMap((m) => m.lessons).find((l) => l.id === parsed.lessonId));
      if (lesson) {
        const host = mods.find((m) => m.lessons.some((l) => l.id === lesson.id));
        lesson.content = (lesson.content ? lesson.content + "\n\n" : "") + `## Added from your question\n_${q}_\n\n${ans}`;
        lesson.addedByDoubt = true;
        placementText = `Added to "${lesson.title}" in ${host.title}.`;
        targetLessonId = lesson.id;
      }
    }
    if (!targetLessonId) {
      const title = parsed.newLessonTitle || deriveTitle(q);
      const newLesson = { id: uid(), title, content: ans, video: null, videos: [], done: false, addedByDoubt: true };
      mod.lessons.push(newLesson);
      placementText = `Created a new lesson "${title}" in ${mod.title}.`;
      targetLessonId = newLesson.id;
    }
    return { mods, ans, placementText, targetLessonId };
  }

  async function ask() {
    const q = question.trim();
    if (!q || busy) return;
    setBusy(true); setError("");
    const entryId = uid();
    updateDoubts((prev) => [...prev, { id: entryId, q, a: "", placementText: "", targetLessonId: null, videoQuery: q, videos: [], pending: true }]);
    setQuestion("");
    try {
      const text = await callClaude({ system: askSystem(modules), messages: [{ role: "user", content: q }] });
      const parsed = extractJson(text);
      const safe = parsed && parsed.answer
        ? parsed
        : { answer: text || "I couldn't parse that. Try rephrasing the question.", fits: "new", moduleId: modules[0] && modules[0].id, newLessonTitle: deriveTitle(q), videoQuery: q };
      const res = applyPlacement(safe, q);
      updateModules(() => res.mods);
      updateDoubts((prev) => prev.map((d) => d.id === entryId
        ? { id: entryId, q, a: res.ans, placementText: res.placementText, targetLessonId: res.targetLessonId, videoQuery: safe.videoQuery || q, videos: [], pending: false }
        : d));
    } catch (e) {
      updateDoubts((prev) => prev.map((d) => d.id === entryId
        ? { ...d, pending: false, a: "Something went wrong reaching the tutor. Check your connection and try again." }
        : d));
    } finally { setBusy(false); }
  }

  function resetAll() {
    if (!window.confirm("Reset progress, added lessons, and questions back to the starting curriculum?")) return;
    const s = makeSeed();
    updateModules(() => s);
    updateDoubts(() => []);
    setSelectedId(s[0].lessons[0].id);
    setExpanded({ [s[0].id]: true });
    setView("lesson");
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <Loader2 className="animate-spin mr-2" size={18} /> Loading your curriculum
      </div>
    );
  }

  const examples = ["What is an arpeggio?", "What is a perfect fifth?", "What is vibrato?", "What is syncopation?"];

  return (
    <div className="flex h-screen w-full bg-slate-100 text-slate-800 font-sans overflow-hidden">
      {/* sidebar */}
      <aside className={
        "fixed md:static z-30 top-0 left-0 h-full w-72 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 " +
        (sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")
      }>
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Music2 size={18} />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-white text-lg">Theory Buddy</div>
            <div className="text-xs text-amber-400 tracking-wide">Sargam to Western</div>
          </div>
          <button className="ml-auto md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        <div className="px-4 py-3 border-b border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span><span>{doneLessons}/{totalLessons}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: (totalLessons ? (doneLessons / totalLessons) * 100 : 0) + "%" }} />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {modules.map((m) => {
            const open = !!expanded[m.id];
            const d = m.lessons.filter((l) => l.done).length;
            return (
              <div key={m.id} className="px-2">
                <button onClick={() => toggleModule(m.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-800 text-left">
                  {open ? <ChevronDown size={15} className="text-slate-500 shrink-0" /> : <ChevronRight size={15} className="text-slate-500 shrink-0" />}
                  <span className="text-sm text-slate-200 flex-1">{m.title}</span>
                  <span className="text-xs text-slate-500">{d}/{m.lessons.length}</span>
                </button>
                {open && (
                  <div className="ml-3 border-l border-slate-800 mb-1">
                    {m.lessons.map((l) => {
                      const active = l.id === selectedId;
                      return (
                        <button key={l.id} onClick={() => selectLesson(l.id)}
                          className={"w-full flex items-center gap-2 pl-3 pr-2 py-1.5 text-left text-sm rounded-r-md " +
                            (active ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200")}>
                          {l.done
                            ? <CheckCircle2 size={14} className={active ? "text-white shrink-0" : "text-amber-500 shrink-0"} />
                            : <span className={"w-1.5 h-1.5 rounded-full shrink-0 " + (l.content ? "bg-slate-500" : "bg-slate-700")} />}
                          <span className="flex-1 truncate">{l.title}</span>
                          {l.addedByDoubt && <Sparkles size={12} className={active ? "text-amber-200 shrink-0" : "text-amber-500 shrink-0"} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button onClick={resetAll}
          className="m-3 mt-1 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-200 py-2 rounded-md hover:bg-slate-800">
          <RotateCcw size={13} /> Reset curriculum
        </button>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button className="md:hidden text-slate-600" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button onClick={() => setView("lesson")}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm " + (view === "lesson" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
              <BookOpen size={15} /> Lesson
            </button>
            <button onClick={() => setView("ask")}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm " + (view === "ask" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
              <Sparkles size={15} /> Ask Buddy
            </button>
          </div>
          <div className="ml-auto text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <GraduationCap size={14} /> {totalLessons} lessons · 12 modules
          </div>
        </header>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-sm px-4 py-2 border-b border-rose-100">{error}</div>
        )}

        {/* lesson view */}
        {view === "lesson" && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
              {selected ? (
                <>
                  <div className="text-xs uppercase tracking-wider text-indigo-600 mb-1">{selMod ? selMod.title : ""}</div>
                  <div className="flex items-start gap-3">
                    <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 flex-1">{selected.title}</h1>
                  </div>
                  {selected.addedByDoubt && (
                    <div className="inline-flex items-center gap-1.5 mt-2 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                      <Sparkles size={12} /> Added from one of your questions
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => toggleDone(selected)}
                      className={"flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border " +
                        (selected.done ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}>
                      <Check size={15} /> {selected.done ? "Completed" : "Mark complete"}
                    </button>
                    <button onClick={() => findVideosForLesson(selected)} disabled={vidBusy === selected.id}
                      className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                      {vidBusy === selected.id ? <Loader2 size={15} className="animate-spin" /> : <Youtube size={15} />} Find videos
                    </button>
                  </div>

                  {selected.video && (
                    <a href={selected.video.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 mt-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition">
                      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0"><Youtube size={18} /></div>
                      <div className="min-w-0">
                        <div className="text-sm text-slate-800 truncate">{selected.video.title}</div>
                        <div className="text-xs text-slate-400">Watch on YouTube</div>
                      </div>
                      <ArrowRight size={16} className="ml-auto text-slate-300 shrink-0" />
                    </a>
                  )}

                  {selected.videos && selected.videos.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs text-slate-400">More videos found for you</div>
                      {selected.videos.map((v, i) => (
                        <a key={i} href={v.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 text-sm">
                          <Youtube size={15} className="text-red-500 shrink-0" />
                          <span className="text-slate-700 truncate">{v.title}</span>
                          <ArrowRight size={14} className="ml-auto text-slate-300 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    {selected.content
                      ? <MarkdownLite text={selected.content} />
                      : (
                        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 bg-white">
                          <BookOpen className="mx-auto text-slate-300 mb-3" size={28} />
                          <div className="text-slate-500 text-sm mb-4">This lesson is in the plan but not written yet.</div>
                          <button onClick={() => generate(selected)} disabled={genBusy}
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                            {genBusy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {genBusy ? "Writing the lesson" : "Write this lesson"}
                          </button>
                        </div>
                      )}
                  </div>
                </>
              ) : <div className="text-slate-400">Select a lesson from the left.</div>}
            </div>
          </div>
        )}

        {/* ask view */}
        {view === "ask" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                {doubts.length === 0 ? (
                  <div className="text-center py-10">
                    <Sparkles className="mx-auto text-indigo-300 mb-3" size={28} />
                    <div className="font-serif text-xl text-slate-800">Ask anything about music or your voice</div>
                    <div className="text-sm text-slate-500 mt-1 mb-5">
                      Buddy answers, then files it into the lesson where it fits, or creates a new one for you.
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {examples.map((ex) => (
                        <button key={ex} onClick={() => setQuestion(ex)}
                          className="text-sm px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-indigo-300">
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {doubts.map((d) => (
                      <div key={d.id}>
                        <div className="flex justify-end">
                          <div className="bg-indigo-600 text-white text-sm rounded-2xl rounded-br-sm px-3.5 py-2 max-w-md">{d.q}</div>
                        </div>
                        <div className="mt-3">
                          {d.pending ? (
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Loader2 size={15} className="animate-spin" /> Thinking and filing this away
                            </div>
                          ) : (
                            <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-4">
                              <MarkdownLite text={d.a} />
                              {d.placementText && (
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                                    <Plus size={12} /> {d.placementText}
                                  </span>
                                  {d.targetLessonId && (
                                    <button onClick={() => selectLesson(d.targetLessonId)}
                                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                                      Open lesson <ArrowRight size={12} />
                                    </button>
                                  )}
                                  <button onClick={() => findVideosForDoubt(d)} disabled={vidBusy === d.id}
                                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 disabled:opacity-60">
                                    {vidBusy === d.id ? <Loader2 size={12} className="animate-spin" /> : <Youtube size={12} />} Find videos
                                  </button>
                                </div>
                              )}
                              {d.videos && d.videos.length > 0 && (
                                <div className="mt-2 space-y-1.5">
                                  {d.videos.map((v, i) => (
                                    <a key={i} href={v.url} target="_blank" rel="noreferrer"
                                      className="flex items-center gap-2 text-sm text-slate-700 hover:text-indigo-600">
                                      <Youtube size={14} className="text-red-500 shrink-0" />
                                      <span className="truncate">{v.title}</span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={askEndRef} />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-3">
              <div className="max-w-2xl mx-auto flex items-end gap-2">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
                  rows={1}
                  placeholder="Ask a doubt, e.g. What is an arpeggio?"
                  className="flex-1 resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-400 max-h-32"
                />
                <button onClick={ask} disabled={busy || !question.trim()}
                  className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 shrink-0">
                  {busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
