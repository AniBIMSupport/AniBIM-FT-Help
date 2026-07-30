function normalizeLanguage(v){return String(v||'').toLowerCase().startsWith('de')?'de':'en'}
function setLanguage(v){
 const l=normalizeLanguage(v);document.body.classList.remove('lang-en','lang-de');document.body.classList.add('lang-'+l);document.documentElement.lang=l;
 document.querySelectorAll('.lang button[data-switch-lang]').forEach(b=>b.classList.toggle('active',b.dataset.switchLang===l));
 document.querySelectorAll('a[data-keep-lang="true"]').forEach(a=>{const base=a.dataset.baseHref||a.getAttribute('href').split('?')[0].split('#')[0];const hash=(a.getAttribute('href').match(/#.*$/)||[''])[0];a.dataset.baseHref=base;a.href=base+'?lang='+l+hash});
 document.querySelectorAll('[data-placeholder-'+l+']').forEach(e=>e.placeholder=e.getAttribute('data-placeholder-'+l));
 document.querySelectorAll('img[data-lang-image="ribbon"]').forEach(img=>{const ext=img.src.toLowerCase().includes('.jpg')?'jpg':'png';img.src='assets/ribbon_'+l+'.'+ext});
 try{localStorage.setItem('anibim-lang',l)}catch(e){}
 document.dispatchEvent(new CustomEvent('anibim-language-changed',{detail:{language:l}}));
}
(function(){const q=new URLSearchParams(location.search);let l=q.get('lang');if(!l){try{l=localStorage.getItem('anibim-lang')}catch(e){}}setLanguage(l||navigator.language||'en')})();

// AniBIM Command Finder — Ctrl/Cmd + K, live bilingual search, direct navigation.
(function(){
 const overlay=document.getElementById('doc-command'), trigger=document.getElementById('doc-search-trigger'), input=document.getElementById('doc-command-input'), results=document.getElementById('doc-command-results'), close=document.getElementById('doc-command-close');
 if(!overlay||!trigger||!input||!results)return;
 const articles=[...document.querySelectorAll('article.tool-section[id]')].map(a=>{const h=a.querySelector('h2');const panel=a.querySelector('.kicker');return {id:a.id,titleEn:h?.querySelector('[data-lang="en"]')?.textContent.trim()||h?.textContent.trim()||a.id,titleDe:h?.querySelector('[data-lang="de"]')?.textContent.trim()||h?.textContent.trim()||a.id,panelEn:panel?.querySelector('[data-lang="en"]')?.textContent.trim()||'',panelDe:panel?.querySelector('[data-lang="de"]')?.textContent.trim()||''}});
 function lang(){return document.body.classList.contains('lang-de')?'de':'en'}
 function render(){const q=input.value.trim().toLowerCase();const l=lang();const items=articles.filter(x=>(x.titleEn+' '+x.titleDe+' '+x.panelEn+' '+x.panelDe).toLowerCase().includes(q)).slice(0,12);results.innerHTML=items.map((x,i)=>`<button class="doc-command-item ${i===0?'selected':''}" data-target="${x.id}"><span class="doc-command-icon">A</span><span><strong>${l==='de'?x.titleDe:x.titleEn}</strong><small>${l==='de'?x.panelDe:x.panelEn}</small></span><span class="doc-command-arrow">↵</span></button>`).join('')||`<div class="doc-command-empty">${l==='de'?'Kein Werkzeug gefunden.':'No tool found.'}</div>`;}
 function open(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('command-open');input.value='';render();setTimeout(()=>input.focus(),30)}
 function shut(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('command-open');trigger.focus()}
 function go(id){shut();const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});el.classList.add('tool-flash');setTimeout(()=>el.classList.remove('tool-flash'),1500);history.replaceState(null,'',location.pathname+location.search+'#'+id)}}
 trigger.addEventListener('click',open);close?.addEventListener('click',shut);overlay.addEventListener('click',e=>{if(e.target===overlay)shut();const b=e.target.closest('[data-target]');if(b)go(b.dataset.target)});input.addEventListener('input',render);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();overlay.classList.contains('open')?shut():open()}else if(e.key==='Escape'&&overlay.classList.contains('open'))shut();else if(e.key==='Enter'&&overlay.classList.contains('open')){const b=results.querySelector('[data-target]');if(b)go(b.dataset.target)}});document.addEventListener('anibim-language-changed',render);
})();
