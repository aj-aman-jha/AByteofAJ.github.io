(function(){
  // Theme toggle
  const toggle = document.getElementById('theme-toggle');
  const key = 'aj_theme';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(key);
  const isDark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (toggle) {
    toggle.checked = isDark;
    toggle.addEventListener('change', () => {
      const dark = toggle.checked;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      localStorage.setItem(key, dark ? 'dark' : 'light');
    });
  }
})();

// Client-side search
(function(){
  const input = document.getElementById('search-input');
  const grid = document.getElementById('posts');
  if(!input || !grid) return;
  let data = [];
  fetch('/search.json').then(r=>r.json()).then(j=>{ data = j; render(data); });
  function render(items){
    grid.innerHTML = '';
    items.forEach(p => {
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
      <a class="card-link" href="${p.url}">
        <figure class="card-media"><img src="${p.cover || '/assets/images/cover-1.svg'}" alt="Cover"></figure>
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-excerpt">${p.excerpt}</p>
          <div class="card-meta"><time>${p.date}</time>${p.tags && p.tags[0] ? '<span class="dot">•</span><span class="chip">#'+p.tags[0]+'</span>' : ''}</div>
        </div>
      </a>`;
      grid.appendChild(el);
    });
  }
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if(!q) return render(data);
    const res = data.filter(p => (p.title + ' ' + p.content + ' ' + (p.tags||[]).join(' ')).toLowerCase().includes(q));
    render(res);
  });
})();