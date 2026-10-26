// Matching engine: scores every profile against a seeker and returns the top N with reasons.
(function () {
  const STOP = new Set("a an and are as at be but by for from has have i in is it its of on or our that the their this to was we with who wants want looking need needs someone my me".split(" "));
  const tokens = (s) => (s || "").toLowerCase().match(/[a-z][a-z0-9+#.-]{1,}/g)?.filter((w) => !STOP.has(w)) || [];
  const norm = (s) => (s || "").trim().toLowerCase();
  const setOf = (arr) => new Set((arr || []).map(norm).filter(Boolean));

  function jaccard(a, b) {
    if (!a.size && !b.size) return 0;
    let inter = 0; a.forEach((x) => b.has(x) && inter++);
    return inter / (a.size + b.size - inter);
  }
  function overlap(a, b) { return [...a].filter((x) => b.has(x)); }

  // Bag-of-words cosine with IDF weights computed over the whole database.
  function docText(p) {
    return [p.oneLiner, p.bio, (p.interests || []).join(" "), (p.skills || []).join(" "),
      (p.projects || []).map((x) => x.title + " " + x.desc).join(" "), (p.publications || []).join(" ")].join(" ");
  }
  function buildIdf(docs) {
    const df = new Map();
    docs.forEach((d) => new Set(d).forEach((w) => df.set(w, (df.get(w) || 0) + 1)));
    const n = docs.length;
    return (w) => Math.log((n + 1) / ((df.get(w) || 0) + 1)) + 1;
  }
  function vec(tok, idf) {
    const v = new Map();
    tok.forEach((w) => v.set(w, (v.get(w) || 0) + 1));
    v.forEach((tf, w) => v.set(w, tf * idf(w)));
    return v;
  }
  function cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    a.forEach((x, w) => { na += x * x; if (b.has(w)) dot += x * b.get(w); });
    b.forEach((x) => (nb += x * x));
    return na && nb ? dot / Math.sqrt(na * nb) : 0;
  }

  // How well does `who` satisfy what `wants` asked for? Returns 0..1 plus notes.
  function wantFit(wants, who) {
    const lf = wants.lookingFor || {};
    const notes = [];
    let parts = 0, total = 0;
    if (lf.background && lf.background !== "Any") {
      total++; if (norm(who.background) === norm(lf.background)) { parts++; notes.push(`${who.background.toLowerCase()} background`); }
    }
    if (lf.technical && lf.technical !== "Any") {
      total++; if (norm(who.technical) === norm(lf.technical)) { parts++; notes.push(who.technical.toLowerCase()); }
    }
    const wanted = setOf(lf.skills);
    if (wanted.size) {
      total++;
      const hit = (who.skills || []).filter((x) => wanted.has(norm(x)));
      parts += hit.length / wanted.size;
      if (hit.length) notes.push(hit.join(", "));
    }
    return { score: total ? parts / total : 0.5, notes };
  }

  function rank(seeker, pool, n = 3) {
    const candidates = pool.filter((p) => p.id !== seeker.id && norm(p.name) !== norm(seeker.name));
    const docs = [seeker, ...candidates].map((p) => tokens(docText(p)));
    const idf = buildIdf(docs);
    const sVec = vec(docs[0], idf);
    const sInterests = setOf(seeker.interests);
    const sSkills = setOf(seeker.skills);

    const scored = candidates.map((c, i) => {
      const forward = wantFit(seeker, c);          // they are what I'm looking for
      const backward = wantFit(c, seeker);         // I am what they're looking for
      const sharedInterests = (c.interests || []).filter((x) => sInterests.has(norm(x)));
      const interestJ = jaccard(sInterests, setOf(c.interests));
      const textSim = cosine(sVec, vec(docs[i + 1], idf));
      const skillOverlap = jaccard(sSkills, setOf(c.skills));
      const complement = 1 - skillOverlap;

      const parts = {
        "Fits what you want": forward.score,
        "Wants someone like you": backward.score,
        "Shared vision": Math.min(1, 0.65 * interestJ + 0.35 * Math.min(1, textSim * 2.5)),
        "Complementary skills": complement
      };
      const weights = { "Fits what you want": 0.4, "Wants someone like you": 0.2, "Shared vision": 0.25, "Complementary skills": 0.15 };
      const score = Math.round(100 * Object.entries(parts).reduce((s, [k, v]) => s + v * weights[k], 0));

      const why = [];
      if (forward.notes.length) why.push(`Brings what you asked for: ${forward.notes.join("; ")}.`);
      if (backward.score >= 0.6) why.push(`Is actively looking for someone with your profile.`);
      if (sharedInterests.length) why.push(`You both care about ${sharedInterests.join(", ")}.`);
      if (complement > 0.75 && (c.skills || []).length) why.push(`Little skill overlap — they cover ${c.skills.slice(0, 3).join(", ")}.`);
      if (!why.length) why.push("Partial fit across several dimensions.");
      return { profile: c, score, parts, why };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, n);
  }

  // Links that search beyond our own database for people matching the seeker's needs.
  function externalSearches(seeker) {
    const lf = seeker.lookingFor || {};
    const need = [...(lf.skills || []).slice(0, 3), ...(seeker.interests || []).slice(0, 2)];
    const role = lf.technical === "Technical" ? "engineer OR researcher" : lf.background === "Business" ? "MBA OR founder OR business" : "founder";
    const q = encodeURIComponent(`${need.join(" ")} ${role}`.trim());
    const school = seeker.school ? encodeURIComponent(seeker.school) : "";
    const links = [
      { label: "LinkedIn people", url: `https://www.linkedin.com/search/results/people/?keywords=${q}${school ? "%20" + school : ""}` },
      { label: "Web search", url: `https://www.google.com/search?q=${q}${school ? "+" + school : ""}+cofounder` },
      { label: "YC co-founder matching", url: "https://www.ycombinator.com/cofounder-matching" }
    ];
    if (lf.technical === "Technical") {
      const tq = encodeURIComponent([...(lf.skills || []), ...(seeker.interests || [])].slice(0, 4).join(" "));
      links.push({ label: "Google Scholar researchers", url: `https://scholar.google.com/scholar?q=${tq}` });
      links.push({ label: "GitHub developers", url: `https://github.com/search?q=${tq}&type=users` });
    }
    return links;
  }

  window.Matcher = { rank, externalSearches };
})();
