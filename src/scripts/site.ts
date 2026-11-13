const menu=document.querySelector<HTMLButtonElement>('.menu');
const nav=document.querySelector<HTMLElement>('#navigation');
const mobileViewport=window.matchMedia('(max-width:800px)');
const setMenu=(open:boolean,restoreFocus=false)=>{
 menu?.setAttribute('aria-expanded',String(open));
 menu?.setAttribute('aria-label',open?'Close navigation':'Open navigation');
 if(menu)menu.innerHTML=open?'Close <span>−</span>':'Menu <span>＋</span>';
 nav?.classList.toggle('open',open);
 document.body.classList.toggle('menu-open',open);
 document.querySelectorAll<HTMLElement>('main,footer').forEach(el=>el.inert=open);
 if(!open){nav?.querySelectorAll('details').forEach(d=>d.open=false);if(restoreFocus)menu?.focus();}
};
menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
mobileViewport.addEventListener('change',()=>setMenu(false));
document.addEventListener('keydown',event=>{
 if(!document.body.classList.contains('menu-open'))return;
 if(event.key==='Escape'){setMenu(false,true);return;}
 if(event.key==='Tab'){
  const controls=Array.from(document.querySelectorAll<HTMLElement>('header a,header button,header summary')).filter(el=>el.getClientRects().length>0);
  const first=controls[0],last=controls[controls.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
});
const dialog=document.querySelector('dialog')!;document.querySelectorAll<HTMLButtonElement>('[data-image]').forEach(b=>b.addEventListener('click',()=>{const img=dialog.querySelector('img')!;img.src=b.dataset.image!;img.alt=b.dataset.title!;dialog.querySelector('p')!.textContent=b.dataset.title!;dialog.showModal()}));dialog.querySelector('button')?.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
// Progressive enhancement: content stays visible if scripting is unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeMotion = new Set<Animation>();
const reveal = (element: Element, delay = 0) => {
  if (motionPreference.matches) return;
  const frames = element.classList.contains('section-rule') ? [
    {opacity:0,transform:'scaleX(0)'},{opacity:1,transform:'scaleX(1)'}
  ] : [
    { opacity: 0, transform: 'translateY(14px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ];
  const animation = element.animate(frames, { duration: 780, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  activeMotion.add(animation);
  animation.finished.then(() => activeMotion.delete(animation)).catch(() => activeMotion.delete(animation));
};
let revealObserver: IntersectionObserver | undefined;
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  document.querySelectorAll('.hero-content > *').forEach((element, index) => reveal(element, index * 100));
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target,Math.min(200,Number((entry.target as HTMLElement).dataset.revealDelay)||0));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal, .intro > *, .section-heading, .project, .services-grid > div:first-child, .service-list > a, .steps > article, .guarantee, .about > div, .contact .wrap').forEach(element => {
    // Do not animate content already seen or restored by browser navigation.
    if (element.getBoundingClientRect().top >= window.innerHeight) revealObserver!.observe(element);
  });
}
motionPreference.addEventListener('change', event => {
  if (event.matches) {
    revealObserver?.disconnect();
    activeMotion.forEach(animation => animation.cancel());
    activeMotion.clear();
  }
});
document.addEventListener('focusin', () => {
  activeMotion.forEach(animation => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    if (target instanceof Element && target.contains(document.activeElement)) animation.cancel();
  });
});

// Keep dropdown menus predictable for keyboard and pointer navigation.
document.querySelectorAll('nav details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if ((detail as HTMLDetailsElement).open) document.querySelectorAll('nav details').forEach(other => { if(other !== detail) (other as HTMLDetailsElement).open = false; });
  });
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelectorAll('nav details').forEach(d=>(d as HTMLDetailsElement).open=false);setMenu(false);}});
document.addEventListener('click',event=>{if(event.target instanceof Node && !nav?.contains(event.target)) document.querySelectorAll('nav details').forEach(d=>(d as HTMLDetailsElement).open=false);});
const inquiry=document.querySelector<HTMLFormElement>('#inquiry');
if (inquiry && !location.hostname.endsWith('.netlify.app') && location.hostname !== 'www.ab-bespoke.com' && location.hostname !== 'ab-bespoke.com') {
 const submit=inquiry.querySelector<HTMLButtonElement>('button[type=submit]');
 if(submit) submit.textContent='Send via email';
 inquiry.addEventListener('submit',event=>{
  event.preventDefault(); if(!inquiry.reportValidity())return;
  const data=new FormData(inquiry);const body=Array.from(data.entries()).filter(([key])=>!['form-name','bot-field'].includes(key)).map(([key,value])=>`${key}: ${value}`).join('\n\n');
  location.href=`mailto:aaron@ab-bespoke.com?subject=${encodeURIComponent('New Project Request')}&body=${encodeURIComponent(body)}`;
  const status=document.querySelector('#form-status');if(status)status.textContent='Your email app will open with your project details. Send the email to complete your inquiry.';
 });
}
// Highlight the current process step without hiding any of its explanation.
if ('IntersectionObserver' in window) {
 const stepsObserver = new IntersectionObserver(entries => {
   entries.forEach(entry => {
     if(entry.isIntersecting){document.querySelectorAll('.timeline-step[data-current]').forEach(step=>step.removeAttribute('data-current'));entry.target.setAttribute('data-current','');}
   });
 }, {rootMargin:'-15% 0px -50% 0px',threshold:0});
 document.querySelectorAll('.timeline-step').forEach(step=>stepsObserver.observe(step));
}

// Tabs enhance the approach section; all explanations remain visible without JS.
document.querySelectorAll<HTMLElement>('[data-tabset]').forEach(group=>{
 const tabs=Array.from(group.querySelectorAll<HTMLButtonElement>('[data-tab]'));
 const panels=Array.from(group.querySelectorAll<HTMLElement>('[data-panel]'));
 const select=(index:number,focus=false)=>{
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  panels.forEach((panel,i)=>panel.hidden=i!==index);
  if(focus)tabs[index]?.focus();
 };
 group.dataset.enhanced='';group.querySelector('[data-tablist]')?.setAttribute('role','tablist');
 tabs.forEach((tab,index)=>{tab.setAttribute('role','tab');tab.addEventListener('click',()=>select(index));tab.addEventListener('keydown',event=>{
  let next=index;
  if(event.key==='ArrowRight')next=(index+1)%tabs.length;
  else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=tabs.length-1;
  else return;
  event.preventDefault();select(next,true);
 });});
 panels.forEach(panel=>{panel.setAttribute('role','tabpanel');panel.tabIndex=0;});select(0);
});
document.querySelectorAll<HTMLButtonElement>('[data-project-filters] button').forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;
 document.querySelector<HTMLElement>('.portfolio-studio')?.setAttribute('data-active-filter',filter||'all');
 document.querySelectorAll('[data-project-filters] button').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
 document.querySelectorAll<HTMLElement>('[data-project-kind]').forEach(project=>project.hidden=filter!=='all'&&project.dataset.projectKind!==filter);
}));
