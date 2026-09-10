(() => {
  const requested = Number(new URLSearchParams(location.search).get('lavori'));
  const count = [2, 10, 15].includes(requested) ? requested : 15;
  const live = document.body.classList.contains('live');
  const names = live ? [
    'Derby · secondo tempo', 'Derby · primo tempo', 'Prova in regia',
    'Lugano – Zurigo · secondo tempo', 'Lugano – Zurigo · primo tempo',
    'Intervista post-partita', 'Finale coppa · supplementari', 'Finale coppa · secondo tempo',
    'Finale coppa · primo tempo', 'Semifinale · gara 2', 'Semifinale · gara 1',
    'Allenamento · campo centrale', 'Amichevole · riprese CAM 2',
    'Test multicamera', 'Apertura stagione · presentazione delle squadre'
  ] : [
    'Derby · highlights', 'Derby · tutte le azioni', 'Interviste post-partita',
    'Lugano – Zurigo · sintesi', 'Lugano – Zurigo · partita integrale',
    'Gol della settimana', 'Finale coppa · highlights', 'Finale coppa · cerimonia',
    'Finale coppa · partita integrale', 'Semifinali · migliori azioni',
    'Semifinale gara 1 · sintesi', 'Allenamento · selezione tecnica',
    'Amichevole · montaggio', 'Promo nuova stagione', 'Apertura stagione · presentazione delle squadre'
  ];
  const list = document.querySelector('#recent-list');
  list.replaceChildren();
  names.slice(0,count).forEach((name, i) => {
    const article = document.createElement('article'); article.className = 'recent';
    const open = document.createElement('button'); open.className = 'open-recent'; open.dataset.demo = 'Riprendi: ' + name;
    const strong = document.createElement('strong'); strong.textContent = name;
    const meta = document.createElement('span');
    const duration = [48, 52, 16, 49, 51, 12, 31, 48, 53, 96, 94, 35, 62, 8, 24][i];
    meta.textContent = live ? `${String(Math.max(1,8-Math.floor(i/2))).padStart(2,'0')} set · ${duration} min · ${[12,9,4,18,11,3,7,14,10,22,19,6,15,2,8][i]} clip · ${1+i%3} playlist` : `${duration} min${i===3 ? ' · proxy al 40%' : ''}`;
    open.append(strong,meta);
    const remove = document.createElement('button'); remove.className = 'remove'; remove.dataset.remove = name;
    remove.setAttribute('aria-label','Elimina '+name); remove.textContent = '×';
    article.append(open,remove); list.append(article);
  });
  document.querySelector('.count').textContent = count;
  document.querySelector('.demo-label').textContent = 'Scorri l’elenco';
  document.querySelectorAll('[data-count]').forEach(a=>{
    if (Number(a.dataset.count)===count) a.setAttribute('aria-current','page');
  });
  document.querySelectorAll('.preview-nav a,.design-nav a,.background-nav a').forEach(a=>{
    const url = new URL(a.href); url.searchParams.set('lavori',count); a.href=url.href;
  });
})();
