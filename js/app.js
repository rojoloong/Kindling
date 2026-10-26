(function () {
  const LEVELS = ["Undergrad", "Graduate", "MBA", "PhD", "Alumni"];
  const BACKGROUNDS = ["Business", "Non-business"];
  const TECH = ["Technical", "Non-technical"];
  const INTERESTS = ["AI/ML", "Fintech", "HealthTech", "BioTech", "Climate", "Energy", "EdTech", "Consumer", "Marketplaces", "B2B SaaS", "Security", "Hardware", "Social impact"];
  const SKILLS = ["Machine learning", "Full-stack", "Backend", "React", "Python", "Research", "Data analysis", "Security", "Robotics", "Hardware", "Product management", "Product design", "Go-to-market", "Sales", "Fundraising", "Financial modeling", "Customer discovery", "Growth marketing", "Operations", "Community"];

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = (s) => (s || "").split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
  const lines = (s) => (s || "").split("\n").map((x) => x.trim()).filter(Boolean);
  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2400);
  }
  function hue(name) { let h = 0; for (const c of name || "") h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h} 45% 45%)`; }
  const initials = (n) => (n || "?").split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase();

  function tagsHtml(p, { withSample = true } = {}) {
    const t = [];
    if (p.level) t.push(`<span class="tag level">${esc(p.level)} student</span>`);
    if (p.background) t.push(`<span class="tag biz">${esc(p.background)}</span>`);
    if (p.technical) t.push(`<span class="tag tech">${esc(p.technical)}</span>`);
    (p.highlights || []).forEach((h) => t.push(`<span class="tag hl">★ ${esc(h)}</span>`));
    if (withSample && p.sample) t.push(`<span class="tag sample">Sample</span>`);
    return `<div class="tags">${t.join("")}</div>`;
  }
  function personCard(p) {
    return `<article class="card person" data-id="${esc(p.id)}" tabindex="0">
      <div class="person-head"><div class="avatar" style="background:${hue(p.name)}">${esc(initials(p.name))}</div>
        <div><h3 style="margin:0">${esc(p.name)}</h3><div class="sub">${esc(p.school)}</div></div></div>
      <p class="oneliner">${esc(p.oneLiner || "")}</p>
      ${tagsHtml(p)}
      <div class="tags">${(p.interests || []).map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</div>
    </article>`;
  }

  // ---------- Router ----------
  const views = ["directory", "join", "match", "admin"];
  function route() {
    const v = views.includes(location.hash.slice(1)) ? location.hash.slice(1) : "directory";
    views.forEach((x) => ($(`#view-${x}`).hidden = x !== v));
    document.querySelectorAll("nav a").forEach((a) => a.classList.toggle("active", a.dataset.view === v));
    ({ directory: renderDirectory, admin: renderAdmin }[v] || (() => {}))();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  // ---------- Directory ----------
  const active = new Set();
  function renderFilters() {
    const groups = [...LEVELS, ...BACKGROUNDS, ...TECH];
    $("#dir-filters").innerHTML = groups.map((g) => `<button class="chip ${active.has(g) ? "on" : ""}" data-f="${esc(g)}">${esc(g)}</button>`).join("");
  }
  function renderDirectory() {
    renderFilters();
    const q = $("#dir-search").value.trim().toLowerCase();
    const items = Store.all().filter((p) => {
      const tagset = [p.level, p.background, p.technical];
      for (const f of active) if (!tagset.includes(f)) return false;
      if (!q) return true;
      return JSON.stringify([p.name, p.school, p.oneLiner, p.interests, p.skills, p.highlights]).toLowerCase().includes(q);
    });
    $("#dir-count").textContent = `${items.length} member${items.length === 1 ? "" : "s"}`;
    $("#dir-grid").innerHTML = items.map(personCard).join("") || `<p class="muted">No one matches those filters yet.</p>`;
  }
  $("#dir-search").addEventListener("input", renderDirectory);
  $("#dir-filters").addEventListener("click", (e) => {
    const f = e.target.dataset.f; if (!f) return;
    active.has(f) ? active.delete(f) : active.add(f); renderDirectory();
  });
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".person"); if (card) openProfile(card.dataset.id);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList?.contains("person")) openProfile(e.target.dataset.id);
  });

  function openProfile(id) {
    const p = Store.get(id); if (!p) return;
    const sec = (title, body) => (body ? `<section><h4>${title}</h4>${body}</section>` : "");
    const ul = (arr) => (arr && arr.length ? `<ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>` : "");
    const lf = p.lookingFor || {};
    $("#profile-body").innerHTML = `
      <button class="btn ghost close" onclick="this.closest('dialog').close()">Close</button>
      <div class="person-head"><div class="avatar" style="background:${hue(p.name)}">${esc(initials(p.name))}</div>
        <div><h3 style="margin:0">${esc(p.name)}</h3><div class="muted">${esc(p.school)}</div></div></div>
      <div style="margin-top:12px">${tagsHtml(p)}</div>
      ${sec("Bio", `<p style="margin:0">${esc(p.bio)}</p>`)}
      ${sec("Interested in", esc((p.interests || []).join(" · ")))}
      ${sec("Skills", esc((p.skills || []).join(" · ")))}
      ${sec("Looking for", esc([lf.background !== "Any" && lf.background, lf.technical !== "Any" && lf.technical, ...(lf.skills || [])].filter(Boolean).join(" · ")))}
      ${sec("Past projects", ul((p.projects || []).map((x) => `<b>${esc(x.title)}</b> — ${esc(x.desc)}`)))}
      ${sec("Publications", ul((p.publications || []).map(esc)))}
      ${sec("Experience", ul((p.experience || []).map(esc)))}
      ${p.contact ? sec("Contact", esc(p.contact)) : ""}`;
    $("#profile-dialog").showModal();
  }

  // ---------- Shared profile form ----------
  const opts = (arr, sel) => arr.map((x) => `<option ${x === sel ? "selected" : ""}>${esc(x)}</option>`).join("");
  const checks = (name, arr) => `<div class="chips">${arr.map((x) => `<label class="chip"><input type="checkbox" name="${name}" value="${esc(x)}" hidden>${esc(x)}</label>`).join("")}</div>`;
  function profileFields(mode) {
    return `
      <label>Name<input name="name" required placeholder="Full name"></label>
      <label>School / organization<input name="school" required placeholder="e.g. UCLA"></label>
      <label>Program level<select name="level">${opts(LEVELS)}</select></label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <label>Background<select name="background">${opts(BACKGROUNDS)}</select></label>
        <label>Technical?<select name="technical">${opts(TECH)}</select></label>
      </div>
      <label class="full">One-line summary<input name="oneLiner" placeholder="What are you building or hoping to build?"></label>
      <fieldset class="full"><legend>Areas of interest</legend>${checks("interests", INTERESTS)}</fieldset>
      <fieldset class="full"><legend>Your skills</legend>${checks("skills", SKILLS)}</fieldset>
      <fieldset class="full"><legend>Who you're looking for</legend>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px">
          <label>Background<select name="lf_background"><option>Any</option>${opts(BACKGROUNDS)}</select></label>
          <label>Technical?<select name="lf_technical"><option>Any</option>${opts(TECH)}</select></label>
        </div>
        ${checks("lf_skills", SKILLS)}
      </fieldset>
      <label class="full">Bio<textarea name="bio" placeholder="Background, idea, what you bring"></textarea></label>
      ${mode === "join" ? `
      <label class="full">Highlights <span class="hint">comma-separated, become ★ tags — e.g. Patent pending, Hackathon winner</span><input name="highlights"></label>
      <label class="full">Past projects <span class="hint">one per line, "Title: description"</span><textarea name="projects"></textarea></label>
      <label>Publications <span class="hint">one per line</span><textarea name="publications"></textarea></label>
      <label>Experience / internships <span class="hint">one per line</span><textarea name="experience"></textarea></label>
      <label class="full">Contact <span class="hint">email or LinkedIn, shown on your profile</span><input name="contact"></label>
      <div class="full"><button class="btn" type="submit">Save profile</button></div>` : `
      <label class="full" style="flex-direction:row;align-items:center;gap:8px;font-weight:500"><input type="checkbox" name="save" style="width:auto"> Also add me to the directory</label>
      <div class="full"><button class="btn" type="submit">Show my top 3 matches</button></div>`}`;
  }
  function readForm(form) {
    const fd = new FormData(form);
    const all = (n) => fd.getAll(n);
    return {
      name: fd.get("name"), school: fd.get("school"), level: fd.get("level"),
      background: fd.get("background"), technical: fd.get("technical"),
      oneLiner: fd.get("oneLiner"), bio: fd.get("bio"),
      interests: all("interests"), skills: all("skills"),
      lookingFor: { background: fd.get("lf_background"), technical: fd.get("lf_technical"), skills: all("lf_skills") },
      highlights: list(fd.get("highlights")),
      projects: lines(fd.get("projects")).map((l) => { const [t, ...d] = l.split(":"); return { title: t.trim(), desc: d.join(":").trim() }; }),
      publications: lines(fd.get("publications")), experience: lines(fd.get("experience")),
      contact: fd.get("contact") || ""
    };
  }
  // chip-style checkboxes
  document.addEventListener("change", (e) => {
    if (e.target.matches(".chip input[type=checkbox]")) e.target.parentElement.classList.toggle("on", e.target.checked);
  });

  $("#join-form").innerHTML = profileFields("join");
  $("#join-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const p = Store.add(readForm(e.target));
    e.target.reset(); e.target.querySelectorAll(".chip.on").forEach((c) => c.classList.remove("on"));
    toast(`${p.name} added to the directory`);
    location.hash = "#directory";
  });

  // ---------- Match ----------
  $("#match-form").innerHTML = profileFields("match");
  $("#match-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const seeker = readForm(e.target);
    if (new FormData(e.target).get("save")) { Store.add(seeker); toast("Added to the directory"); }
    const top = Matcher.rank(seeker, Store.all(), 3);
    const ext = Matcher.externalSearches(seeker);
    $("#match-results").innerHTML = `
      <h2>Your top ${top.length}</h2>
      ${top.map((r, i) => `
        <div class="card result">
          <div class="rank">${i + 1}</div>
          <div>
            <div class="person-head"><div class="avatar" style="background:${hue(r.profile.name)}">${esc(initials(r.profile.name))}</div>
              <div><h3 style="margin:0">${esc(r.profile.name)}</h3><div class="muted" style="font-size:13px">${esc(r.profile.school)} · ${esc(r.profile.oneLiner || "")}</div></div></div>
            <div class="score-row"><b>${r.score}% match</b><div class="bar"><i style="width:${r.score}%"></i></div></div>
            ${tagsHtml(r.profile)}
            <ul class="why">${r.why.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
            <div class="breakdown">${Object.entries(r.parts).map(([k, v]) => `<span>${esc(k)}: ${Math.round(v * 100)}</span>`).join("")}</div>
            <button class="btn ghost" style="margin-top:12px" onclick="window.__openProfile('${esc(r.profile.id)}')">View full profile</button>
          </div>
        </div>`).join("")}
      <div class="card external">
        <h3>Search beyond Kindling</h3>
        <p class="muted" style="margin:0">Not enough people in the database yet? These searches use your needs and interests to look for candidates on the wider web.</p>
        <div class="links">${ext.map((l) => `<a class="btn ghost" target="_blank" rel="noopener" href="${esc(l.url)}">${esc(l.label)} ↗</a>`).join("")}</div>
      </div>`;
    $("#match-results").scrollIntoView({ behavior: "smooth" });
  });
  window.__openProfile = openProfile;

  // ---------- Admin ----------
  function renderAdmin() {
    $("#admin-table").innerHTML = Store.all().map((p) => {
      const grp = (label, field, values) => `<div class="grp"><b>${label}</b>${values.map((v) =>
        `<button class="chip ${p[field] === v ? "on" : ""}" data-act="set" data-id="${esc(p.id)}" data-field="${field}" data-val="${esc(v)}">${esc(v)}</button>`).join("")}</div>`;
      return `<div class="admin-row">
        <div><b>${esc(p.name)}</b><div class="muted" style="font-size:13px">${esc(p.school)}</div>
          <button class="btn ghost danger" style="margin-top:8px;padding:5px 10px;font-size:12px" data-act="del" data-id="${esc(p.id)}">Remove</button></div>
        <div class="groups">
          ${grp("Level", "level", LEVELS)}
          ${grp("Business", "background", BACKGROUNDS)}
          ${grp("Technical", "technical", TECH)}
          <div class="grp"><b>Highlights</b>${(p.highlights || []).map((h, i) =>
            `<button class="chip on" title="Remove" data-act="rmhl" data-id="${esc(p.id)}" data-i="${i}">★ ${esc(h)} ×</button>`).join("")}
            <input class="add-tag" data-id="${esc(p.id)}" placeholder="+ add tag, press Enter"></div>
        </div></div>`;
    }).join("");
  }
  $("#admin-table").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const p = Store.get(b.dataset.id);
    if (b.dataset.act === "set") Store.update(p.id, { [b.dataset.field]: b.dataset.val });
    if (b.dataset.act === "rmhl") Store.update(p.id, { highlights: p.highlights.filter((_, i) => i !== +b.dataset.i) });
    if (b.dataset.act === "del" && confirm(`Remove ${p.name}?`)) Store.remove(p.id);
    renderAdmin();
  });
  $("#admin-table").addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !e.target.matches(".add-tag")) return;
    const v = e.target.value.trim(); if (!v) return;
    const p = Store.get(e.target.dataset.id);
    Store.update(p.id, { highlights: [...(p.highlights || []), v] });
    renderAdmin(); $(`.add-tag[data-id="${p.id}"]`)?.focus();
  });
  $("#btn-export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(Store.all(), null, 2)], { type: "application/json" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "kindling-database.json" });
    a.click(); URL.revokeObjectURL(a.href);
  });
  $("#file-import").addEventListener("change", async (e) => {
    try { const data = JSON.parse(await e.target.files[0].text()); if (!Array.isArray(data)) throw 0; Store.replaceAll(data); renderAdmin(); toast(`Imported ${data.length} profiles`); }
    catch { toast("That file isn't a Kindling export"); }
    e.target.value = "";
  });
  $("#btn-reset").addEventListener("click", () => { if (confirm("Replace everything with the sample data?")) { Store.reset(); renderAdmin(); toast("Reset to sample data"); } });

  route();
})();
