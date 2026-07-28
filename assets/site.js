
function normalizeLanguage(v){return v==='de'?'de':'en'}
function setLanguage(v){const l=normalizeLanguage(v);document.body.classList.remove('lang-en','lang-de');document.body.classList.add('lang-'+l);document.documentElement.lang=l;document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('active',b.dataset.lang===l));document.querySelectorAll('a[data-keep-lang="true"]').forEach(a=>{const base=a.dataset.baseHref||a.getAttribute('href').split('?')[0];a.dataset.baseHref=base;a.href=base+'?lang='+l});try{localStorage.setItem('anibim-lang',l)}catch(e){}}
(function(){const p=new URLSearchParams(location.search);let l=p.get('lang');if(!l){try{l=localStorage.getItem('anibim-lang')}catch(e){}}setLanguage(l||'en')})();
