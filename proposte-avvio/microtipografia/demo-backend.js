// Isolated proposal: no request reaches the production engine.
window.__demoErrors=[];window.__demoCalls=[];
addEventListener('error',e=>__demoErrors.push(e.message));
addEventListener('unhandledrejection',e=>__demoErrors.push(String(e.reason)));
window.demoClips=Array.from({length:8},(_,i)=>({nome:'Azione_'+String(i+1).padStart(2,'0'),dentro:500+i*1000,fuori:1100+i*1000,cam:1+i%3}));
window.demoPlaylists=[{nome:'Highlights',clip:demoClips.slice(0,4).map(x=>x.nome),loop:0,col:'verde'},{nome:'Secondo_tempo',clip:demoClips.slice(4).map(x=>x.nome),loop:0,col:'blu'}];
demoPlaylists.forEach(p=>{p.quante=p.clip.length;p.quadri=p.quante*601;p.secondi=p.quadri/50});
const useSeba=new URLSearchParams(location.search).get('modo')!=='catalog';
if(useSeba){
 window.demoClips=sebaSnapshot.elenco.risposta.split(' ').slice(2).map(t=>{const [nome,range,quanti,anello,protetta,cam]=t.split(':'),[dentro,fuori]=range.split('-').map(Number);return {nome,dentro,fuori,quanti:Number(quanti),cam:Number(cam),protetta:protetta==='1'}});
 window.demoPlaylists=sebaSnapshot['scaletta elenco'].risposta.split(' ').slice(2).map(t=>{const [nome,loop,clips,col]=t.split(':');return {nome,loop:Number(loop),clip:clips.split(','),col}});
}
window.fetch=async(input,options)=>{
 const u=new URL(typeof input==='string'?input:input.url,location.href),p=u.pathname;__demoCalls.push(p);
 let d={errore:'Anteprima grafica: questa operazione richiede il motore di produzione.'};
 if(p==='/stato'&&useSeba)d=sebaSnapshot.stato;
 else if(p==='/stato')d={modo:'vivo',testina:56116,quanti:180000,primo:0,leva:0,dentro:-1,segnale:1,angolo:1,cam2:1,cam3:1,tc:56116,registra:1,cartella:'/Anteprima'};
 else if(p.startsWith('/di/')){
 const c=decodeURIComponent(p.slice(4)).replaceAll('+',' ');let r='';
 if(c==='stato')r='stato ok modo=vivo testina=56116 quanti=180000 primo=0 leva=0 dentro=-1 segnale=1 angolo=1 cam2=1 cam3=1 registra=1';
 else if(c==='camere')r='camere ok 1:1:00:18:42:16 2:1:00:18:42:16 3:1:00:18:42:16';
 else if(c==='elenco')r='elenco ok '+demoClips.map(k=>`${k.nome}:${k.dentro}-${k.fuori}:${k.fuori-k.dentro}:0:0:${k.cam}`).join(' ');
 else if(c==='scaletta elenco')r='scaletta ok '+demoPlaylists.map(k=>`${k.nome}:0:${k.clip.join(',')}:${k.col}`).join(' ');
 else if(c==='tclista')r='tclista ok';
 else if(c==='slowmo elenco')r='slowmo ok Azione_01__SLOWMO:1200:2:0:600:Azione_01';
 else r='errore anteprima_grafica';
 d=useSeba&&sebaSnapshot[c]?sebaSnapshot[c]:{risposta:r};
 }else if(p==='/vivo/esporta_formati')d={dove:'/Anteprima/Esportazioni',formati:[{nome:'originale',etichetta:'originale · copia senza ricodifica'},{nome:'hevc',etichetta:'HEVC 4:2:2 10 bit'},{nome:'prores422',etichetta:'ProRes 422'},{nome:'prores422lt',etichetta:'ProRes 422 LT'},{nome:'mjpeg',etichetta:'MJPEG'}]};
 else if(p==='/cat/clip')d=demoClips;
 else if(p==='/cat/pl')d=demoPlaylists;
 else if(p==='/cat/slowmo_elenco')d=[];
 else if(p==='/vivo/motore')d={acceso:true};
 else if(p==='/cat/elenco'||p==='/vivo/sessioni')d=[];
 else if(p.includes('slowmo')||p.endsWith('/pronti'))d={};
 else if(p==='/vivo/spazio')d={libero_gb:500,totale_gb:1000,cartella:'/Anteprima',codec:'prores422',anello:45};
 return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}});
};
// Local media placeholders keep the original video geometry without live inputs.
window.demoPoster='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#080c0e"/><text x="960" y="540" text-anchor="middle" fill="#75858a" font-family="sans-serif" font-size="28">ANTEPRIMA · VIDEO NON COLLEGATO</text></svg>');
window.demoCameraPosters=[1,2,3].map(n=>'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#080c0e"/><text x="960" y="540" text-anchor="middle" fill="#75858a" font-family="sans-serif" font-size="62">CAM '+n+' · ANTEPRIMA</text></svg>'));
const imageSrc=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
Object.defineProperty(HTMLImageElement.prototype,'src',{get:imageSrc.get,set(v){const camera=String(v).match(/^\/cam([123])\.jpg(?:\?|$)/);if(camera)v=demoCameraPosters[Number(camera[1])-1];else if(String(v).startsWith('/'))v=demoPoster;if(this.src!==v)imageSrc.set.call(this,v)}});
