(()=>{'use strict';
const media=matchMedia('(prefers-reduced-motion: reduce)');
// Perspective-projected three-dimensional geometry, with depth sorting and lighting.
document.querySelectorAll('.depth-scene').forEach(scene=>{
 const canvas=scene.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
 const button=scene.querySelector('button'),shape=scene.dataset.shape;
 const vertices=[],edges=[];let w=0,h=0,angle=.45,pitch=-.3,paused=media.matches,drag=false,lastX=0,lastY=0,inView=true,frame=0,lastTime=0,elapsed=0;
 const add=(x,y,z)=>{vertices.push([x,y,z]);return vertices.length-1;};
 const line=(a,b)=>edges.push([a,b]);
 function ring(radius,y,phase=0,axis=0){let start=vertices.length;for(let i=0;i<72;i++){const t=i/72*Math.PI*2+phase;let p=[Math.cos(t)*radius,y,Math.sin(t)*radius];if(axis===1)p=[p[0],p[2],p[1]];if(axis===2)p=[p[1],p[0],p[2]];add(...p);line(start+i,start+(i+1)%72);}}
 if(shape==='torus'){for(let j=0;j<18;j++){let start=vertices.length;for(let i=0;i<60;i++){let u=i/60*2*Math.PI,v=j/18*2*Math.PI;add((1.15+.38*Math.cos(v))*Math.cos(u),.38*Math.sin(v),(1.15+.38*Math.cos(v))*Math.sin(u));line(start+i,start+(i+1)%60);if(j)line(start+i,start-60+i);}}}
 else if(shape==='sphere'){for(let j=1;j<12;j++){let t=j/12*Math.PI;ring(1.35*Math.sin(t),1.35*Math.cos(t));}for(let j=0;j<8;j++){let s=vertices.length;for(let i=0;i<60;i++){let t=i/60*2*Math.PI,a=j/8*Math.PI;add(1.35*Math.sin(t)*Math.cos(a),1.35*Math.cos(t),1.35*Math.sin(t)*Math.sin(a));line(s+i,s+(i+1)%60);}}}
 else if(shape==='lattice'){for(let x=0;x<5;x++)for(let y=0;y<5;y++)for(let z=0;z<5;z++){const n=add((x-2)*.56,(y-2)*.56,(z-2)*.56);if(x)line(n,n-25);if(y)line(n,n-5);if(z)line(n,n-1);}}
 else if(shape==='wave'){for(let j=0;j<23;j++)for(let i=0;i<35;i++){const x=(i-17)/11,z=(j-11)/8;const n=add(x,Math.sin(x*2.5+z*1.6)*.47,z);if(i)line(n,n-1);if(j)line(n,n-35);}}
 else if(shape==='helix'){for(let j=0;j<2;j++)for(let i=0;i<110;i++){const t=i/109*4*Math.PI+j*Math.PI;const n=add(.8*Math.cos(t),(i/109-.5)*2.9,.8*Math.sin(t));if(i)line(n,n-1);if(j&&i%5===0)line(n,n-110);}}
 else if(shape==='layers'){for(let j=0;j<9;j++){const s=vertices.length,y=(j-4)*.24,r=1.1;for(let i=0;i<4;i++){let t=i/4*2*Math.PI+Math.PI/4+j*.045;add(Math.cos(t)*r,y,Math.sin(t)*r);line(s+i,s+(i+1)%4);if(j)line(s+i,s-76+i);}ring(.5,y);}}
 else{ring(1.35,0,0,0);ring(1.35,0,0,1);ring(1.35,0,0,2);for(let j=0;j<5;j++)ring(.65+j*.08,(j-2)*.12,0,1);}
 function draw(){ctx.clearRect(0,0,w,h);const scale=Math.min(w,h)*.30,ca=Math.cos(angle),sa=Math.sin(angle),cp=Math.cos(pitch),sp=Math.sin(pitch);
 const points=vertices.map(([x,y,z])=>{let xx=x*ca-z*sa,zz=x*sa+z*ca,yy=y*cp-zz*sp;zz=y*sp+zz*cp;const f=4.8/(4.8+zz);return [w/2+xx*scale*f,h/2+yy*scale*f,zz,f];});
 const glow=ctx.createRadialGradient(w/2,h/2,10,w/2,h/2,Math.min(w,h)*.49);glow.addColorStop(0,'rgba(72,171,236,.10)');glow.addColorStop(1,'rgba(72,171,236,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 edges.map(e=>({e,z:(points[e[0]][2]+points[e[1]][2])/2})).sort((a,b)=>b.z-a.z).forEach(({e,z})=>{const a=points[e[0]],b=points[e[1]],light=Math.max(.12,Math.min(.86,.48-z*.19));ctx.strokeStyle=`rgba(111,193,249,${light})`;ctx.lineWidth=shape==='layers'?1.6:1;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();});
 const step=shape==='lattice'?1:Math.max(1,Math.floor(points.length/32));points.forEach((p,i)=>{if(i%step)return;ctx.fillStyle=p[2]<0?'#d4eeff':'#397faa';ctx.beginPath();ctx.arc(p[0],p[1],(shape==='lattice'?2.1:1.8)*p[3],0,Math.PI*2);ctx.fill();});}
 function resize(){w=canvas.clientWidth;h=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
 function tick(time){frame=0;if(!inView||document.hidden||paused||media.matches)return;elapsed+=Math.min(time-lastTime,50);lastTime=time;const progress=Math.min(elapsed/3000,1),ease=1-Math.pow(1-progress,3);angle=-2.4+ease*2.85;pitch=-.7+ease*.4;draw();if(progress<1){frame=requestAnimationFrame(tick);}else{paused=true;sync();}}
 function start(){if(!frame&&!paused&&!media.matches&&inView&&!document.hidden){lastTime=performance.now();frame=requestAnimationFrame(tick);}}
 function sync(){button.textContent=media.matches?'Reset view':paused?'Replay animation':'Pause animation';button.removeAttribute('aria-pressed');}
 button.addEventListener('click',()=>{if(media.matches){angle=.45;pitch=-.3;draw();return;}if(paused){elapsed=0;paused=false;}else{paused=true;}sync();start();});
 canvas.addEventListener('pointerdown',e=>{drag=true;paused=true;sync();lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;angle+=(e.clientX-lastX)*.009;pitch=Math.max(-1.2,Math.min(1.2,pitch+(e.clientY-lastY)*.004));lastX=e.clientX;lastY=e.clientY;draw();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{drag=false;});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();paused=true;sync();angle+=e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0;pitch+=e.key==='ArrowUp'?-.12:e.key==='ArrowDown'?.12:0;draw();});
 new ResizeObserver(resize).observe(canvas);new IntersectionObserver(es=>{inView=es[0].isIntersecting;start();},{threshold:.05}).observe(scene);
 document.addEventListener('visibilitychange',start);media.addEventListener('change',()=>{paused=media.matches;elapsed=0;sync();draw();start();});sync();resize();start();
});
// Carry the same perspective language into content on every route.
document.querySelectorAll('.detail-grid article,.approach-list article,.contact-grid>div').forEach(card=>{
 card.classList.add('depth-card');
 card.addEventListener('pointermove',e=>{if(media.matches||e.pointerType==='touch')return;let r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${-(e.clientY-r.top-r.height/2)/r.height*5}deg`);card.style.setProperty('--tilt-y',`${(e.clientX-r.left-r.width/2)/r.width*6}deg`);});
 card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
});
})();
