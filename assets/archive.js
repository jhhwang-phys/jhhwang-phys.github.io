/* Research-library index. All text is inserted using textContent. No build tools required. */
(() => {
  'use strict';
  const ROOT = document.querySelector('[data-library]');
  if (!ROOT) return;
  const mode = ROOT.dataset.library;
  const search = document.querySelector('#library-search');
  const topic = document.querySelector('#library-topic');
  const filterRow = document.querySelector('#library-filters');
  const list = document.querySelector('#library-results');
  const status = document.querySelector('#library-status');
  const total = document.querySelector('#library-total');
  const filters = mode === 'notes' ? ['all','note'] : ['all','slide','poster','paper'];
  const names = {all:'All',note:'Notes',slide:'Slides',poster:'Posters',paper:'Papers'};
  let data = [];
  let kind = 'all';

  const make = (tag, cls, txt) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (typeof txt === 'string') el.textContent = txt;
    return el;
  };
  const normalize = (s) => (s || '').toLocaleLowerCase().normalize('NFKC');
  const makeUrl = (path) => {
    if (typeof path !== 'string') return null;
    // Constrain archive entries to local files; reject unsafe URLs and traversal.
    if (!/^files\/(notes|slides)\/[a-zA-Z0-9_./-]+\.(pdf|pptx|md|html)$/i.test(path) || path.includes('..')) return null;
    return path;
  };
  const types = mode === 'notes' ? new Set(['note']) : new Set(['slide','poster','paper']);

  function empty(message, guidance) {
    list.replaceChildren();
    const block = make('div','empty');
    block.append(make('strong','',message));
    if (guidance) block.append(make('div','',guidance));
    list.append(block);
  }
  function row(item) {
    const li = make('li','result-item');
    const top = make('div','result-top');
    const title = make('h2');
    const a = make('a','',item.title);
    const safePath = makeUrl(item.file);
    if (safePath) {
      a.href = safePath;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    } else {a.removeAttribute('href')}
    title.append(a);
    top.append(title,make('span','result-date',item.date || ''));
    li.append(top);
    if(item.summary) li.append(make('p','result-summary',item.summary));
    const tags = make('div','result-tags');
    [item.topic, ...(item.tags || [])].filter(Boolean).forEach(tag=>tags.append(make('span','',tag)));
    li.append(tags);
    if(safePath) {
      const fileline = make('div','fileline');
      const filelink = make('a','','Open file');
      filelink.href=safePath; filelink.target='_blank'; filelink.rel='noopener noreferrer';
      fileline.append(filelink);
      li.append(fileline);
    }
    return li;
  }
  function render() {
    const term = normalize(search.value.trim());
    const chosen = topic.value;
    const found = data.filter(x => (kind==='all'||x.type===kind) && (!chosen||x.topic===chosen) && (!term||normalize([x.title,x.topic,x.summary,...(x.tags||[])].join(' ')).includes(term)));
    list.replaceChildren(...found.map(row));
    status.textContent = `${found.length} result${found.length === 1 ? '' : 's'}`;
    if(!found.length) empty(data.length?'No matching items.':'No files have been published in this section yet.',data.length?'Try clearing the search or filters.':'This archive will be populated after the files are reviewed and uploaded.');
  }
  function buildFilters(){
    filterRow.replaceChildren();
    filters.forEach(f=>{
      const btn = make('button','',names[f]);
      btn.type='button';
      btn.setAttribute('aria-pressed',String(f===kind));
      btn.addEventListener('click',()=>{
        kind=f;
        [...filterRow.children].forEach(c=>c.setAttribute('aria-pressed',String(c===btn)));
        render();
      });
      filterRow.append(btn);
    });
  }
  function setTopics(){
    const topics=[...new Set(data.map(x=>x.topic).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    const opts=[new Option('All topics',''),...topics.map(x=>new Option(x,x))];
    topic.replaceChildren(...opts);
  }
  buildFilters();
  search.addEventListener('input',render);
  topic.addEventListener('change',render);
  fetch('assets/catalog.json')
    .then(r=>{if(!r.ok)throw Error('catalog unavailable');return r.json()})
    .then(json=>{
      const all = Array.isArray(json.items) ? json.items : [];
      data=all.filter(x=>x && types.has(x.type) && typeof x.title==='string' && makeUrl(x.file))
        .sort((a,b)=>(b.date||'').localeCompare(a.date||'')||a.title.localeCompare(b.title));
      total.textContent=`${data.length} published`;
      setTopics();render();
    }).catch(()=>{
      total.textContent='Catalog unavailable';
      status.textContent='Could not load the archive';
      empty('The catalog could not be loaded.','Check assets/catalog.json and GitHub Pages deployment.');
    });
})();
