/* Ultra-early boot script. Purpose: avoid inline handlers and ensure globals exist even if extensions block inline scripts. */
(function(){
  // Minimal route logic so clicks work immediately
  function ensureTimelinesRendered(){
    try{
      if(location.hash === '#/timelines'){
        if(typeof window.tlInitFromStore === 'function'){ try{ window.tlInitFromStore(); }catch(_){} }
        if(typeof window.tlRender === 'function'){ try{ window.tlRender(); }catch(_){} }
      }
    }catch(_){}
  }
  function navigateTo(route){
    try{
      var map={'#/':'TID-DASHBOARD','#/projects':'TID-PAGE-PROJECTS','#/timelines':'TID-TL-PAGE','#/tl-test':'TID-TL-TEST-PAGE','#/reports':'TID-PAGE-REPORTS','#/permissions':'TID-ROLE-MATRIX','#/workitem':'TID-WORKITEM-DETAIL','#/evidence':'TID-EVIDENCE-UPLOAD','#/gantt':'TID-GANTT-VIEW','#/audit':'TID-AUDIT-LOG','#/notify':'TID-NOTIFY-PREFERENCES','#/import':'TID-IMPORT-WIZARD','#/exports':'TID-EXPORT-REPORTS','#/templates':'TID-TEMPLATES-LIBRARY','#/settings':'TID-SETTINGS-PAGE','#/search':'TID-SEARCH-RESULTS'};
      var show = map[route] || 'TID-DASHBOARD';
      var content = document.querySelector('[data-testid="TID-CONTENT-AREA"]');
      if(content){
        for(var i=0;i<content.children.length;i++){
          var e=content.children[i];
          var tid = e.getAttribute('data-testid');
          if(!tid || tid==='TID-BREADCRUMBS') continue;
          if(tid===show) e.removeAttribute('hidden'); else e.setAttribute('hidden','');
        }
      }
      // If navigating to timelines, try to render it immediately if functions exist
      if(show === 'TID-TL-PAGE'){ ensureTimelinesRendered(); }
    }catch(err){ /* swallow */ }
  }
  function hideModalByTid(tid){ try{ var m=document.querySelector('[data-testid="'+tid+'"]'); if(m) m.setAttribute('hidden',''); }catch(e){} }
  // Globals used by onclick in markup
  if(typeof window.appNavTo !== 'function'){
    window.appNavTo = function(el){ try{ var href=(el&&el.getAttribute? el.getAttribute('href') : (typeof el==='string'? el : '#/')) || '#/'; hideModalByTid('TID-PSETUP-MODAL'); location.hash = href; if(typeof window.navigateTo==='function'){ window.navigateTo(href); } else { navigateTo(href); } return false; }catch(e){ return false; } };
  }
  if(typeof window.openProjectSetup !== 'function'){
    window.openProjectSetup = function(){ try{ var m=document.querySelector('[data-testid="TID-PSETUP-MODAL"]'); if(m) m.removeAttribute('hidden'); }catch(e){} };
  }
  if(typeof window.closeProjectSetup !== 'function'){
    window.closeProjectSetup = function(){ hideModalByTid('TID-PSETUP-MODAL'); };
  }
  if(typeof window.openTimelines !== 'function'){
    window.openTimelines = function(){ try{ hideModalByTid('TID-PSETUP-MODAL'); location.hash = '#/timelines'; (window.navigateTo||navigateTo)('#/timelines'); }catch(e){} };
  }
  if(typeof window.navigateTo !== 'function'){
    window.navigateTo = navigateTo;
  }
  // Attach click handlers without relying on inline onclick
  function bindNav(){
    try{
      // Ensure a Timelines (Test) link exists regardless of toggle delivery path
      var nav = document.querySelector('.nav');
      if(nav && !document.querySelector('[data-testid="TID-NAV-TL-TEST"]')){
        var a=document.createElement('a'); a.href="#/tl-test"; a.setAttribute('data-testid','TID-NAV-TL-TEST'); a.textContent='Timelines (Test)'; a.addEventListener('click', function(e){ e.preventDefault(); var href=a.getAttribute('href')||'#/'; location.hash=href; (window.navigateTo||navigateTo)(href); }); nav.appendChild(a);
      }
    }catch(e){}

    try{
      document.querySelectorAll('.nav a[data-testid^="TID-NAV-"]').forEach(function(a){
        if(a._bootBound) return;
        a.addEventListener('click', function(e){ e.preventDefault(); var href=a.getAttribute('href')||'#/' ; hideModalByTid('TID-PSETUP-MODAL'); location.hash=href; (window.navigateTo||navigateTo)(href); });
        a._bootBound = true;
      });
      // Bind topbar and page "Start a new project" buttons
      var startBtns = [
        document.querySelector('[data-testid="TID-START-PROJECT-BTN"]'),
        document.querySelector('[data-testid="TID-PAGE-START-PROJECT-BTN"]')
      ].filter(Boolean);
      startBtns.forEach(function(btn){ if(!btn._bootBound){ btn.addEventListener('click', function(){ try{ var m=document.querySelector('[data-testid="TID-PSETUP-MODAL"]'); if(m) m.removeAttribute('hidden'); }catch(e){} }); btn._bootBound=true; }});
      // Click on modal overlay to close
      var pm = document.querySelector('[data-testid="TID-PSETUP-MODAL"]');
      if(pm && !pm._bootBound){ pm.addEventListener('click', function(e){ if(e.target===pm){ hideModalByTid('TID-PSETUP-MODAL'); } }); pm._bootBound = true; }
      // Bind modal close and cancel buttons
      var closeBtn = document.querySelector('[data-testid="TID-PSETUP-CLOSE"]');
      if(closeBtn && !closeBtn._bootBound){ closeBtn.addEventListener('click', function(){ hideModalByTid('TID-PSETUP-MODAL'); }); closeBtn._bootBound = true; }
      var cancelBtn = document.querySelector('[data-testid="TID-PSETUP-CANCEL"]');
      if(cancelBtn && !cancelBtn._bootBound){ cancelBtn.addEventListener('click', function(){ hideModalByTid('TID-PSETUP-MODAL'); }); cancelBtn._bootBound = true; }
      // Bind modal "Set timeline…" button
      var toTlBtn = document.querySelector('[data-testid="TID-PSETUP-OPEN-TIMELINE"]');
      if(toTlBtn && !toTlBtn._bootBound){ toTlBtn.addEventListener('click', function(){ try{ hideModalByTid('TID-PSETUP-MODAL'); location.hash = '#/timelines'; (window.navigateTo||navigateTo)('#/timelines'); }catch(e){} }); toTlBtn._bootBound = true; }
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', bindNav);
  if(document.readyState && document.readyState !== 'loading'){ try{ bindNav(); }catch(e){} }
  window.addEventListener('keydown', function(e){ if(e && e.key==='Escape'){ hideModalByTid('TID-PSETUP-MODAL'); } });
  window.addEventListener('hashchange', function(){ try{ hideModalByTid('TID-PSETUP-MODAL'); var r=location.hash||'#/' ; (window.navigateTo||navigateTo)(r); ensureTimelinesRendered(); }catch(e){} });
  // Initial route
  (window.navigateTo||navigateTo)(location.hash||'#/');
  // Retry timelines render shortly after load in case main script overrides navigateTo later
  setTimeout(ensureTimelinesRendered, 60);
  setTimeout(ensureTimelinesRendered, 250);
  setTimeout(ensureTimelinesRendered, 800);
})();
