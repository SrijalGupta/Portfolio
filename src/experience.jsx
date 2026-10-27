import React, { useEffect, useMemo, useRef, useState } from "react";

const commands = ["help", "whoami", "about", "projects", "open", "skills", "education", "experience", "github", "resume", "contact", "recruiter", "theme", "history", "clear", "restart", "matrix", "joke", "sudo hire-srijal", "ls", "pwd", "cat", "cd"];

export function Terminal({ profile, skills, education, projects, hackathons, apiRef, onOpenProject, onThemeChange }) {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([{ kind: "output", text: "Welcome to Srijal's portfolio terminal. Type `help` or try a suggested command." }]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [cwd, setCwd] = useState("/");
  const [terminalTheme, setTerminalTheme] = useState("dark");
  const [matrix, setMatrix] = useState(false);
  const [showBoot, setShowBoot] = useState(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try { return sessionStorage.getItem("portfolio-boot-seen") !== "yes"; } catch { return false; }
  });
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [entries]);

  useEffect(() => {
    if (!showBoot) return undefined;
    const timer = window.setTimeout(dismissBoot, 1250);
    return () => window.clearTimeout(timer);
  }, [showBoot]);

  function dismissBoot() {
    setShowBoot(false);
    try { sessionStorage.setItem("portfolio-boot-seen", "yes"); } catch { /* session storage is optional */ }
  }

  function runCommand(raw) {
    const source = raw.trim();
    if (!source) return;
    const [command, ...args] = source.split(/\s+/);
    const verb = command.toLowerCase();
    const arg = args.join(" ").toLowerCase();
    setHistory((items) => [...items, source]);
    setHistoryIndex(history.length + 1);
    setInput("");

    if (verb === "clear") {
      setEntries([]);
      return;
    }
    if (verb === "restart") {
      setCwd("/");
      setEntries([{ kind: "output", text: "Workspace restarted. Type `help` to see what you can explore." }]);
      return;
    }

    let result = { text: "" };
    if (verb === "help") result = { text: "Available commands\nhelp · whoami · about · projects · open <project>\nskills · education · experience · recruiter\ngithub · resume · contact · theme <light|dark>\nhistory · clear · restart · matrix · joke · sudo hire-srijal\nVirtual files: ls · pwd · cat <file> · cd projects\nExamples: open bughunt · cat skills.json · theme dark" };
    else if (verb === "whoami") result = { text: `${profile.name}\nSecond-year Computer Science and Engineering student at BMSIT, Bengaluru.` };
    else if (verb === "about") result = { text: profile.about.join("\n\n") };
    else if (verb === "projects" && !arg) result = { text: "Select a project to explore:", buttons: projects.map((item) => ({ label: item.name, run: () => onOpenProject(item) })) };
    else if (verb === "open") {
      const name = arg.replace(/^projects\//, "").replace(/\/$/, "").replaceAll("-", " ");
      const item = [...projects, ...hackathons].find((project) => project.name.toLowerCase() === name || project.name.toLowerCase().replaceAll(" ", "-") === arg.replace(/^projects\//, "").replace(/\/$/, ""));
      if (item) {
        result = { text: `Opening ${item.name}…` };
        onOpenProject(item);
      } else result = { text: `I couldn't find “${args.join(" ") || ""}”. Try the projects command to see available projects.` };
    }
    else if (verb === "skills") result = { text: skills.map((group) => `${group.group}\n  ${group.items.map((skill) => skill.name).join(" · ")}`).join("\n\n") };
    else if (verb === "education") result = { text: education.map((item) => `${item.school}\n${item.credential} · ${item.date} · ${item.result}`).join("\n\n") };
    else if (verb === "experience") result = { text: `No internships or employment roles are listed.\n\nHackathon concepts\n${hackathons.map((item) => `${item.name} — ${item.event} (${item.meta})`).join("\n")}\n\nThese are concepts, not deployed systems.` };
    else if (verb === "github") result = { text: "Open the GitHub profile:", links: [{ label: "github.com/SrijalGupta", href: profile.links.github }] };
    else if (verb === "resume") result = { text: "Download the current resume:", links: [{ label: "resume.pdf", href: "/resume.pdf", download: true }] };
    else if (verb === "contact") result = { text: `${profile.email}\n${profile.phone}\n${profile.location}`, links: [{ label: "Go to contact form", href: "#contact" }] };
    else if (verb === "recruiter") result = { text: `${profile.name} · CSE student · BMSIT, Bengaluru\nCGPA 9.18/10 · Expected graduation 2029\nFocus: full-stack development, applied AI, and problem-solving.\nExplore the projects, download the resume, or get in touch.`, links: [{ label: "Resume", href: "/resume.pdf", download: true }, { label: "Contact", href: "#contact" }] };
    else if (verb === "theme") {
      if (!["light", "dark"].includes(arg)) result = { text: `Current terminal theme: ${terminalTheme}. Use “theme light” or “theme dark”.` };
      else {
        setTerminalTheme(arg);
        onThemeChange(arg);
        result = { text: `Theme changed to ${arg}.` };
      }
    }
    else if (verb === "history") result = { text: history.length ? history.map((item, index) => `${index + 1}  ${item}`).join("\n") : "No previous commands yet." };
    else if (verb === "matrix") {
      setMatrix(true);
      window.setTimeout(() => setMatrix(false), 1800);
      result = { text: "A little code rain. Back to the work in a moment…" };
    }
    else if (verb === "joke") result = { text: "Why do programmers prefer dark mode? Because light attracts bugs." };
    else if (verb === "sudo" && arg === "hire-srijal") result = { text: "Permission granted: let's talk about the role.\nNo root access required.", links: [{ label: "Download resume", href: "/resume.pdf", download: true }, { label: "Contact Srijal", href: "#contact" }] };
    else if (verb === "sudo") result = { text: "This is a simulated portfolio terminal. Try `sudo hire-srijal`." };
    else if (verb === "pwd") result = { text: cwd };
    else if (verb === "ls") {
      const entriesInDirectory = cwd === "/" ? ["about.txt", "skills.json", "resume.pdf", "projects/", "contact.txt"] : ["namma-raksha/", "expense-tracker/", "bughunt/"];
      result = { text: "Select a file or folder:", buttons: entriesInDirectory.map((file) => ({ label: file, run: () => {
        if (file.endsWith("/")) runCommand(cwd === "/" ? `cd ${file.slice(0, -1)}` : `open projects/${file.slice(0, -1)}`);
        else if (file === "resume.pdf") runCommand("resume");
        else runCommand(cwd === "/" ? `cat ${file}` : `open projects/${file.replace(/\/$/, "")}`);
      } })) };
    }
    else if (verb === "cd") {
      if (["projects", "projects/"].includes(arg) && cwd === "/") { setCwd("/projects"); result = { text: "Now browsing /projects" }; }
      else if (["..", "/", "~"].includes(arg)) { setCwd("/"); result = { text: "Now browsing /" }; }
      else result = { text: "Available folders: `projects` or `..`." };
    }
    else if (verb === "cat") {
      const file = arg.replace(/^\//, "");
      if (["about.txt", "./about.txt"].includes(file)) result = { text: profile.about.join("\n\n") };
      else if (["contact.txt", "./contact.txt"].includes(file)) result = { text: `${profile.email}\n${profile.phone}\n${profile.location}` };
      else if (["skills.json", "./skills.json"].includes(file)) result = { text: JSON.stringify(Object.fromEntries(skills.map((group) => [group.group, group.items.map((skill) => skill.name)])), null, 2) };
      else if (["resume.pdf", "./resume.pdf"].includes(file)) result = { text: "Resume file:", links: [{ label: "/resume.pdf", href: "/resume.pdf", download: true }] };
      else result = { text: "File not found. Use `ls` to see the available portfolio files." };
    }
    else {
      const suggestions = commands.filter((item) => item.startsWith(verb)).slice(0, 3);
      result = { text: `Command not found: ${verb}.${suggestions.length ? ` Try: ${suggestions.join(", ")}` : " Type `help` to see commands."}` };
    }

    setEntries((items) => [...items, { kind: "command", text: source }, { kind: "output", ...result }]);
  }

  useEffect(() => {
    if (apiRef) apiRef.current = { runCommand, focus: () => inputRef.current?.focus() };
  });

  function handleKeyDown(event) {
    if (event.key === "Enter") { event.preventDefault(); runCommand(input); }
    if (event.key === "ArrowUp") { event.preventDefault(); const next = Math.max(0, historyIndex - 1); setHistoryIndex(next); setInput(history[next] || ""); }
    if (event.key === "ArrowDown") { event.preventDefault(); const next = Math.min(history.length, historyIndex + 1); setHistoryIndex(next); setInput(history[next] || ""); }
    if (event.key === "Tab") {
      event.preventDefault();
      const prefix = input.toLowerCase();
      const match = commands.find((item) => item.startsWith(prefix));
      if (match) setInput(`${match}${match === "open" || match === "cat" || match === "cd" || match === "theme" ? " " : ""}`);
    }
  }

  return <section className="terminal-section section-shell reveal" id="terminal" aria-labelledby="terminal-title">
    <div className="terminal-intro"><div><p className="eyebrow">A LITTLE SOMETHING TO EXPLORE</p><h2 id="terminal-title">Take the <span>command line.</span></h2></div><p>Type a command, use the suggestions, or press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search the portfolio.</p></div>
    <div className={`portfolio-terminal ${terminalTheme}`}>
      {matrix && <div className="matrix-rain" aria-hidden="true"><span>0101<br />1001<br />0110<br />1010</span><span>1100<br />0110<br />1001<br />0101</span><span>0011<br />1010<br />1101<br />0010</span></div>}
      <div className="terminal-bar"><div className="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></div><span>srijal@portfolio:~{cwd === "/" ? "" : cwd.slice(1)}$</span><div className="terminal-controls"><button type="button" onClick={() => setEntries([])} aria-label="Clear terminal output">Clear</button><button type="button" onClick={() => runCommand("restart")} aria-label="Restart terminal">Restart</button></div></div>
      <div className="terminal-output" ref={outputRef} aria-live="polite" aria-label="Terminal output">
        {showBoot && <div className="terminal-boot" role="status"><div><span>Initializing portfolio...</span><span>Loading developer profile... <b>[OK]</b></span><span>Preparing selected projects... <b>[OK]</b></span><strong>Welcome to my workspace.</strong></div><button type="button" onClick={dismissBoot}>Skip intro</button></div>}
        {entries.map((entry, index) => entry.kind === "command" ? <div className="terminal-command" key={`${index}-${entry.text}`}><span>srijal@portfolio</span>:<b>{cwd}</b>$ {entry.text}</div> : <div className="terminal-result" key={`${index}-${entry.text?.slice(0, 15) || "result"}`}>
          {entry.text && <pre>{entry.text}</pre>}
          {entry.links?.length > 0 && <div className="terminal-result-links">{entry.links.map((link) => <a key={link.label} href={link.href} download={link.download} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>{link.label} ↗</a>)}</div>}
          {entry.buttons?.length > 0 && <div className="terminal-result-links">{entry.buttons.map((button) => <button key={button.label} type="button" onClick={button.run}>{button.label} ↗</button>)}</div>}
        </div>)}
      </div>
      <form className="terminal-input-row" onSubmit={(event) => { event.preventDefault(); runCommand(input); }}>
        <label htmlFor="terminal-command"><span>srijal@portfolio:~$</span><span className="sr-only">Enter a portfolio terminal command</span></label>
        <input id="terminal-command" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} autoComplete="off" spellCheck="false" aria-label="Terminal command" placeholder="type help and press Enter" />
        <span className="terminal-cursor" aria-hidden="true"></span>
      </form>
    </div>
    <div className="terminal-suggestions" aria-label="Suggested terminal commands">{["help", "projects", "skills", "recruiter", "contact"].map((command) => <button type="button" key={command} onClick={() => runCommand(command)}>{command}</button>)}</div>
  </section>;
}

export function CommandPalette({ open, onClose, profile, projects, skills, terminalApi, onOpenProject }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const closeCallback = useRef(onClose);
  const previousOverflow = useRef("");
  closeCallback.current = onClose;
  const items = useMemo(() => [
    ...["about", "education", "projects", "skills", "hackathons", "contact", "terminal"].map((name) => ({ label: `Go to ${name}`, detail: "Section", type: "section", value: name })),
    ...commands.map((name) => ({ label: `Run ${name}`, detail: "Terminal command", type: "command", value: name })),
    ...projects.map((project) => ({ label: `Open ${project.name}`, detail: "Project case study", type: "project", value: project })),
    ...skills.flatMap((group) => group.items.map((skill) => ({ label: skill.name, detail: group.group, type: "skill", value: "skills" }))),
    { label: "GitHub profile", detail: profile.links.github, type: "external", value: profile.links.github },
  ], [profile, projects, skills]);
  const filtered = items.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase())).slice(0, 9);

  useEffect(() => {
    if (!open) {
      setQuery(""); setActive(0);
      previousFocus.current?.focus?.();
      return undefined;
    }
    previousFocus.current = document.activeElement;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const closeOnEscape = (event) => { if (event.key === "Escape") closeCallback.current(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow.current;
    };
  }, [open]);

  function choose(item) {
    if (!item) return;
    onClose();
    if (item.type === "section" || item.type === "skill") document.getElementById(item.value)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (item.type === "project") onOpenProject(item.value);
    if (item.type === "command") { terminalApi.current?.runCommand(item.value); document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" }); window.setTimeout(() => terminalApi.current?.focus(), 80); }
    if (item.type === "external") window.open(item.value, "_blank", "noopener,noreferrer");
  }

  if (!open) return null;
  return <div className="palette-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="command-palette" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="palette-title" onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const focusable = [...dialogRef.current.querySelectorAll("input, button:not([disabled])")];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
    }}>
      <h2 id="palette-title" className="sr-only">Search the portfolio</h2>
      <div className="palette-search"><span aria-hidden="true">⌕</span><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setActive((index) => Math.min(filtered.length - 1, index + 1)); } if (event.key === "ArrowUp") { event.preventDefault(); setActive((index) => Math.max(0, index - 1)); } if (event.key === "Enter") { event.preventDefault(); choose(filtered[active]); } }} placeholder="Search sections, skills, projects, commands…" aria-label="Search the portfolio" /><kbd>ESC</kbd><button className="palette-close" type="button" onClick={onClose} aria-label="Close search">×</button></div>
      <div className="palette-results" role="listbox">{filtered.length ? filtered.map((item, index) => <button className={index === active ? "palette-result active" : "palette-result"} role="option" aria-selected={index === active} key={`${item.type}-${item.label}`} onMouseEnter={() => setActive(index)} onClick={() => choose(item)}><span>{item.label}</span><small>{item.detail}</small><kbd>↵</kbd></button>) : <p className="palette-empty">No matches. Try a section, project, or command.</p>}</div>
      <div className="palette-hint"><span>↑↓ navigate</span><span>↵ open</span><span>Esc close</span><span className="palette-brand">PORTFOLIO INDEX</span></div>
    </section>
  </div>;
}

export function CaseStudyDialog({ item, onClose }) {
  const dialogRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(0);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !item) return undefined;
    if (!dialog.open) dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, [item]);
  useEffect(() => setSelectedNode(0), [item]);
  if (!item) return null;
  const concept = Boolean(item.event);
  return <dialog className="case-dialog" ref={dialogRef} onClose={onClose}>
    <div className="case-dialog-top"><span className="case-kicker">{concept ? `${item.event} · CONCEPT` : item.status.toUpperCase()}</span><button type="button" onClick={onClose} aria-label="Close project details">×</button></div>
    <div className="case-dialog-content"><p className="eyebrow">{concept ? item.subtitle : item.subtitle}</p><h2>{item.name}</h2><p className="case-summary">{item.description || item.summary}</p>
      <div className="case-facts"><div><h3>{concept ? "Concept problem" : "Problem addressed"}</h3><p>{item.problem || item.description || item.summary}</p></div><div><h3>Intended users</h3><p>{item.audience || "Not specified yet."}</p></div><div><h3>{concept ? "Concept contribution" : "My contribution"}</h3><p>{item.contribution || (concept ? item.meta : "Personal implementation details are not documented yet.")}</p></div><div><h3>Technologies</h3><p className="case-note">Technologies used are not specified. Add only the actual project stack.</p></div></div>
      {!concept && <><div className="case-facts"><div><h3>Current state</h3><p>{item.built?.length ? item.built.join(" · ") : "No implemented features are documented yet."}</p></div><div><h3>Planned work</h3><p>{item.planned?.length ? item.planned.join(" · ") : "No additional planned features listed."}</p></div><div><h3>Engineering decisions</h3><p className="case-note">Add confirmed implementation decisions as the project develops.</p></div><div><h3>Challenges &amp; lessons</h3><p className="case-note">Add your real challenges and lessons learned.</p></div></div></>}
      <h3>{concept ? "Proposed concept flow" : "Architecture"}</h3><p className="case-note">{concept ? "Illustrative only — this flow describes a concept, not an implemented system." : "Architecture details are not documented yet."}</p>
      {item.architecture?.length ? <><div className="architecture-flow" aria-label={concept ? "Proposed concept flow" : "Project architecture"}>{item.architecture.map((node, index) => <React.Fragment key={node.name}><button type="button" aria-pressed={selectedNode === index} onClick={() => setSelectedNode(index)}>{node.name}</button>{index < item.architecture.length - 1 && <i aria-hidden="true">→</i>}</React.Fragment>)}</div><div className="architecture-detail"><strong>{item.architecture[selectedNode]?.name}</strong><p>{item.architecture[selectedNode]?.description}</p><small>Technology details: not specified.</small></div></> : <div className="architecture-flow pending-flow"><span>Architecture notes</span><i>→</i><span>to be added</span><small>Details pending</small></div>}
      <p className="case-note">Screenshots and implementation lessons can be added as they become available.</p>
      <div className="case-actions">{item.github && <a href={item.github} target="_blank" rel="noreferrer">GitHub ↗</a>}{item.demo && <a href={item.demo} target="_blank" rel="noreferrer">Live demo ↗</a>}<a href="/resume.pdf" download>Resume ↓</a></div>
    </div>
  </dialog>;
}

export function RecruiterDialog({ open, onClose, profile, education, skills }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return undefined;
    if (!dialog.open) dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, [open]);
  if (!open) return null;
  const currentEducation = education[0];
  const keySkills = skills.map((group) => `${group.group}: ${group.items.slice(0, 4).map((item) => item.name).join(", ")}`);
  return <dialog className="case-dialog recruiter-dialog" ref={dialogRef} onClose={onClose}>
    <div className="case-dialog-top"><span className="case-kicker">30-SECOND PROFILE</span><button type="button" onClick={onClose} aria-label="Close recruiter view">×</button></div>
    <div className="case-dialog-content"><p className="eyebrow">RECRUITER VIEW</p><h2>{profile.name}</h2><p className="case-summary">Second-year CSE student interested in software engineering internships, full-stack development, applied AI, and problem-solving.</p>
      <div className="case-facts"><div><h3>Education</h3><p>{currentEducation.credential}, {currentEducation.school}<br />{currentEducation.result} · Expected {currentEducation.date.split("–")[1]?.split(" ")[0]}</p></div><div><h3>Technical toolkit</h3><p>{keySkills.join("\n")}</p></div><div><h3>Selected work</h3><p>Expense Tracker · BugHunt · AI Study Buddy</p></div><div><h3>Hackathons</h3><p>Namma Raksha · P2P + EcoPrint — concepts</p></div></div>
      <div className="case-actions"><a href="/resume.pdf" download>Download resume ↓</a><a href={profile.links.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="#contact" onClick={onClose}>Contact ↗</a></div>
    </div>
  </dialog>;
}

export function DebugChallenge() {
  const challenges = [
    { title: "Catch the off-by-one", code: "for (let i = 0; i <= items.length; i++) {\n  console.log(items[i]);\n}", options: ["Change <= to <", "Start i at 1", "Remove the loop"], answer: 0, hint: "An array's final valid index is one less than its length." },
    { title: "Choose a strict check", code: "if (userInput == expected) {\n  return 'matched';\n}", options: ["Use === for a strict comparison", "Change return to break", "Remove the condition"], answer: 0, hint: "Strict equality avoids implicit type conversion." },
  ];
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selection, setSelection] = useState(-1);
  const [showHint, setShowHint] = useState(false);
  const challenge = challenges[challengeIndex];
  const solved = selection === challenge.answer;
  return <section className="debug-challenge section-shell reveal" id="debug-challenge" aria-labelledby="debug-title"><div className="game-copy"><p className="eyebrow">OPTIONAL · NO CODE EXECUTION</p><h2 id="debug-title">Find the <span>bug.</span></h2><p>A tiny debugging exercise. Pick the fix; the answer is checked against a predefined choice.</p><button type="button" className="button button-quiet" onClick={() => setShowHint((value) => !value)}>{showHint ? "Hide hint" : "Show hint"}</button>{showHint && <p className="game-hint">Hint: {challenge.hint}</p>}</div><div className="game-panel"><div className="game-bar"><span>debug-challenge.js</span><span>{String(challengeIndex + 1).padStart(2, "0")} / 02</span></div><h3>{challenge.title}</h3><pre><code>{challenge.code}</code></pre><div className="game-options">{challenge.options.map((option, index) => <button type="button" key={option} className={selection === index ? (solved ? "correct" : "incorrect") : ""} onClick={() => setSelection(index)}>{String.fromCharCode(65 + index)}. {option}</button>)}</div>{selection >= 0 && <p className={solved ? "game-feedback correct-text" : "game-feedback"} role="status">{solved ? "Correct. Nice catch." : "Not quite. Try another fix or reveal a hint."}</p>}<button type="button" className="game-next" onClick={() => { setChallengeIndex((index) => (index + 1) % challenges.length); setSelection(-1); setShowHint(false); }}>Another challenge ↗</button></div></section>;
}
