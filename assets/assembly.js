(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const currentScript=document.currentScript;
const assets=new URL('img/',currentScript.src);
const captions={battery:['Individual cells','Battery modules','Modules assembled','Rack integration','Controls & enclosure','Complete energy storage'],datacentre:['Prepared space','Rack infrastructure','Server installation','Compute capacity','Power & cooling','Complete data centre'],winslow:['Vacant urban site','Foundations','Structure rising','New floors','Facade installation','Completed new homes']};
document.querySelectorAll('.assembly-scene').forEach(scene=>{
 const canvas=scene.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
 const key=scene.dataset.sequence,image=new Image(),button=scene.querySelector('button'),label=scene.querySelector('.assembly-label'),bar=scene.querySelector('.assembly-progress span');
 let ready=false,w=0,h=0,elapsed=0,previous=0,raf=0,playing=false,visible=true;
 const duration=4200;
 function sync(){button.textContent=playing?'Pause animation':'Replay animation';button.setAttribute('aria-label',button.textContent);}
 function render(progress){if(!ready||!w||!h)return;const position=Math.max(0,Math.min(5,progress*5)),first=Math.floor(position),last=Math.min(5,first+1),fraction=position-first,blend=fraction*fraction*(3-2*fraction),fw=image.naturalWidth/3,fh=image.naturalHeight/2,size=Math.min(w,h),left=(w-size)/2,top=(h-size)/2;
 ctx.clearRect(0,0,w,h);const paint=(frame,opacity)=>{ctx.globalAlpha=opacity;ctx.drawImage(image,(frame%3)*fw,Math.floor(frame/3)*fh,fw,fh,left,top,size,size);};
 paint(first,1);if(first!==last)paint(last,blend);ctx.globalAlpha=1;
 label.textContent=captions[key][Math.round(position)];bar.style.transform=`scaleX(${progress})`;
 }
 function resize(){w=canvas.clientWidth;h=canvas.clientHeight;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);render(elapsed/duration);}
 function tick(t){raf=0;if(!playing||!visible||document.hidden)return;elapsed=Math.min(duration,elapsed+Math.min(t-previous,60));previous=t;render(elapsed/duration);if(elapsed<duration)raf=requestAnimationFrame(tick);else{playing=false;button.textContent='Replay animation';button.setAttribute('aria-label','Replay '+key+' assembly animation');}}
 function resume(){if(ready&&playing&&visible&&!document.hidden&&!raf){previous=performance.now();raf=requestAnimationFrame(tick);}}
 function play(){if(!ready)return;if(raf)cancelAnimationFrame(raf);raf=0;elapsed=0;playing=true;button.textContent='Pause animation';button.setAttribute('aria-label','Pause animation');render(0);resume();}
 button.addEventListener('click',()=>{if(playing){playing=false;if(raf)cancelAnimationFrame(raf);raf=0;sync();}else play();});
 image.onload=()=>{ready=true;resize();scene.classList.add('assembly-ready');if(reduced.matches){elapsed=duration;render(1);sync();}else play();};
 image.onerror=()=>{button.hidden=true;scene.querySelector('.assembly-progress').hidden=true;label.textContent=captions[key][5];};
 image.src=new URL(key+'-sequence.webp',assets).href;
 new ResizeObserver(resize).observe(canvas);
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;resume();},{threshold:.1}).observe(scene);
 document.addEventListener('visibilitychange',resume);
 reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;if(raf)cancelAnimationFrame(raf);raf=0;elapsed=duration;render(1);sync();}});
 window.addEventListener('pageshow',e=>{if(e.persisted&&ready&&!reduced.matches)play();});
});
})();
