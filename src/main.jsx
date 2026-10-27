import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { education, hackathons, navigation, profile, projects, skillFoundations, skills, spokenLanguages } from "./data.js";
import { CaseStudyDialog, CommandPalette, DebugChallenge, RecruiterDialog, Terminal } from "./experience.jsx";
import "./styles.css";
import "./experience.css";

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    github: <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.2-1.5 6.2-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.2-.4-3.8 1.4a13.2 13.2 0 0 0-6.9 0C5.5 1.1 4.3 1.5 4.3 1.5a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.7V22"/></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7m0-10v.01M12 17v-4a3 3 0 0 1 6 0v4m-6-4v4"/></>,
    leetcode: <><path d="m16 18 4-4-4-4M8 6l-4 6 4 6m5-13-2 14"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6.5" r=".8" fill="currentColor" stroke="none"/></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    moon: <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/>,
    chevron: <path d="m6 9 6 6 6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

const codeExamples = [
  { file: "theme.js", code: 'const toggleTheme = (theme) =>\n  theme === "dark" ? "light" : "dark";' },
  { file: "learning.js", code: 'const focus = ["full-stack", "applied AI"];\nfocus.forEach((skill) => keepLearning(skill));' },
];

function highlightLine(line) {
  const tokenPattern = /(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|\b(?:const|let|var|return|function|if|else|async|await)\b|\b\d+\b|=>|[{}()[\].,;])/g;
  return line.split(tokenPattern).filter(Boolean).map((token, index) => {
    let kind = "code-plain";
    if (/^(\"|'|`)/.test(token)) kind = "code-string";
    else if (/^(const|let|var|return|function|if|else|async|await)$/.test(token)) kind = "code-keyword";
    else if (/^\d+$/.test(token)) kind = "code-number";
    else if (token === "=>") kind = "code-operator";
    else if (/^[{}()[\].,;]$/.test(token)) kind = "code-punctuation";
    return <span className={kind} key={`${index}-${token}`}>{token}</span>;
  });
}

function CodeEditor() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const example = codeExamples[exampleIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setTypedCount(example.code.length);
      return undefined;
    }

    if (typedCount >= example.code.length) {
      const pause = window.setTimeout(() => {
        setExampleIndex((index) => (index + 1) % codeExamples.length);
        setTypedCount(0);
      }, 1800);
      return () => window.clearTimeout(pause);
    }

    const typing = window.setTimeout(() => setTypedCount((count) => count + 1), 27);
    return () => window.clearTimeout(typing);
  }, [example.code, reducedMotion, typedCount]);

  const visibleCode = example.code.slice(0, typedCount);
  const lines = visibleCode.split("\n");
  const currentLine = lines.length - 1;

  return <div className="code-editor" role="img" aria-label="Decorative JavaScript code preview. It types and cycles through short examples." aria-live="off">
    <div className="editor-topbar"><div className="editor-controls" aria-hidden="true"><i></i><i></i><i></i></div><span className="editor-filename">{example.file}</span><span className="editor-language">JS</span></div>
    <pre className="editor-code" aria-hidden="true"><code>{lines.map((line, index) => <span className={`editor-line ${index <= currentLine ? "line-visible" : ""}`} key={`${example.file}-${index}`}><span className="line-number">{index + 1}</span><span className="line-content">{highlightLine(line)}{index === currentLine && !reducedMotion && <i className="typing-cursor" />}</span></span>)}</code></pre>
    <div className="editor-footer"><span><i className="editor-ready-dot"></i> Ready to build</span><span>JavaScript</span></div>
  </div>;
}

function SkillIcon({ name }) {
  if (name === "github") return <Icon name="github" size={29} />;
  const letters = { c: "C", cpp: "C++", javascript: "JS", django: "Dj", pandas: "pd", ai: "AI", prompt: "{ }", npm: "npm" };
  if (letters[name]) return <svg className={`skill-mark mark-${name}`} viewBox="0 0 40 40" aria-hidden="true"><text x="20" y="26" textAnchor="middle">{letters[name]}</text></svg>;

  const drawings = {
    python: <><path d="M20 4c-8 0-9 2-9 6v4h12v2H9c-4 0-5 3-5 7s2 6 6 6h4v-5c0-4 3-6 7-6h4c3 0 5-2 5-5V9c0-4-3-5-10-5Z"/><circle cx="17" cy="9" r="1.4" className="skill-icon-cutout"/><path d="M20 36c8 0 9-2 9-6v-4H17v-2h14c4 0 5-3 5-7s-2-6-6-6h-4v5c0 4-3 6-7 6h-4c-3 0-5 2-5 5v4c0 4 3 5 10 5Z" opacity=".62"/></>,
    sql: <><ellipse cx="20" cy="9" rx="11" ry="4"/><path d="M9 9v7c0 2 5 4 11 4s11-2 11-4V9M9 16v7c0 2 5 4 11 4s11-2 11-4v-7M9 23v7c0 2 5 4 11 4s11-2 11-4v-7"/></>,
    html: <><path d="M8 4h24l-2.2 27L20 35l-9.8-4L8 4Z"/><path d="M14 11h13l-.5 4H14.5l.4 4h11.8l-.9 8-5.8 2-5.8-2-.4-4h4l.2 1.2 2 .7 2-.7.3-2.2h-8.3L14 11Z" className="skill-icon-cutout"/></>,
    css: <><path d="M8 4h24l-2.2 27L20 35l-9.8-4L8 4Z"/><path d="M14 11h13l-.4 4h-8.2l.3 3h7.6l-.9 9-5.4 2-5.7-2-.4-4h4l.2 1.2 2 .7 1.7-.7.3-2.3h-8L14 11Z" className="skill-icon-cutout"/></>,
    react: <><ellipse cx="20" cy="20" rx="16" ry="6.5"/><ellipse cx="20" cy="20" rx="16" ry="6.5" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="16" ry="6.5" transform="rotate(120 20 20)"/><circle cx="20" cy="20" r="2.6" className="skill-icon-solid"/></>,
    responsive: <><rect x="5" y="7" width="22" height="19" rx="2"/><path d="M10 30h12M11 12h10M11 16h7"/><rect x="29" y="14" width="7" height="13" rx="1.5"/></>,
    node: <><path d="m20 3 14 8v17l-14 8-14-8V11l14-8Z"/><text x="20" y="23" textAnchor="middle" className="skill-icon-word">JS</text></>,
    api: <><circle cx="9" cy="10" r="3"/><circle cx="31" cy="10" r="3"/><circle cx="20" cy="30" r="3"/><path d="m12 12 6 14m10-14-6 14M12 10h16"/></>,
    postgresql: <><path d="M8 29c-2-5-2-13 2-18 3-4 11-4 16-2 4 2 6 7 5 13l-2 6h-6l-1-5-3 1-2 7h-5l-1-5-3 3Z"/><path d="M22 10c3 0 5 2 5 5s-2 5-5 5m-1-10v6m6-5 3-3"/></>,
    mongodb: <><path d="M20 4c-1 7-6 10-6 17a6 6 0 0 0 12 0c0-7-5-10-6-17Z"/><path d="M20 13v18"/></>,
    analysis: <><path d="M7 30V19m9 11V10m9 20V15m8 15V6"/><path d="m6 13 9-5 9 4 9-7"/></>,
    numpy: <><path d="m20 4 15 8.5v15L20 36 5 27.5v-15L20 4Z"/><path d="m12 24 8-13 8 13h-5l-3-5-3 5h-5Zm4 5 4-7 4 7h-8Z"/></>,
    git: <><path d="M20 4 36 20 20 36 4 20 20 4Z"/><circle cx="15" cy="15" r="2"/><circle cx="25" cy="25" r="2"/><path d="M15 17v7c0 2 2 3 4 3h4m-2-2 4 0v-4"/></>,
    vscode: <><path d="m28 5 8 4v22l-8 4-17-13 5-4L28 27V13l-12 9-5-4L28 5Z"/><path d="m5 14 5-4 5 4-5 4-5-4Zm0 12 5-4 5 4-5 4-5-4Z"/></>,
    vite: <><path d="M5 8 20 4l15 4-15 28L5 8Z"/><path d="m22 11-8 12h6l-2 8 9-13h-6l1-7Z" className="skill-icon-cutout"/></>,
  };
  const filled = ["html", "css", "node", "postgresql", "mongodb", "numpy", "vite"];
  return <svg className={`skill-icon ${filled.includes(name) ? "is-filled" : ""}`} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[name]}</svg>;
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(() => {
    const slug = window.location.hash.startsWith("#project/") ? window.location.hash.slice("#project/".length) : "";
    return slug ? [...projects, ...hackathons].find((item) => item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === slug) || null : null;
  });
  const [recruiterOpen, setRecruiterOpen] = useState(false);
  const [recentProjects, setRecentProjects] = useState([]);
  const [visitedSections, setVisitedSections] = useState([]);
  const [activeSection, setActiveSection] = useState("top");
  const [skillFilter, setSkillFilter] = useState("All");
  const terminalApi = useRef(null);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    const sections = ["top", ...navigation.map((item) => item.toLowerCase())]
      .map((id) => document.getElementById(id)).filter(Boolean);
    if (!("IntersectionObserver" in window)) {
      setVisitedSections(sections.map((section) => section.id));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        setActiveSection(id);
        setVisitedSections((seen) => seen.includes(id) ? seen : [...seen, id]);
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeSection === "skills") document.querySelectorAll(".skill-group.reveal").forEach((group) => group.classList.add("is-visible"));
  }, [activeSection, skillFilter]);

  function openCaseStudy(item) {
    setActiveCase(item);
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    window.history.replaceState(null, "", `#project/${slug}`);
    if (item && !item.event) setRecentProjects((recent) => [item, ...recent.filter((project) => project.name !== item.name)].slice(0, 3));
  }

  function closeCaseStudy() {
    setActiveCase(null);
    if (window.location.hash.startsWith("#project/")) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  useEffect(() => {
    const progress = document.querySelector(".reading-progress span");
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
      });
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    const revealItems = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach((item) => observer.observe(item));
      return () => {
        window.removeEventListener("scroll", updateProgress);
        cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }

    return () => {
      window.removeEventListener("scroll", updateProgress);
      cancelAnimationFrame(frame);
    };
  }, []);

  const social = [
    { label: "GitHub", href: profile.links.github, icon: "github" },
    { label: "LinkedIn", href: profile.links.linkedin, icon: "linkedin" },
    { label: "LeetCode", href: profile.links.leetcode, icon: "leetcode" },
    { label: "Instagram", href: profile.links.instagram, icon: "instagram" },
  ];

  async function sendMessage(event) {
    event.preventDefault();
    if (!profile.formspreeEndpoint) {
      setFormStatus("unconfigured");
      return;
    }

    const formElement = event.currentTarget;
    setFormStatus("sending");
    try {
      const response = await fetch(profile.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(formElement),
      });
      if (!response.ok) throw new Error("Form submission failed");
      formElement.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="reading-progress" aria-hidden="true"><span></span></div>
    <header className="site-header">
      <div className="nav-wrap">
        <a className="brand" href="#top" aria-label={`${profile.name}, home`}><span className="brand-mark">SG</span><span>Srijal Gupta<span className="brand-period">.</span></span></a>
        <button className="menu-toggle" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span><span></span></button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {navigation.map((item) => <a key={item} href={`#${item.toLowerCase()}`} aria-current={activeSection === item.toLowerCase() ? "location" : undefined} onClick={() => setMenuOpen(false)}>{item}</a>)}
          <a className="nav-resume" href="/resume.pdf" download>Resume <Icon name="arrow" size={14} /></a>
        </nav>
        <button className="palette-trigger" type="button" onClick={() => setPaletteOpen(true)} aria-label="Search portfolio with command palette">Search <kbd>Ctrl K</kbd></button>
        <span className="nav-discovery" aria-live="polite">{visitedSections.length} explored</span>
        <button className="theme-toggle" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><Icon name={theme === "dark" ? "sun" : "moon"} size={18} /></button>
      </div>
    </header>

    <main id="main">
      <section className="hero section-shell" id="top" aria-labelledby="hero-title">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span className="status-dot"></span> COMPUTER SCIENCE &amp; ENGINEERING</p>
          <h1 id="hero-title">Srijal Prasad<br /><span>Gupta</span></h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <p className="location"><Icon name="pin" size={16} /> {profile.location}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">View Projects <Icon name="arrow" size={16} /></a>
            <a className="button button-quiet" href="/resume.pdf" download>Download Resume <span className="download-mark" aria-hidden="true">↓</span></a>
            <a className="button button-text" href="#contact">Contact <span aria-hidden="true">↗</span></a>
            <button className="button button-text recruiter-shortcut" type="button" onClick={() => setRecruiterOpen(true)}>Recruiter view <span aria-hidden="true">↗</span></button>
          </div>
          <div className="social-links" aria-label="Social profiles">
            {social.map((item) => <a href={item.href} key={item.label} aria-label={`${item.label} (opens in a new tab)`} target="_blank" rel="noreferrer"><Icon name={item.icon} size={18} /><span>{item.label}</span></a>)}
          </div>
        </div>
        <div className="hero-aside reveal" aria-label="Profile portrait">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <figure className="portrait-frame"><img src="/srijal-gupta.jpg" alt="Portrait of Srijal Prasad Gupta" fetchPriority="high" /></figure>
          <CodeEditor />
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><Icon name="chevron" size={15} /></a>
      </section>

      <Terminal profile={profile} skills={skills} education={education} projects={projects} hackathons={hackathons} apiRef={terminalApi} onOpenProject={openCaseStudy} onThemeChange={setTheme} />
      <DebugChallenge />

      <section className="content-section section-shell reveal" id="about" aria-labelledby="about-title">
        <SectionHeading number="01" kicker="A LITTLE ABOUT ME" title="About" id="about-title" />
        <div className="about-content"><div className="section-lead">Learning the fundamentals.<br /><span>Building what’s next.</span></div><div className="about-copy">{profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a href="#education" className="inline-link">A bit more about my journey <span aria-hidden="true">↘</span></a></div></div>
      </section>

      <section className="content-section section-shell reveal" id="education" aria-labelledby="education-title">
        <SectionHeading number="02" kicker="THE FOUNDATION" title="Education" id="education-title" />
        <div className="education-list">{education.map((item, i) => <article className="education-item" key={item.school}><div className="timeline-index"><span>{String(i + 1).padStart(2, "0")}</span><i className={item.current ? "timeline-dot current" : "timeline-dot"}></i></div><div className="education-main"><div className="education-title-row"><h3>{item.school}</h3>{item.current && <span className="current-label">CURRENT</span>}</div><p>{item.credential}</p><span className="education-place">{item.place}</span></div><div className="education-result"><span>{item.date}</span><strong>{item.result}</strong></div></article>)}</div>
      </section>

      <section className="content-section section-shell reveal" id="projects" aria-labelledby="projects-title">
        <SectionHeading number="03" kicker="SELECTED WORK & IDEAS" title="Projects" id="projects-title" />
        <p className="section-intro">A few things I’m making, exploring, and planning. Each project is at a different stage.</p>
        <div className="project-grid">{projects.map((project, i) => <article className="project-card" key={project.name}>
          <div className="project-top"><span className="project-number">0{i + 1}</span><span className={`status-badge ${project.status === "In development" ? "status-active" : ""}`}><i></i>{project.status}</span></div>
          <h3>{project.name}</h3><p className="project-subtitle">{project.subtitle}</p><p className="project-summary">{project.summary}</p>
          {project.built.length > 0 && <div className="feature-group"><h4><Icon name="check" size={14} /> Built in this version</h4><ul>{project.built.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          <div className="feature-group planned-group"><h4><span className="plan-icon">↗</span> Planned</h4><ul>{project.planned.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="project-links"><button type="button" onClick={() => openCaseStudy(project)}>Explore project <Icon name="arrow" size={14} /></button>{project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub <Icon name="arrow" size={14} /></a>}{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <Icon name="arrow" size={14} /></a>}</div>
        </article>)}</div>
        {recentProjects.length > 0 && <div className="recently-viewed"><span>Recently explored</span>{recentProjects.map((project) => <button type="button" key={project.name} onClick={() => openCaseStudy(project)}>{project.name} ↗</button>)}</div>}
        <div className="github-activity"><div><p className="eyebrow">SOURCE &amp; ACTIVITY</p><h3>Work in the open.</h3><p>Repository highlights and contribution activity will appear here when specific public repositories are added.</p></div><a className="button button-quiet" href={profile.links.github} target="_blank" rel="noreferrer">Visit GitHub <Icon name="arrow" size={14} /></a></div>
      </section>

      <section className="content-section section-shell reveal skills-section" id="skills" aria-labelledby="skills-title">
        <SectionHeading number="04" kicker="TOOLS & TOPICS" title="Skills" id="skills-title" />
        <p className="section-intro">A growing toolkit, built through coursework, practice, and projects.</p>
        <div className="skill-filters" role="group" aria-label="Filter skills by category">{["All", ...skills.map((group) => group.group)].map((category) => <button type="button" key={category} aria-pressed={skillFilter === category} className={skillFilter === category ? "selected" : ""} onClick={() => setSkillFilter(category)}>{category}</button>)}</div>
        <div className="skills-grid">{skills.filter((group) => skillFilter === "All" || group.group === skillFilter).map((group, i) => <section className="skill-group reveal" key={group.group} aria-labelledby={`skill-group-${i}`}>
          <div className="skill-group-head"><span className="skill-number">{String(i + 1).padStart(2, "0")}</span><h3 id={`skill-group-${i}`}>{group.group}</h3></div>
          <ul className="skill-tiles">{group.items.map((skill, index) => <li className="skill-tile" key={skill.name} tabIndex={0} style={{ "--tile-index": index }} title={skill.name}>
            <SkillIcon name={skill.icon} /><span>{skill.name}</span>
          </li>)}</ul>
        </section>)}</div>
        <div className="skills-footnotes"><p><strong>Core foundations</strong><span>{skillFoundations.join(" · ")}</span></p><p><strong>Spoken languages</strong><span>{spokenLanguages.map((language) => `${language} (fluent)`).join(" · ")}</span></p></div>
        <p className="skills-project-note">Project-to-stack connections will be added when each project’s actual technologies are documented. <a href="#projects">Explore projects ↗</a></p>
      </section>

      <section className="content-section section-shell reveal" id="hackathons" aria-labelledby="hackathons-title">
        <SectionHeading number="05" kicker="IDEAS BUILT TOGETHER" title="Hackathons" id="hackathons-title" />
        <p className="section-intro">Early-stage concepts shaped through teamwork and time-boxed problem solving.</p>
        <div className="hackathon-grid">{hackathons.map((item, i) => <article className="hack-card" key={item.name}><div className="hack-top"><span className="hack-number">0{i + 1} / CONCEPT</span><span className="hack-arrow" aria-hidden="true">↗</span></div><p className="hack-event">{item.event}</p><h3>{item.name}</h3><p className="hack-subtitle">{item.subtitle}</p><p className="hack-desc">{item.description}</p><div className="hack-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="hack-meta">{item.meta}</div><button className="case-inline-link" type="button" onClick={() => openCaseStudy(item)}>Explore concept ↗</button></article>)}</div>
      </section>

      <section className="contact-section reveal" id="contact" aria-labelledby="contact-title"><div className="section-shell contact-inner"><div className="contact-copy"><p className="eyebrow"><span className="status-dot"></span> OPEN TO OPPORTUNITIES</p><h2 id="contact-title">Let’s make<br /><span>something matter.</span></h2><p>I’m interested in software engineering internships and thoughtful collaborations. Have an idea or opportunity? I’d love to hear from you.</p><a className="contact-email" href={`mailto:${profile.email}`}><Icon name="mail" size={18} /> {profile.email} <Icon name="arrow" size={15} /></a><div className="contact-details"><a href={`tel:${profile.phone.replaceAll(" ", "")}`}>{profile.phone}</a><span>·</span><span>{profile.location}</span></div><div className="contact-socials">{social.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label} <Icon name="arrow" size={13} /></a>)}</div></div><form className="contact-form" onSubmit={sendMessage}><p className="form-kicker">SEND A MESSAGE</p><label htmlFor="name">Your name</label><input id="name" name="name" type="text" autoComplete="name" required placeholder="Jane Smith" /><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="jane@example.com" /><label htmlFor="message">Message</label><textarea id="message" name="message" rows="4" required placeholder="What would you like to talk about?" /><button className="button button-primary form-submit" type="submit" disabled={!profile.formspreeEndpoint || formStatus === "sending"}>{formStatus === "sending" ? "Sending…" : "Send message"} <Icon name="arrow" size={15} /></button><p className={`form-note ${formStatus}`} role={formStatus === "error" ? "alert" : "status"} aria-live="polite">{formStatus === "success" ? "Thanks — your message was sent." : formStatus === "error" ? "Your message could not be sent. Please try again or email me directly." : !profile.formspreeEndpoint ? "Direct sending is not configured yet. Add your Formspree endpoint in src/data.js." : formStatus === "sending" ? "Sending your message…" : "Your message will be sent directly from this form."}</p></form></div></section>
    </main>

    <footer className="site-footer"><div className="section-shell footer-inner"><a className="brand footer-brand" href="#top"><span className="brand-mark">SG</span><span>Srijal Gupta<span className="brand-period">.</span></span></a><p>© 2026 Srijal Prasad Gupta</p><a className="back-top" href="#top">Back to top ↑</a></div></footer>
    <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} profile={profile} projects={projects} skills={skills} terminalApi={terminalApi} onOpenProject={openCaseStudy} />
    <CaseStudyDialog item={activeCase} onClose={closeCaseStudy} />
    <RecruiterDialog open={recruiterOpen} onClose={() => setRecruiterOpen(false)} profile={profile} education={education} skills={skills} />
  </>;
}

function SectionHeading({ number, kicker, title, id }) {
  return <div className="section-heading"><div className="heading-number">{number}</div><div><p className="eyebrow">{kicker}</p><h2 id={id}>{title}<span className="heading-period">.</span></h2></div></div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
