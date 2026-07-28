function normalizeLanguage(value){return String(value||'').toLowerCase().startsWith('de')?'de':'en'}
function setLanguage(value){
  const language=normalizeLanguage(value);
  document.body.classList.remove('lang-en','lang-de');
  document.body.classList.add('lang-'+language);
  document.documentElement.lang=language;
  document.querySelectorAll('.lang button').forEach(button=>{
    const buttonLanguage=button.dataset.lang || (button.id==='btn-de'?'de':'en');
    button.classList.toggle('active',buttonLanguage===language);
    button.setAttribute('aria-pressed',buttonLanguage===language?'true':'false');
  });
  document.querySelectorAll('a[data-keep-lang="true"]').forEach(link=>{
    const href=link.dataset.baseHref || link.getAttribute('href').split('?')[0];
    link.dataset.baseHref=href;
    link.href=href+'?lang='+language;
  });
  try{localStorage.setItem('anibim-lang',language)}catch(error){}
}
(function(){
  const query=new URLSearchParams(location.search);
  let language=query.get('lang');
  if(!language){try{language=localStorage.getItem('anibim-lang')}catch(error){}}
  setLanguage(language||navigator.language||'en');
})();
