const menu=document.querySelector('.menu');const nav=document.querySelector('nav');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav?.classList.toggle('open',open)});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu?.setAttribute('aria-expanded','false');nav.classList.remove('open')}));const dialog=document.querySelector('dialog')!;document.querySelectorAll<HTMLButtonElement>('[data-image]').forEach(b=>b.addEventListener('click',()=>{const img=dialog.querySelector('img')!;img.src=b.dataset.image!;img.alt=b.dataset.title!;dialog.querySelector('p')!.textContent=b.dataset.title!;dialog.showModal()}));dialog.querySelector('button')?.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
// Progressive enhancement: content stays visible if scripting is unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeMotion = new Set<Animation>();
const reveal = (element: Element, delay = 0) => {
  if (motionPreference.matches) return;
  const animation = element.animate([
    { opacity: 0, transform: 'translateY(14px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 780, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  activeMotion.add(animation);
  animation.finished.then(() => activeMotion.delete(animation)).catch(() => activeMotion.delete(animation));
};
let revealObserver: IntersectionObserver | undefined;
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  document.querySelectorAll('.hero-content > *').forEach((element, index) => reveal(element, index * 100));
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
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
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelectorAll('nav details').forEach(d=>(d as HTMLDetailsElement).open=false);nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}});
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
