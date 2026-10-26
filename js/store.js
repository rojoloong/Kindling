// Tiny persistence layer. Uses localStorage so the site works on GitHub Pages with no server.
// To move to a real hosted database later (e.g. Supabase / Firebase), replace these four functions.
(function () {
  const KEY = "kindling.db.v1";
  let mem = null;

  function read() {
    if (mem) return mem;
    try {
      const raw = localStorage.getItem(KEY);
      mem = raw ? JSON.parse(raw) : null;
    } catch (e) { mem = null; }
    if (!Array.isArray(mem)) mem = JSON.parse(JSON.stringify(window.KINDLING_SEED));
    return mem;
  }
  function write(list) {
    mem = list;
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* storage blocked: keep in memory */ }
  }

  window.Store = {
    all: () => read(),
    get: (id) => read().find((p) => p.id === id),
    add(profile) {
      const list = read().slice();
      profile.id = "u" + Date.now().toString(36);
      profile.createdAt = new Date().toISOString();
      list.unshift(profile);
      write(list);
      return profile;
    },
    update(id, patch) {
      const list = read().map((p) => (p.id === id ? { ...p, ...patch } : p));
      write(list);
    },
    remove(id) { write(read().filter((p) => p.id !== id)); },
    replaceAll(list) { write(list); },
    reset() { write(JSON.parse(JSON.stringify(window.KINDLING_SEED))); }
  };
})();
