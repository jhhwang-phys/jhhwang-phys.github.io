/* Year-grouped file lists. Static HTML stays available if catalog loading fails. */
(() => {
  'use strict';
  const host = document.querySelector('[data-library]');
  const archive = document.querySelector('#archive-groups');
  if (!host || !archive) return;

  const validPath = path => typeof path === 'string'
    && /^files\/(notes|slides)\/[a-zA-Z0-9_./-]+\.(pdf|pptx|md|html)$/i.test(path)
    && !path.includes('..');
  const allowed = host.dataset.library === 'notes'
    ? new Set(['note']) : new Set(['slide', 'paper', 'poster']);
  const yearFor = item => {
    const y = typeof item.year === 'string' ? Number(item.year) : item.year;
    return Number.isInteger(y) && y >= 1900 && y <= 2100 ? y : null;
  };

  fetch('assets/catalog.json?v=20261106-2', {cache: 'no-cache'})
    .then(r => {if (!r.ok) throw new Error('Catalog unavailable'); return r.json();})
    .then(catalog => {
      if (!catalog || !Array.isArray(catalog.items)) return;
      const items = catalog.items.filter(item => item && allowed.has(item.type)
        && typeof item.title === 'string' && validPath(item.file));
      if (!items.length) return;

      const groups = new Map();
      for (const item of items) {
        const year = yearFor(item);
        const label = year === null ? 'Year unknown' : String(year);
        if (!groups.has(label)) groups.set(label, []);
        groups.get(label).push(item);
      }
      const sortedYears = [...groups.keys()].sort((a, b) => {
        if (a === 'Year unknown') return 1;
        if (b === 'Year unknown') return -1;
        return Number(b) - Number(a);
      });
      const fragment = document.createDocumentFragment();
      for (const year of sortedYears) {
        const section = document.createElement('section');
        section.className = 'archive-group';
        const heading = document.createElement('h2');
        heading.className = 'archive-heading';
        heading.textContent = year;
        const ul = document.createElement('ul');
        ul.className = 'archive-list';
        for (const item of groups.get(year)) {
          const li = document.createElement('li');
          li.className = 'archive-item';
          const a = document.createElement('a');
          a.href = item.file;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = item.title;
          li.append(a);
          ul.append(li);
        }
        section.append(heading, ul);
        fragment.append(section);
      }
      archive.replaceChildren(fragment);
    })
    .catch(() => { /* Keep the pre-rendered links visible. */ });
})();
