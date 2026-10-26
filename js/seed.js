// Fictional sample profiles used to demo the platform. All names and details are invented.
window.KINDLING_SEED = [
  {
    id: "s1", sample: true, name: "Mira Okafor", school: "UCLA", level: "PhD",
    background: "Non-business", technical: "Technical",
    oneLiner: "ML researcher turning a graph-matching paper into a product.",
    bio: "PhD student in computer science working on representation learning for recommendation and matching systems. Wants to commercialize research but has never run a company and needs a business co-founder for go-to-market and fundraising.",
    interests: ["AI/ML", "Marketplaces", "EdTech"],
    skills: ["Machine learning", "Python", "Recommendation systems", "Research"],
    lookingFor: { background: "Business", technical: "Any", skills: ["Go-to-market", "Fundraising", "Sales"] },
    highlights: ["2 published papers", "Built matching engine"],
    projects: [
      { title: "Two-sided matching score", desc: "Learned compatibility score for mentor–mentee pairing; improved accepted-match rate in a pilot of 300 users." },
      { title: "Campus course recommender", desc: "Embedding-based recommender serving a student org's course-planning tool." }
    ],
    publications: ["Contrastive embeddings for two-sided matching (workshop paper)", "Cold-start ranking with sparse profiles (conference poster)"],
    experience: ["Research intern, applied ML team at a fintech", "Teaching assistant, intro to ML"],
    links: {}
  },
  {
    id: "s2", sample: true, name: "Daniel Reyes", school: "UCLA Anderson", level: "MBA",
    background: "Business", technical: "Non-technical",
    oneLiner: "Ex-consultant looking for a technical partner in health or AI.",
    bio: "Second-year MBA, previously three years in strategy consulting for healthcare clients. Strong at customer discovery, pricing and pitching. Looking for a technical co-founder with a real research edge.",
    interests: ["HealthTech", "AI/ML", "B2B SaaS"],
    skills: ["Go-to-market", "Fundraising", "Financial modeling", "Customer discovery"],
    lookingFor: { background: "Any", technical: "Technical", skills: ["Machine learning", "Full-stack"] },
    highlights: ["Ex-consultant", "Pitch competition finalist"],
    projects: [{ title: "Clinic scheduling pilot", desc: "Ran 40 customer interviews and a paid pilot with two clinics." }],
    publications: [], experience: ["Strategy consultant, healthcare practice"], links: {}
  },
  {
    id: "s3", sample: true, name: "Hana Lee", school: "UC Berkeley", level: "Undergrad",
    background: "Non-business", technical: "Technical",
    oneLiner: "Full-stack builder who ships fast; wants a mission-driven idea.",
    bio: "Junior studying EECS. Has shipped four side projects with real users. Comfortable owning the whole stack and looking for someone with domain knowledge and sales energy.",
    interests: ["Consumer", "Climate", "Marketplaces"],
    skills: ["Full-stack", "React", "Product design", "Python"],
    lookingFor: { background: "Business", technical: "Any", skills: ["Sales", "Go-to-market"] },
    highlights: ["Hackathon winner", "Shipped 4 apps"],
    projects: [{ title: "Dorm marketplace", desc: "Peer-to-peer resale app, 1,200 users in one semester." }],
    publications: [], experience: ["SWE intern, consumer startup"], links: {}
  },
  {
    id: "s4", sample: true, name: "Priya Nair", school: "Stanford GSB", level: "MBA",
    background: "Business", technical: "Technical",
    oneLiner: "Former PM with an engineering degree, exploring fintech infra.",
    bio: "Engineer turned product manager. Five years at a payments company. Can code prototypes and run sales; wants a deep technical co-founder in infra or security.",
    interests: ["Fintech", "B2B SaaS", "Security"],
    skills: ["Product management", "Sales", "Python", "Go-to-market"],
    lookingFor: { background: "Any", technical: "Technical", skills: ["Backend", "Security"] },
    highlights: ["Ex-PM at payments co", "Engineering degree"],
    projects: [{ title: "Reconciliation tool", desc: "Internal tool that cut finance close time by two days." }],
    publications: [], experience: ["Product manager, payments platform"], links: {}
  },
  {
    id: "s5", sample: true, name: "Tomás Ibarra", school: "USC", level: "Graduate",
    background: "Non-business", technical: "Technical",
    oneLiner: "Robotics MS student building low-cost lab automation.",
    bio: "Master's student in mechanical engineering focused on robotics. Has a working prototype for automated pipetting and wants a business partner to talk to labs.",
    interests: ["Hardware", "BioTech", "AI/ML"],
    skills: ["Robotics", "Embedded systems", "CAD", "Python"],
    lookingFor: { background: "Business", technical: "Any", skills: ["Sales", "Fundraising"] },
    highlights: ["Working prototype", "Lab automation"],
    projects: [{ title: "Open pipetting robot", desc: "Sub-$500 liquid handler used by two university labs." }],
    publications: ["Low-cost liquid handling for teaching labs (student paper)"], experience: ["Research assistant, robotics lab"], links: {}
  },
  {
    id: "s6", sample: true, name: "Grace Whitfield", school: "UCLA", level: "Undergrad",
    background: "Business", technical: "Non-technical",
    oneLiner: "Business economics senior who runs the campus founders club.",
    bio: "Runs a 200-member entrepreneurship club, organized two demo days, and has done growth marketing for a DTC brand. Wants to join a technical team as the business co-founder.",
    interests: ["Consumer", "EdTech", "Marketplaces"],
    skills: ["Growth marketing", "Community", "Sales", "Operations"],
    lookingFor: { background: "Any", technical: "Technical", skills: ["Full-stack", "Machine learning"] },
    highlights: ["Club president", "Organized demo days"],
    projects: [{ title: "Founders demo day", desc: "Recruited 12 teams and 30 investors for a campus demo day." }],
    publications: [], experience: ["Growth intern, DTC brand"], links: {}
  },
  {
    id: "s7", sample: true, name: "Arjun Mehta", school: "UCLA", level: "PhD",
    background: "Non-business", technical: "Technical",
    oneLiner: "Battery materials researcher; looking for a climate co-founder.",
    bio: "Materials science PhD candidate with a patent-pending electrolyte additive. Interested in climate hardware but unsure how to raise money or find first customers.",
    interests: ["Climate", "Hardware", "Energy"],
    skills: ["Materials science", "Research", "Data analysis"],
    lookingFor: { background: "Business", technical: "Any", skills: ["Fundraising", "Go-to-market"] },
    highlights: ["Patent pending", "3 publications"],
    projects: [{ title: "Electrolyte additive", desc: "Extended cycle life in lab cells; provisional patent filed." }],
    publications: ["Additive design for stable lithium-metal cycling", "High-throughput screening of electrolyte blends", "Review of solid-state interfaces"],
    experience: ["Research intern, national lab"], links: {}
  },
  {
    id: "s8", sample: true, name: "Sofia Laurent", school: "UCLA Anderson", level: "MBA",
    background: "Business", technical: "Non-technical",
    oneLiner: "Climate VC associate turned founder-in-residence.",
    bio: "Spent two years at a climate-focused venture fund. Knows the fundraising landscape for hard tech and wants to partner with a researcher who has defensible IP.",
    interests: ["Climate", "Energy", "Hardware"],
    skills: ["Fundraising", "Financial modeling", "Go-to-market"],
    lookingFor: { background: "Any", technical: "Technical", skills: ["Research", "Materials science", "Hardware"] },
    highlights: ["Ex-climate VC", "Investor network"],
    projects: [{ title: "Climate deal memo library", desc: "Wrote 25 investment memos on energy storage and grid startups." }],
    publications: [], experience: ["Associate, climate venture fund"], links: {}
  },
  {
    id: "s9", sample: true, name: "Kenji Watanabe", school: "Caltech", level: "Graduate",
    background: "Non-business", technical: "Technical",
    oneLiner: "Security engineer building privacy tooling for startups.",
    bio: "MS in computer science, previously a backend engineer. Building open-source tooling for data privacy compliance and needs someone to sell to companies.",
    interests: ["Security", "B2B SaaS", "Fintech"],
    skills: ["Backend", "Security", "Go", "Cloud infrastructure"],
    lookingFor: { background: "Business", technical: "Any", skills: ["Sales", "Product management"] },
    highlights: ["Open-source maintainer", "1k GitHub stars"],
    projects: [{ title: "PII scanner", desc: "CLI that flags personal data in logs; adopted by several small teams." }],
    publications: [], experience: ["Backend engineer, SaaS company"], links: {}
  },
  {
    id: "s10", sample: true, name: "Leila Haddad", school: "UCLA", level: "Graduate",
    background: "Business", technical: "Technical",
    oneLiner: "Public health + data science; building tools for community clinics.",
    bio: "Master's in public health with a data science focus. Has worked with community clinics and knows their workflows; can build dashboards but wants a stronger engineer.",
    interests: ["HealthTech", "AI/ML", "Social impact"],
    skills: ["Data analysis", "Customer discovery", "Operations", "Python"],
    lookingFor: { background: "Any", technical: "Technical", skills: ["Full-stack", "Machine learning"] },
    highlights: ["Clinic partnerships", "Grant recipient"],
    projects: [{ title: "Clinic no-show model", desc: "Predicted missed appointments to target reminder calls." }],
    publications: ["Reducing missed appointments in safety-net clinics (report)"], experience: ["Data fellow, county health department"], links: {}
  }
];
