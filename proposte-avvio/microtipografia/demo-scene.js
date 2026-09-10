(()=>{
 const params=new URLSearchParams(location.search),kind=document.currentScript.dataset.kind;
 const apply=v=>document.documentElement.classList.toggle('refined',v);
 apply(params.get('stile')!=='attuale');addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='typography')apply(e.data.refined)});
 if(kind==='work'){
 const start=async()=>{
 for(const sel of ['#avvio','#liveBenvenuto','#catBenvenuto','#collaudo','#clFoglio','#clFine']){const el=document.querySelector(sel);if(el){el.classList.add('via');el.style.display='none'}}
 catMostra(params.get('modo')==='catalog'?'cat':'live');
 cat.prog='Partita_dimostrativa';cat.fps=50;cat.quadri=180000;cat.durata=3600;cat.pl=[];
 Object.assign(S,{modo:'vivo',testina:56116,quanti:180000,leva:0,dentro:-1,segnale:1,angolo:1,cam2:1,cam3:1});
 document.querySelector('#catVideo').poster=demoPoster;document.querySelector('#onda').src=demoPoster;
 await aggiornaClip();await aggiornaScalette();await catClipElenco();await catPlElenco();
 if(params.get('stato')==='preparato'&&params.get('modo')!=='catalog'){prvModo=true;prv={cam:1,riga:0,tc:'15:09:57:24',tcn:2729874};prvDipingi()}
 requestAnimationFrame(quadroAdatta);
 };
 setTimeout(()=>start().catch(e=>__demoErrors.push(String(e))),350);
 }else{
 const state={prog:params.get('modo')==='catalog'?'Catalog · Partita dimostrativa':'Live · Partita dimostrativa',attiva:true,fps:50,rate:0,inMoto:false,pos:4,resta_s:32,loopSiPuo:true,rifacendo:false,avviso:'',cue:{nome:demoClips[3].nome},tc:{pos_q:200,taglio_q:400,fine_q:1600,clip_n:1,clip_tot:3,prossima:demoClips[1].nome},clip:demoClips.map(k=>({nome:k.nome,s:12})),pl:demoPlaylists.map(k=>({nome:k.nome,s:48,quante:4})),sm:[{nome:'Azione_01__SLOWMO',s:24}],voci:demoClips.slice(0,3).map((k,i)=>({nome:k.nome,i,org:k.nome,s:12,loop:false,stato:i?'accodata':'inonda'}))};
 state.precarica={totale:8,fatti:8,stato:'finita',male:[]};
 state.voci.push({nome:demoPlaylists[0].nome,id:'demo-pl',pl:true,da:3,quante:2,s:24,stato:'accodata',dentro:demoClips.slice(3,5).map((k,i)=>({nome:k.nome,i:i+3,s:12,stato:'accodata'}))});
 if(useSeba){state.prog='seba_multicam';state.clip=demoClips.map(k=>({nome:k.nome,s:Math.round(k.quanti/5)/10}));const lengths=Object.fromEntries(demoClips.map(k=>[k.nome,k.quanti]));state.pl=demoPlaylists.map(k=>({nome:k.nome,quante:k.clip.length,s:+(k.clip.reduce((a,n)=>a+(lengths[n]||0),0)/50).toFixed(1)}));state.sm=sebaSnapshot['slowmo elenco'].risposta.split(' ').slice(2).map(t=>{const [nome,q,fattore]=t.split(':');return {nome,s:+(Number(q)/Number(fattore)/50).toFixed(1)}})}
 if(params.get('stato')!=='preparato'){Object.assign(state,{attiva:false,cue:null,voci:[],precarica:null})}
 const render=()=>{S=state;vistoA=Date.now();dipingi()};render();setInterval(render,1000);
 }
})();
