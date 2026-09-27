(()=>{'use strict';
const menu=document.querySelector('.menu'),nav=document.querySelector('#navigation');
function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(menu)menu.querySelector('span').textContent='＋';}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.querySelector('span').textContent=open?'−':'＋';});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menu.focus();}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const scene=document.querySelector('.hero-visual');let x=0,y=0;
function move(nx,ny){if(!scene||reduced.matches)return;x=Math.max(-1,Math.min(1,nx));y=Math.max(-1,Math.min(1,ny));scene.style.setProperty('--rx',`${-y*7}deg`);scene.style.setProperty('--ry',`${x*10}deg`);scene.style.setProperty('--px',`${x*12}px`);scene.style.setProperty('--py',`${y*8}px`);}
scene?.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=scene.getBoundingClientRect();move((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1);});
scene?.addEventListener('pointerleave',()=>move(0,0));scene?.addEventListener('blur',()=>move(0,0));
scene?.addEventListener('keydown',e=>{const directions={ArrowLeft:[-.2,0],ArrowRight:[.2,0],ArrowUp:[0,-.2],ArrowDown:[0,.2]};if(directions[e.key]){e.preventDefault();move(x+directions[e.key][0],y+directions[e.key][1]);}if(e.key==='Home')move(0,0);});
reduced.addEventListener('change',()=>{if(reduced.matches&&scene){for(const p of ['--rx','--ry','--px','--py'])scene.style.removeProperty(p);}});
})();
