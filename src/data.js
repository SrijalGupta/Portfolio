export const profile = {
  name: "Srijal Prasad Gupta",
  initials: "SG",
  tagline: "CSE student building strong programming, problem-solving and full-stack skills",
  location: "Bengaluru, India",
  email: "srijalgupta21@gmail.com",
  phone: "+91 9905573105",
  about: [
    "I’m a second-year Computer Science and Engineering student at BMS Institute of Technology & Management, Bengaluru, with a CGPA of 9.18/10.",
    "I’m building a strong foundation in programming and problem-solving while exploring full-stack development, applied AI, and competitive programming.",
    "I enjoy learning by making things, from small web apps to early-stage ideas developed with a team at hackathons.",
  ],
  links: {
    github: "https://github.com/SrijalGupta",
    linkedin: "https://www.linkedin.com/in/srijal-prasad-gupta-377a043b5/",
    leetcode: "https://leetcode.com/u/srijalgupta/",
  },
};

export const navigation = ["About", "Education", "Projects", "Skills", "Hackathons", "Contact"];

export const education = [
  { school: "BMS Institute of Technology & Management", credential: "B.E. in Computer Science and Engineering", place: "Bengaluru, India", date: "2025–2029 (Expected)", result: "CGPA 9.18/10", current: true },
  { school: "Makawanpur Multiple Campus", credential: "Class XII", place: "Hetauda, Nepal", date: "2023–2025", result: "88.75%" },
  { school: "Shree Nepal Secondary School", credential: "Class X", place: "Amlekhgunj, Nepal", date: "2023", result: "83.75%" },
];

export const projects = [
  {
    name: "Expense Tracker",
    subtitle: "Basic Version",
    status: "Basic version",
    summary: "A web app to record and review personal expenses.",
    built: ["Record personal expenses", "Review expense entries"],
    planned: ["Persistent storage", "Category-wise analytics", "User accounts"],
    github: "",
    demo: "",
  },
  {
    name: "BugHunt",
    subtitle: "Gamified Coding Practice Platform",
    status: "In development",
    summary: "A practice platform concept where learners improve by fixing bugs in coding missions.",
    built: [],
    planned: ["Code editor", "Automated test-based completion", "Hints, XP and levels", "Progress tracking"],
    github: "",
    demo: "",
  },
  {
    name: "AI Study Buddy",
    subtitle: "Document-based Study Assistant",
    status: "Planned",
    summary: "A proposed study assistant for asking questions about notes, with document-based Q&A and source-grounded answers.",
    built: [],
    planned: ["Ask questions about study notes", "Document-based Q&A", "Answers grounded in source material"],
    github: "",
    demo: "",
  },
];

export const skills = [
  { group: "Programming Languages", items: [
    { name: "C", icon: "c" }, { name: "C++", icon: "cpp" }, { name: "Python", icon: "python" },
    { name: "JavaScript", icon: "javascript" }, { name: "SQL", icon: "sql" },
  ] },
  { group: "Frontend Development", items: [
    { name: "HTML5", icon: "html" }, { name: "CSS3", icon: "css" }, { name: "React", icon: "react" },
    { name: "Responsive Web Design", icon: "responsive" },
  ] },
  { group: "Backend Development", items: [
    { name: "Node.js", icon: "node" }, { name: "Django", icon: "django" }, { name: "REST APIs", icon: "api" },
  ] },
  { group: "Databases", items: [
    { name: "PostgreSQL", icon: "postgresql" }, { name: "MongoDB", icon: "mongodb" },
  ] },
  { group: "AI & Data", items: [
    { name: "Python for Data Analysis", icon: "analysis" }, { name: "NumPy", icon: "numpy" },
    { name: "pandas", icon: "pandas" }, { name: "Generative AI APIs", icon: "ai" },
    { name: "Prompt Engineering", icon: "prompt" },
  ] },
  { group: "Developer Tools", items: [
    { name: "Git", icon: "git" }, { name: "GitHub", icon: "github" }, { name: "VS Code", icon: "vscode" },
    { name: "npm", icon: "npm" }, { name: "Vite", icon: "vite" },
  ] },
];

export const skillFoundations = ["Data Structures and Algorithms", "OOP", "Problem Solving"];
export const spokenLanguages = ["Nepali", "English", "Hindi"];

export const hackathons = [
  {
    name: "Namma Raksha",
    event: "InCSEption 2.0",
    subtitle: "AI Smart Ambulance Dispatch",
    meta: "Team of 4 · 8 hours",
    description: "A solution concept for faster emergency response, considering patient condition, ambulance availability, hospital and ICU capacity, route selection, and notifications.",
    tags: ["Emergency response", "Dispatch concept", "Team project"],
  },
  {
    name: "P2P + EcoPrint",
    event: "BMSIT IDT",
    subtitle: "Campus innovation concept",
    meta: "Student-focused concept",
    description: "A campus innovation concept combining student-to-student resale with paper digitization, student access, and a dashboard.",
    tags: ["Campus innovation", "Student resale", "Paper digitization"],
  },
];
