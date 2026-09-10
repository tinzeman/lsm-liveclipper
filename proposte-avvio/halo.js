(() => {
  const halo = document.querySelector('.halo');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, x = 0, y = 0, tx = 0, ty = 0;
  function move() {
    frame = 0;
    if (reduced.matches || document.hidden) return;
    x += (tx - x) * 0.055; y += (ty - y) * 0.055;
    halo.style.setProperty('--mx', `${x}px`);
    halo.style.setProperty('--my', `${y}px`);
    if (Math.abs(tx-x)+Math.abs(ty-y)>0.1) frame=requestAnimationFrame(move);
  }
  function start() { if (!frame) frame=requestAnimationFrame(move); }
  addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||reduced.matches) return;
    tx=(e.clientX/innerWidth-.5)*55;ty=(e.clientY/innerHeight-.5)*35;start();
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{tx=ty=0;start();});
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;x=y=tx=ty=0;halo.style.setProperty('--mx','0px');halo.style.setProperty('--my','0px');});
})();
