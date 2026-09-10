// Copia statica della produzione: nessun suo script o collegamento al motore.
const params=new URLSearchParams(location.search),kind=document.currentScript.dataset.kind,cat=params.get('modo')==='catalog';
function apply(refined){document.documentElement.classList.toggle('refined',refined)}
apply(params.get('stile')!=='attuale');addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='typography')apply(e.data.refined)});
const q=s=>document.querySelector(s),txt=(s,v)=>{const e=q(s);if(e)e.textContent=v};
const names=['Azione 01 · attacco','Azione 02 · tiro','Azione 03 · parata','Azione 04 · occasione','Azione 05 · corner','Azione 06 · gol'];
if(kind==='work'){
 for(const s of ['#avvio','#liveBenvenuto','#catBenvenuto','#collaudo','#clFoglio','#clFine']){const e=q(s);if(e){e.classList.add('via');e.style.display='none'}}
 document.body.classList.toggle('catalogo',cat);q('#cat')?.classList.toggle('acceso',cat);if(q('.lavoro'))q('.lavoro').style.display=cat?'none':'';document.querySelectorAll('main>aside.colonna').forEach(e=>e.style.display=cat?'none':'flex');
 for(const prefix of ['tc','ct'])['H','M','S','F'].forEach((p,i)=>{const e=q('#'+prefix+p);if(e)e.value=['00','18','42','16'][i]});
 txt('#segnato','IN 00:18:30:00 · OUT 00:18:42:16');txt('#catSegnato','IN 00:18:30:00 · OUT 00:18:42:16');txt('#catQuadro','Quadro 56116');
 const rows=names.map((name,i)=>`<div class="clip2 c1 ${i===3?'scelta':''}"><div class="testa"><span class="luc frec">▸</span><div class="nome"><span class="nt">${name}</span></div><span class="scorciatoie"><span class="attr icona">✎</span><span class="attr icona lampo">⚡</span><span class="attr icona dup">⧉</span><span class="attr">+P</span></span><span class="clcam">1</span><span class="cltc">00:${12+i}</span></div></div>`).join('');
 for(const id of ['clip','catClip']){const el=q('#'+id);if(el)el.innerHTML=rows}q('#vuoto')?.remove();
 // Same baseline and proposal: scene data only, not layout changes.
 for(const img of document.querySelectorAll('img:not([src])')){img.alt='';}
}else{
 document.documentElement.classList.add('innestata');document.body.classList.add(params.get('solo')==='rundown'?'solo-rundown':'senza-rundown');
 q('#rdLista').innerHTML=names.map((n,i)=>`<div class="rd ${i===3?'cue':''}"><span class="n">${n}</span><span class="d">00:${12+i}</span><span class="piu">+ CODA</span></div>`).join('');
 q('#cdLista').innerHTML=names.slice(0,3).map((n,i)=>`<div class="cq ${i===0?'inonda':'accodata'}"><span class="n">${n}</span><span class="d">00:${12+i}</span><span class="att">×</span></div>`).join('');
 txt('#tcFine','00:00:08:12');txt('#tcTaglio','00:08');txt('#tcClip','01 / 03');txt('#tcDopo','coda in riproduzione');q('#tcRegia').classList.add('onda');
}
// Le misure restano quelle della produzione anche se un peso diverso cambia la larghezza del testo.
// Non aggiungiamo wrapper, non spostiamo né ridimensioniamo i controlli.

const $=q;
function quadroAdatta() {
  if (typeof vivoTelo !== 'undefined' && vivoTelo) return;   
  for (const [col, quadro] of [['.lavoro', '#onda'], ['.catsx', '#cat .schermo']]) {
    const c = $(col), q = $(quadro);
    if (!c || !q || getComputedStyle(c).display === 'none') continue;
    const banco = q.parentElement;
    if (!banco || !banco.classList.contains('banco') || banco.parentElement !== c) continue;
    const alto = e => { const s = getComputedStyle(e);
      if (s.display === 'none' || s.position === 'absolute' || s.position === 'fixed') return 0;
      return e.getBoundingClientRect().height + parseFloat(s.marginTop) + parseFloat(s.marginBottom); };
    
    
    
    
    
    const mv = col === '.lavoro' ? c.querySelector('#mv') : null;
    const mvVivo = !!(mv && mv.parentElement === c && getComputedStyle(mv).display !== 'none');
    let resto = 0;
    for (const f of c.children) if (f !== banco && !(mvVivo && f === mv)) resto += alto(f);
    const sb = getComputedStyle(banco);
    let hDisp = c.clientHeight - resto - parseFloat(sb.marginTop) - parseFloat(sb.marginBottom);
    
    
    
    
    
    
    
    
    const griglia = c.parentElement, sg = getComputedStyle(griglia), rc = c.getBoundingClientRect();
    let wCol = griglia.clientWidth - parseFloat(sg.paddingLeft) - parseFloat(sg.paddingRight);
    for (const f of griglia.children) if (f !== c) { const s = getComputedStyle(f), r = f.getBoundingClientRect();
      if (s.display === 'none' || s.position === 'absolute' || s.position === 'fixed') continue;
      if (Math.abs(r.left - rc.left) < 2) continue;      
      wCol -= r.width + (parseFloat(sg.columnGap) || 0); }
    let wDisp = Math.min(banco.clientWidth, wCol);
    for (const f of banco.children) if (f !== q) { const s = getComputedStyle(f);
      if (s.display !== 'none' && s.position !== 'absolute')
        wDisp -= f.getBoundingClientRect().width + (parseFloat(sb.columnGap) || 0); }
    if (hDisp < 40 || wDisp < 80) continue;        
    const hVideoNat = wDisp * 9 / 16;
    let s = 1, riquadri = [], hRiqNat = 0;
    if (mvVivo) {
      const sm = getComputedStyle(mv);
      riquadri = [...mv.querySelectorAll('.mvr')].filter(r => getComputedStyle(r).display !== 'none');
      hDisp -= parseFloat(sm.marginTop) + parseFloat(sm.marginBottom);
      if (riquadri.length) {
        const wRiqNat = (Math.min(mv.clientWidth, wCol) - (parseFloat(sm.columnGap) || 0) * (riquadri.length - 1)) / riquadri.length;
        hRiqNat = wRiqNat * 9 / 16;
      }
    }
    s = Math.min(1, hDisp / (hVideoNat + hRiqNat));
    const h = Math.floor(hVideoNat * s), w = Math.floor(h * 16 / 9);
    if (q.style.height !== h + 'px' || q.style.width !== w + 'px') {
      q.style.width = w + 'px'; q.style.height = h + 'px'; q.style.flex = '0 0 auto';
    }
    for (const r of riquadri) {
      if (s < 1) { const hr = Math.floor(hRiqNat * s), wr = Math.floor(hr * 16 / 9);
        if (r.style.height !== hr + 'px') { r.style.width = wr + 'px'; r.style.height = hr + 'px'; r.style.flex = '0 0 auto'; } }
      else if (r.style.height) { r.style.width = ''; r.style.height = ''; r.style.flex = ''; }   
    }
  }
}
if(kind==='work'){
 const poster='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#090e12"/></svg>');
 if(q('#onda'))q('#onda').src=poster;
 if(q('#catVideo'))q('#catVideo').poster=poster;
 requestAnimationFrame(()=>requestAnimationFrame(quadroAdatta));addEventListener('resize',quadroAdatta);
}
