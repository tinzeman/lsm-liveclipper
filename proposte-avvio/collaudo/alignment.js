// Allineamento della sola proposta al controllo di produzione (09/09/2026).
// Nessuna richiesta HTTP al motore: gli esiti restano esempi espliciti.
let testKind='breve',shortPassed=false,selectedFile=true;
const originalRender=render;
const cardPicker=document.querySelector('[aria-labelledby="card-label"]');
cardPicker.dataset.options='AJA KONA 4';
const extra=document.createElement('div');
extra.id='test-settings';
extra.innerHTML=`<details class="test-settings"><summary>Parametri della prova <span id="test-kind-label">Breve · 9 min</span></summary><div class="field"><label for="test-ring">Anello · minuti</label><input id="test-ring" type="number" value="45" min="0" max="240"></div><div class="switch" aria-label="Tipo di prova"><button id="short-kind" aria-pressed="true">Prova breve</button><button id="long-kind" aria-pressed="false" disabled>Prova lunga</button></div><p class="hint" id="long-note">La prova lunga si sblocca dopo una prova breve superata con la stessa configurazione.</p><div class="pair" id="short-settings"><div class="field"><label for="test-minutes">Registrazione · min</label><input id="test-minutes" type="number" min="3" max="60" value="9"></div><div class="field"><label for="test-rounds">Ripetizioni del lavoro</label><input id="test-rounds" type="number" min="1" max="5" value="1"></div></div><div class="pair" id="long-settings" hidden><div class="field"><label for="test-hours">Durata · ore</label><input id="test-hours" type="number" min="0.5" max="12" step="0.5" value="2"></div><div class="field"><label for="test-every">Ripeti il lavoro · min</label><input id="test-every" type="number" min="15" max="240" value="60"></div></div><p class="hint">I minuti di registrazione non sono la durata totale del collaudo: si aggiungono preparazione, operazioni e rapporto.</p></details>`;
$('#live-fields').appendChild(extra);
const controls=document.createElement('span');controls.className='extra-scenarios';controls.innerHTML='<button data-scene="reserved" aria-pressed="false">Con riserva</button><button data-scene="stopped" aria-pressed="false">Interrotto</button>';$('.scenario').appendChild(controls);
states.reserved=['!','ESITO CON RISERVA','Verifiche non conclusive','Non tutte le verifiche permettono di confermare il risultato.','Prova terminata','—','09:00','—','—',100,'Prova terminata con verifiche non conclusive.'];
states.stopped=['■','PROVA INTERROTTA','Collaudo interrotto','Restano disponibili le verifiche effettuate prima dell’interruzione.','Interrotta','—','05:12','—','—',58,'Prova interrotta. Risultati parziali disponibili.'];
function invalidate(){checked=false;shortPassed=false;testKind='breve';state='idle';render();}
function alignSteps(){
 const names=mode==='live'?['Sistema','Preparazione del banco','Segnale SDI','Registrazione','Operazioni di replay','Verifica delle misure','Arresto del banco','Rapporto']:['Importazione del girato','Creazione del proxy','Confronto proxy e sorgente','Marcatura ed esportazione','Clip e playlist','Slow-motion sotto carico','Verifica delle protezioni','Rapporto'];
 const current=mode==='live'?3:2;
 const labels={waiting:'In attesa',passed:'Superata',running:'In corso',failed:'Problema',skipped:'Non eseguita',uncertain:'Non conclusiva',stopped:'Interrotta'};
 const st=names.map((_,i)=>state==='idle'?'waiting':state==='done'?'passed':state==='error'?(i===current?'failed':'passed'):state==='reserved'?(i===current?'uncertain':i===5?'skipped':'passed'):state==='stopped'?(i<current?'passed':i===current?'stopped':'skipped'):i<current?'passed':i===current?'running':'waiting');
 $('#steps-list').innerHTML=names.map((name,i)=>`<li class="step ${st[i]}"><span class="step-dot" aria-hidden="true">${st[i]==='passed'?'✓':st[i]==='failed'?'!':st[i]==='skipped'?'−':''}</span><div><strong>${name}</strong><span>${labels[st[i]]}</span></div><span class="step-number">${String(i+1).padStart(2,'0')}</span></li>`).join('');
 $('#steps-summary').textContent=st.filter(s=>s==='passed').length+' / '+names.length+' superate'+(state==='reserved'?' · con riserva':state==='stopped'?' · esito parziale':'');
 $('#running-phase').textContent=`Fase ${String(current+1).padStart(2,'0')} / 08 · ${names[current]}`;
 if(state==='running')$('#phase').textContent=names[current];
}
render=function(){
 originalRender();alignSteps();
 const cat=mode==='catalog',running=state==='running',ended=['done','error','reserved'].includes(state);
 if(state==='done'&&!cat&&testKind==='breve'){shortPassed=true;checked=true;prepared=true;}
 $('#prepare').hidden=cat;
 $('#start').disabled=running||(cat?!selectedFile:!checked);
 $('#long-kind').disabled=!shortPassed||running;
 $('#short-kind').disabled=running;
 $('#short-kind').setAttribute('aria-pressed',String(testKind==='breve'));
 $('#long-kind').setAttribute('aria-pressed',String(testKind==='lunga'));
 $('#short-settings').hidden=testKind!=='breve';$('#long-settings').hidden=testKind!=='lunga';
 $('#test-kind-label').textContent=testKind==='breve'?`Breve · ${$('#test-minutes').value} min`:`Lunga · ${$('#test-hours').value} ore`;
 $('#long-note').textContent=shortPassed?'Prova breve superata · prova lunga disponibile.':'La prova lunga si sblocca dopo una prova breve superata con la stessa configurazione.';
 $('#quality').min=/HEVC/.test($('#codec>button').textContent)?20:50;$('#quality').max=/HEVC/.test($('#codec>button').textContent)?400:100;
 $('#progress-label').textContent=cat?'Durata variabile':testKind==='breve'?`${$('#test-minutes').value} min di registrazione`:`${$('#test-hours').value} ore di registrazione`;
 $('#remaining').textContent=ended?'Prova terminata':state==='stopped'?'Stima interrotta':running?'Tempo rimanente · da stimare':'Tempo rimanente —';
 $('#running-remaining').textContent='Tempo rimanente · da stimare';
 if(cat){
  $('#monitor-codec').textContent='File sorgente';$('.monitor-meta').firstChild.textContent='Formato del file ';$('.monitor-corner').textContent='Formato del file';$('.timecode>span:last-child').textContent='— fps';
  $('#action-note').textContent=running?'Prova simulata in corso.':selectedFile?'File selezionato. La prova non utilizza la scheda.':'Seleziona un file per abilitare la prova.';
  const vals=state==='idle'?['—','—']:state==='running'?['8','0']:state==='error'?['17','1']:state==='reserved'?['17','0']:state==='stopped'?['8','0']:['18','0'];
  $('#fps').innerHTML=vals[0]+'<small>verifiche</small>';$('#dropped').innerHTML=vals[1]+'<small>verifiche</small>';
  $('#fps').previousElementSibling.textContent='Superate';$('#dropped').previousElementSibling.textContent='Fallite';
  $('#tc').textContent='--:--:--:--';
  if(state==='error')$('#message').textContent='Confronto proxy/sorgente: una verifica fallita · esempio.';
  if(state==='reserved'){$('#status-copy').textContent='Il girato campionato non permette di dimostrare l’allineamento; una prova sotto carico non è stata eseguita.';$('#message').textContent='Nessuna verifica fallita, ma risultato non conclusivo · esempio.';}
 }else{
  $('.monitor-meta').firstChild.textContent='1080p50 ';$('.monitor-corner').textContent='1920 × 1080';$('.timecode>span:last-child').innerHTML='50 <small>fps</small>';
  $('#monitor-codec').textContent=$('#codec>button').textContent.split(' · ')[0];
  $('#fps').previousElementSibling.textContent='Uscita';$('#dropped').previousElementSibling.textContent='Quadri persi';
 }
 // Le scelte del banco restano ferme durante la prova; il selettore degli esempi resta attivo.
 document.querySelectorAll('.configuration input,.configuration .pick>button,#folder,#file,[data-mode]').forEach(el=>{el.disabled=running||(el.id==='quality'&&!/HEVC|MJPEG/.test($('#codec>button').textContent));});
};
$('#short-kind').onclick=()=>{testKind='breve';render()};$('#long-kind').onclick=()=>{if(shortPassed){testKind='lunga';state='idle';render()}};
for(const id of ['test-ring','test-minutes','test-rounds','test-hours','test-every'])$('#'+id).onchange=()=>{const input=$('#'+id);if(!input.checkValidity()){input.reportValidity();return;}render()};
$('.configuration').addEventListener('click',e=>{if(e.target.closest('.options button'))invalidate()});
$('#quality').addEventListener('change',invalidate);
// Anche il cambio cartella rende obsoleta la verifica del disco precedente.
dialog.addEventListener('click',e=>{if(e.target.matches('.choice')&&$('#dialog-label').textContent==='DESTINAZIONE')invalidate()});
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;state='idle';checked=prepared=false;render()});
document.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>{state=b.dataset.scene;render()});
function confirmAction(title,copy,action){show('CONFERMA',title,`<p>${copy}</p><button class="primary" id="confirm-action">Conferma</button>`);$('#dialog-ok').textContent='Annulla';$('#confirm-action').onclick=()=>{dialog.close();action()};}
dialog.addEventListener('close',()=>$('#dialog-ok').textContent='Chiudi');
$('#start').onclick=()=>{if($('#start').disabled)return;confirmAction(mode==='catalog'?'Avvia la prova sul girato?':'Avvia il collaudo?',mode==='catalog'?'Nella versione integrata verrà creato un progetto temporaneo per verificare importazione, proxy ed export. Il file sorgente verrà soltanto letto. Qui avvii una simulazione.':'Nella versione integrata la prova utilizzerà la scheda di acquisizione. Qui avvii soltanto una simulazione.',()=>{state='running';render()})};
$('#stop').onclick=()=>confirmAction('Interrompi il collaudo?','La prova resterà incompleta e le verifiche già effettuate saranno consultabili.',()=>{state='stopped';render()});
const liveReport=$('#report').onclick;
$('#report').onclick=()=>{
 if(mode==='live'&&!['reserved','stopped'].includes(state))return liveReport();
 const rows=mode==='catalog'?[['Importazione e proxy',state==='idle'?'Non eseguita':'Vedi esiti delle fasi'],['Confronto dei fotogrammi',state==='error'?'Problema':state==='reserved'?'Non conclusivo':state==='done'?'Superato':'Incompleto'],['Marcatura ed export',state==='done'?'Superati':'Vedi registro'],['Clip, playlist e slow-motion',state==='reserved'?'Una verifica non eseguita':'Vedi registro'],['Protezioni',state==='done'?'Superate':'Vedi esiti delle fasi']]:[['Esito',state==='stopped'?'Interrotto':'Con riserva'],['Verifiche completate','Consulta le fasi'],['Verifiche mancanti','Non considerate superate']];
 show('RAPPORTO / '+mode.toUpperCase(),'Risultati della prova','<p>Esempio illustrativo · non sono misure del sistema.</p>'+rows.map(([a,b])=>`<div class="report-row"><span>${a}</span><b>${b}</b></div>`).join(''));
};
$('#log').onclick=()=>{const list=[...document.querySelectorAll('.step')].map(s=>s.querySelector('strong').textContent+' · '+s.querySelector('div>span').textContent);show('REGISTRO / '+mode.toUpperCase(),'Eventi della prova','<p>Registro illustrativo, coerente con lo stato selezionato.</p><pre>'+list.join('\n')+'</pre>')};
render();
