// Timelines Test Page - isolated feature build with mini QA
(function(){
  const state = {
    zoom: 'year',
    viewStart: null,
    projectStart: null,
    projectEnd: null,
    pxPerDay: 6,
    labelW: 220,
    progressW: 160,
    rows: [],
  };

  function todayLocal(){ const t=new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  function fmt(d){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const dd=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${dd}`; }
  function parseLocal(s){ if(s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate()); const [y,m,d]=String(s||'').split('-').map(n=>parseInt(n,10)); return new Date(y||1970,(m?m-1:0), d||1); }

  // Baseline when no project dates
  function ensureBaseline(){
    const hasDates = !!(window.projectState && window.projectState.start && window.projectState.end);
    if(hasDates){ state.projectStart = parseLocal(window.projectState.start); state.projectEnd = parseLocal(window.projectState.end); }
    else { const s=todayLocal(); const e=new Date(s); e.setFullYear(e.getFullYear()+5); state.projectStart=s; state.projectEnd=e; }
    if(!state.viewStart){ state.viewStart = new Date(state.projectStart); }
  }

  // Build rows from actual project data or fallback to example
  function buildRows(){
    const ps = fmt(state.projectStart), pe = fmt(state.projectEnd);
    
    // Read filter checkboxes
    const fShowProj = document.querySelector('[data-testid="TID-TLT-FSHOW-PROJ"]')?.checked !== false;
    const fShowMs = document.querySelector('[data-testid="TID-TLT-FSHOW-MS"]')?.checked !== false;
    const fShowDl = document.querySelector('[data-testid="TID-TLT-FSHOW-DL"]')?.checked !== false;
    const fShowTask = document.querySelector('[data-testid="TID-TLT-FSHOW-TASK"]')?.checked !== false;
    
    // If we have actual project data, use it
    if(window.projectState && window.projectState.milestones && window.projectState.milestones.length > 0){
      state.rows = [];
      // Project row
      if(fShowProj){
        state.rows.push({ 
          kind:'proj', 
          title: window.projectState.name || 'Project', 
          level:0, 
          start: window.projectState.start || ps, 
          end: window.projectState.end || pe, 
          progress: 0,
          dataRef: window.projectState
        });
      }
      
      // Milestone rows
      window.projectState.milestones.forEach((ms, msIdx) => {
        if(fShowMs){
          state.rows.push({ 
            kind:'ms', 
            title: ms.title || ms.name || 'Milestone ' + (msIdx+1), 
            level:1, 
            start: ms.start || ps, 
            end: ms.end || pe, 
            progress: 0,
            dataRef: ms,
            msIdx: msIdx
          });
        }
        
        // Deliverable rows
        if(ms.deliverables){
          ms.deliverables.forEach((dl, dlIdx) => {
            if(fShowDl){
              state.rows.push({ 
                kind:'dl', 
                title: dl.title || dl.name || 'Deliverable ' + (dlIdx+1), 
                level:2, 
                start: dl.start || ps, 
                end: dl.end || pe, 
                progress: 0,
                dataRef: dl,
                msIdx: msIdx,
                dlIdx: dlIdx
              });
            }
            
            // Task rows
            if(dl.tasks){
              dl.tasks.forEach((task, taskIdx) => {
                if(fShowTask){
                  state.rows.push({ 
                    kind:'task', 
                    title: task.title || task.name || 'Task ' + (taskIdx+1), 
                    level:3, 
                    start: task.start || ps, 
                    end: task.end || pe, 
                    progress: task.progress || 0,
                    dataRef: task,
                    msIdx: msIdx,
                    dlIdx: dlIdx,
                    taskIdx: taskIdx
                  });
                }
              });
            }
          });
        }
      });
    } else {
      // Fallback to example rows for testing
      state.rows = [];
      if(fShowProj) state.rows.push({ kind:'proj', title: (window.projectState?.name || 'Project'), level:0, start: ps, end: pe, progress: 35 });
      if(fShowMs) state.rows.push({ kind:'ms', title: 'M1', level:1, start: ps, end: pe, progress: 50 });
      if(fShowDl) state.rows.push({ kind:'dl', title: 'D1.1', level:2, start: ps, end: pe, progress: 20 });
      if(fShowTask) state.rows.push({ kind:'task', title: 'T1.1.1', level:3, start: ps, end: pe, progress: 10 });
    }
  }
  
  // Persist timeline changes back to project data
  function saveTimelineChanges(row){
    if(!row.dataRef) return;
    
    // Update the data reference
    row.dataRef.start = row.start;
    row.dataRef.end = row.end;
    
    // Update project start/end at top level
    if(row.kind === 'proj' && window.projectState){
      window.projectState.start = row.start;
      window.projectState.end = row.end;
    }
    
    // Persist to localStorage
    if(window.projectState && window.projectsUpsert){
      window.projectsUpsert(window.projectState);
    }
  }

  function xForDate(d){ const start = new Date(state.projectStart.getFullYear(), state.projectStart.getMonth(), 1); const dt=parseLocal(d); const days=(dt-start)/(1000*60*60*24); return Math.round((state.pxPerDay||6)*days); }

  function computeView(){
    const scroll = document.querySelector('[data-testid="TID-TLT-SCROLL"]');
    ensureBaseline();
    // counts
    const counts = { years:5, quarters:8, months:12, weeks:24, days:31 };
    const vs = state.viewStart || new Date(state.projectStart);
    let ve = null; const z = state.zoom;
    if(z==='year'){ ve = new Date(vs.getFullYear()+counts.years, 0, 1); }
    else if(z==='quarter'){ const qStartMonth = Math.floor(vs.getMonth()/3)*3; const qStart = new Date(vs.getFullYear(), qStartMonth, 1); ve = new Date(qStart); ve.setMonth(qStart.getMonth() + 3*counts.quarters); }
    else if(z==='month'){ ve = new Date(vs); ve.setMonth(vs.getMonth()+counts.months); }
    else if(z==='week'){ const s=new Date(vs); const dow=s.getDay(); const delta=(dow+6)%7; s.setDate(s.getDate()-delta); ve=new Date(s); ve.setDate(s.getDate()+7*counts.weeks); }
    else { const s=new Date(vs.getFullYear(), vs.getMonth(), vs.getDate()); ve=new Date(s); ve.setDate(s.getDate()+counts.days); }

    const visibleDays = Math.max(1, Math.round((ve - vs)/(1000*60*60*24)));
    const containerW = Math.max(480, scroll?.clientWidth || 1000);
    state.pxPerDay = Math.max(0.5, containerW / visibleDays);
  }

  function renderAxes(){
    const axes = {
      years: document.querySelector('[data-testid="TID-TLT-AXIS-YEARS"]'),
      quarters: document.querySelector('[data-testid="TID-TLT-AXIS-QUARTERS"]'),
      months: document.querySelector('[data-testid="TID-TLT-AXIS-MONTHS"]'),
      weeks: document.querySelector('[data-testid="TID-TLT-AXIS-WEEKS"]'),
      days: document.querySelector('[data-testid="TID-TLT-AXIS-DAYS"]'),
    };
    Object.values(axes).forEach(a=>{ if(a){ a.innerHTML=''; } });
    // Axis filter determines which rows are visible
    const f = state.axisFilter || new Set(['year']);
    function show(el,on){ if(!el) return; if(on) el.removeAttribute('hidden'); else el.setAttribute('hidden',''); }
    show(axes.years, f.has('year'));
    show(axes.quarters, f.has('quarter'));
    show(axes.months, f.has('month'));
    show(axes.weeks, f.has('week'));
    show(axes.days, f.has('day'));
    // Move axes to standalone container above grid and size width to match timeline canvas
    const axesScroll = document.querySelector('[data-testid="TID-TLT-AXES-SCROLL"]');
    const axesWrap = document.querySelector('[data-testid="TID-TLT-AXES-CONTENT"]');
    const grid = document.querySelector('[data-testid="TID-TLT-GRID"]');
    if(axesWrap && grid){
      // compute width of timeline area and align axes left to progress right
      const canvas = document.querySelector('[data-testid="TID-TLT-CANVAS"]');
      const maxX = xForDate(state.projectEnd);
      const gridW = grid.getBoundingClientRect().width;
      const timelineAreaW = Math.max((gridW - state.labelW - 6 - state.progressW - 6), maxX + 48);
      if(canvas){ canvas.style.width = timelineAreaW + 'px'; canvas.style.position='relative'; }
      axesWrap.style.width = timelineAreaW + 'px';
      if(axesScroll){
        const pr = document.querySelector('[data-testid="TID-TLT-PROGRESS"]').getBoundingClientRect();
        const sr = axesScroll.getBoundingClientRect();
        const delta = Math.max(0, Math.round(pr.right - sr.left));
        axesWrap.style.marginLeft = delta + 'px';
      }
      Object.values(axes).forEach(ax => { if(ax && ax.parentElement !== axesWrap){ axesWrap.appendChild(ax); } });
    }
    // full span ticks over projectStart..projectEnd
    const monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const canvas = document.querySelector('[data-testid="TID-TLT-CANVAS"]');
    const scroll = document.querySelector('[data-testid="TID-TLT-SCROLL"]');
    // offsets align labels vs canvas
    function offsetFor(axisEl){ if(!axisEl||!canvas) return 0; const a=axisEl.getBoundingClientRect(), c=canvas.getBoundingClientRect(); return c.left - a.left; }
    const yOff=offsetFor(axes.years), qOff=offsetFor(axes.quarters), mOff=offsetFor(axes.months), wOff=offsetFor(axes.weeks), dOff=offsetFor(axes.days);
    // Enable expand/collapse per-axis by clicking the row
    Object.entries(axes).forEach(([key, el])=>{
      if(!el) return; if(el._ec) return; el._ec=true; el.addEventListener('click', ()=>{ el.classList.toggle('collapsed'); });
    });
    // years
    if(axes.years && !axes.years.hasAttribute('hidden')){
      let d = new Date(state.projectStart.getFullYear(), 0, 1);
      while(d <= state.projectEnd){ const x=xForDate(d); const t=document.createElement('div'); t.className='tl-tick'; t.style.left=(yOff+x)+'px'; const l=document.createElement('div'); l.className='tl-tick-label'; l.style.left=(yOff+x)+'px'; l.textContent=String(d.getFullYear()); axes.years.appendChild(t); axes.years.appendChild(l); d.setFullYear(d.getFullYear()+1); }
    }
    if(axes.quarters && !axes.quarters.hasAttribute('hidden')){
      const qStartMonth = Math.floor(state.projectStart.getMonth()/3)*3; let d=new Date(state.projectStart.getFullYear(), qStartMonth, 1);
      while(d <= state.projectEnd){ const q=Math.floor(d.getMonth()/3)+1; const x=xForDate(d); const t=document.createElement('div'); t.className='tl-tick'; t.style.left=(qOff+x)+'px'; const l=document.createElement('div'); l.className='tl-tick-label'; l.style.left=(qOff+x)+'px'; l.textContent=`Q${q}`; axes.quarters.appendChild(t); axes.quarters.appendChild(l); d.setMonth(d.getMonth()+3,1); }
    }
    if(axes.months && !axes.months.hasAttribute('hidden')){
      let d=new Date(state.projectStart.getFullYear(), state.projectStart.getMonth(), 1);
      while(d <= state.projectEnd){ const x=xForDate(d); const t=document.createElement('div'); t.className='tl-tick'; t.style.left=(mOff+x)+'px'; const l=document.createElement('div'); l.className='tl-tick-label'; l.style.left=(mOff+x)+'px'; l.textContent=monthNames[d.getMonth()]; axes.months.appendChild(t); axes.months.appendChild(l); d.setMonth(d.getMonth()+1,1); }
    }
    if(axes.weeks && !axes.weeks.hasAttribute('hidden')){
      const s=new Date(state.projectStart); const dow=s.getDay(); const delta=(dow+6)%7; s.setDate(s.getDate()-delta); let d=new Date(s); let idx=1;
      while(d <= state.projectEnd){ const x=xForDate(d); const t=document.createElement('div'); t.className='tl-tick'; t.style.left=(wOff+x)+'px'; const l=document.createElement('div'); l.className='tl-tick-label'; l.style.left=(wOff+x)+'px'; l.textContent='W'+(idx++); axes.weeks.appendChild(t); axes.weeks.appendChild(l); d.setDate(d.getDate()+7); }
    }
    if(axes.days && !axes.days.hasAttribute('hidden')){
      let d=new Date(state.projectStart.getFullYear(), state.projectStart.getMonth(), state.projectStart.getDate());
      while(d <= state.projectEnd){ const x=xForDate(d); const t=document.createElement('div'); t.className='tl-tick'; t.style.left=(dOff+x)+'px'; const l=document.createElement('div'); l.className='tl-tick-label'; l.style.left=(dOff+x)+'px'; l.textContent=String(d.getDate()).padStart(2,'0'); axes.days.appendChild(t); axes.days.appendChild(l); d.setDate(d.getDate()+1); }
    }
  }

  function renderRows(){
    const labels = document.querySelector('[data-testid="TID-TLT-LABELS"]');
    const prog = document.querySelector('[data-testid="TID-TLT-PROGRESS"]');
    const canvas = document.querySelector('[data-testid="TID-TLT-CANVAS"]');
    labels.innerHTML = ''; prog.innerHTML = ''; canvas.innerHTML = '';
    let y=8; const rowH = state.rowH || 28;
    state.rows.forEach((r)=>{
      const lbl=document.createElement('div'); lbl.className=`tltest-label-row lvl-${r.level}`; lbl.textContent = r.title; lbl.style.minHeight = rowH+'px'; labels.appendChild(lbl);
      const pc=document.createElement('div'); pc.className='tltest-progress-row'; pc.textContent = (r.progress||0) + '%'; pc.style.minHeight = rowH+'px'; prog.appendChild(pc);
      // bar
      const x1 = xForDate(r.start); const x2 = xForDate(r.end); const w=Math.max(12, x2-x1);
      const bar=document.createElement('div'); bar.className='tltest-bar'; bar.style.left=x1+'px'; bar.style.width=w+'px'; bar.style.top=y+'px';
      if(r.kind==='proj'){ bar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--tl-proj').trim(); }
      else if(r.kind==='ms'){ bar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--tl-ms').trim(); }
      else if(r.kind==='dl'){ bar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--tl-dl').trim(); }
      else { bar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--tl-task').trim(); }
      const overlay=document.createElement('div'); overlay.className='overlay'; overlay.style.width = Math.max(0, Math.min(100, r.progress||0)) + '%'; bar.appendChild(overlay);
      
      // Real-time date tooltip during drag
      const tooltip=document.createElement('div'); 
      tooltip.style.position='absolute'; 
      tooltip.style.top='-24px'; 
      tooltip.style.left='50%'; 
      tooltip.style.transform='translateX(-50%)'; 
      tooltip.style.background='rgba(13,40,80,0.95)'; 
      tooltip.style.color='white'; 
      tooltip.style.padding='4px 8px'; 
      tooltip.style.borderRadius='4px'; 
      tooltip.style.fontSize='11px'; 
      tooltip.style.whiteSpace='nowrap'; 
      tooltip.style.display='none'; 
      tooltip.style.zIndex='1000';
      tooltip.style.pointerEvents='none';
      bar.appendChild(tooltip);
      
      // draggable & resizable bar with real-time date display
      let dragging=false, resizingLeft=false, resizingRight=false; let startX=0; let origStart=r.start; let origEnd=r.end;
      function showTooltip(start, end){ tooltip.textContent = start + ' → ' + end; tooltip.style.display='block'; }
      function hideTooltip(){ tooltip.style.display='none'; }
      function onDownBody(e){ dragging=true; startX=e.clientX; origStart=r.start; origEnd=r.end; document.body.style.cursor='ew-resize'; showTooltip(r.start, r.end); e.preventDefault(); }
      function onDownLeft(e){ resizingLeft=true; startX=e.clientX; origStart=r.start; document.body.style.cursor='col-resize'; showTooltip(r.start, r.end); e.stopPropagation(); e.preventDefault(); }
      function onDownRight(e){ resizingRight=true; startX=e.clientX; origEnd=r.end; document.body.style.cursor='col-resize'; showTooltip(r.start, r.end); e.stopPropagation(); e.preventDefault(); }
      const hL=document.createElement('div'); hL.style.position='absolute'; hL.style.left='-4px'; hL.style.top='0'; hL.style.bottom='0'; hL.style.width='8px'; hL.style.cursor='col-resize'; hL.title='Drag to change start date'; bar.appendChild(hL);
      const hR=document.createElement('div'); hR.style.position='absolute'; hR.style.right='-4px'; hR.style.top='0'; hR.style.bottom='0'; hR.style.width='8px'; hR.style.cursor='col-resize'; hR.title='Drag to change end date'; bar.appendChild(hR);
      bar.addEventListener('mousedown', onDownBody);
      bar.title='Drag to move entire timeline';
      hL.addEventListener('mousedown', onDownLeft); hR.addEventListener('mousedown', onDownRight);
      document.addEventListener('mouseup', ()=>{ 
        if(dragging||resizingLeft||resizingRight){ 
          // Save changes when drag ends
          saveTimelineChanges(r);
          dragging=false; resizingLeft=false; resizingRight=false; document.body.style.cursor=''; hideTooltip(); 
        } 
      });
      document.addEventListener('mousemove', (e)=>{
        if(!(dragging||resizingLeft||resizingRight)) return; const dx=e.clientX-startX; const days=Math.round(dx/(state.pxPerDay||6));
        let s=parseLocal(origStart); let eD=parseLocal(origEnd);
        if(dragging){ s.setDate(s.getDate()+days); eD.setDate(eD.getDate()+days); }
        else if(resizingLeft){ s.setDate(s.getDate()+days); }
        else if(resizingRight){ eD.setDate(eD.getDate()+days); }
        // snapping
        s=snapByFilter(s); eD=snapByFilter(eD);
        r.start=fmt(s); r.end=fmt(eD);
        // Show real-time dates during drag
        showTooltip(r.start, r.end);
        const left=xForDate(r.start); const right=xForDate(r.end); bar.style.left=left+'px'; bar.style.width=Math.max(12, right-left)+'px';
      });
      canvas.appendChild(bar);
      y += rowH;
    });
  }

  // Column resizers
  function bindResizers(){
    function bind(el, cb){ if(!el||el._bound) return; let dragging=false; el.addEventListener('mousedown', e=>{ dragging=true; document.body.style.cursor='col-resize'; e.preventDefault(); }); document.addEventListener('mouseup', ()=>{ if(dragging){ dragging=false; document.body.style.cursor=''; }}); document.addEventListener('mousemove', e=>{ if(!dragging) return; cb(e); }); el._bound=true; }
    const r1=document.querySelector('[data-testid="TID-TLT-RESIZER"]');
    const r2=document.querySelector('[data-testid="TID-TLT-RESIZER-2"]');
    bind(r1, (e)=>{ state.labelW = Math.max(140, Math.min(560, state.labelW + e.movementX)); document.documentElement.style.setProperty('--tl-label-w', state.labelW+'px'); });
    bind(r2, (e)=>{ state.progressW = Math.max(80, Math.min(360, state.progressW + e.movementX)); const grid=document.querySelector('[data-testid="TID-TLT-GRID"]'); if(grid){ grid.style.gridTemplateColumns = `var(--tl-label-w) 6px ${state.progressW}px 6px 1fr`; } });
  }

  // Mini QA — test page only
  function miniQA(){
    const out=[];
    // Alignment: axes left must align with progress right edge
    const prog=document.querySelector('[data-testid="TID-TLT-PROGRESS"]');
    const axesWrap=document.querySelector('[data-testid="TID-TLT-AXES-CONTENT"]');
    if(prog && axesWrap){
      const pr=prog.getBoundingClientRect(); const ar=axesWrap.getBoundingClientRect();
      if(Math.abs(pr.right - ar.left) > 2){ out.push('Left border of date rows not aligned with right border of progress table'); }
    }
    // Required: axis filter applies and shows only selected axes
    const f = state.axisFilter || new Set(['year']);
    const axes={ y:document.querySelector('[data-testid="TID-TLT-AXIS-YEARS"]'), q:document.querySelector('[data-testid="TID-TLT-AXIS-QUARTERS"]'), m:document.querySelector('[data-testid="TID-TLT-AXIS-MONTHS"]'), w:document.querySelector('[data-testid="TID-TLT-AXIS-WEEKS"]'), d:document.querySelector('[data-testid="TID-TLT-AXIS-DAYS"]') };
    if(f.has('year') && axes.y && axes.y.hasAttribute('hidden')) out.push('Year axis hidden although filtered on');
    if(!f.has('year') && axes.y && !axes.y.hasAttribute('hidden')) out.push('Year axis visible although filtered off');
    if(f.has('quarter') && axes.q && axes.q.hasAttribute('hidden')) out.push('Quarters axis should be visible after toggle');
    // Min width check for progress column
    const progWidthEl = document.querySelector('[data-testid="TID-TLT-PROGRESS"]'); if(progWidthEl){ if(progWidthEl.getBoundingClientRect().width < 80) out.push('Progress column too small (<80px)'); }
    // Baseline
    const t=todayLocal(); const ps=state.projectStart, pe=state.projectEnd;
    if(!ps||!pe){ out.push('QA-TLT: Missing baseline projectStart/projectEnd'); }
    else{
      const ds=Math.abs((new Date(ps.getFullYear(),ps.getMonth(),ps.getDate())-t)/(1000*60*60*24)); if(ds>2) out.push('QA-TLT: Baseline start not today');
      const years=(pe-ps)/(1000*60*60*24*365); if(years<4.9) out.push('QA-TLT: Baseline span < 5 years');
    }
    // Axes visible at zoom
    const z=state.zoom; const ax={ y:document.querySelector('[data-testid="TID-TLT-AXIS-YEARS"]'), q:document.querySelector('[data-testid="TID-TLT-AXIS-QUARTERS"]'), m:document.querySelector('[data-testid="TID-TLT-AXIS-MONTHS"]') };
    if(z==='year' && ax.q && !ax.q.hasAttribute('hidden')) out.push('QA-TLT: Quarters axis visible at Year zoom');
    if(z==='quarter' && ax.m && ax.m.hasAttribute('hidden')) out.push('QA-TLT: Months axis hidden at Quarter zoom');
    // Anchoring check
    const scroll=document.querySelector('[data-testid="TID-TLT-SCROLL"]'); const canvas=document.querySelector('[data-testid="TID-TLT-CANVAS"]');
    if(scroll&&canvas){ const gutter = parseFloat(getComputedStyle(canvas).marginLeft)||0; const expectedLeft = Math.max(0, xForDate(state.viewStart)-gutter); const delta=Math.abs(scroll.scrollLeft-expectedLeft); if(delta>2) out.push('QA-TLT: View not anchored to View start'); }
    // Overlap check — not applicable in test since labels are separate grid; still check empties
    if(!document.querySelector('[data-testid="TID-TLT-LABELS"]')) out.push('QA-TLT: Labels not rendered');
    if(!document.querySelector('[data-testid="TID-TLT-PROGRESS"]')) out.push('QA-TLT: Progress column missing');
    if(!document.querySelector('[data-testid="TID-TLT-CANVAS"]')) out.push('QA-TLT: Timeline canvas missing');

    const p=document.querySelector('[data-testid="TID-TLT-PROBLEMS"]'); if(p){ if(out.length){ p.innerHTML='<ul>'+out.map(s=>'<li>'+s+'</li>').join('')+'</ul>'; p.removeAttribute('hidden'); } else { p.setAttribute('hidden',''); p.innerHTML=''; } }
  }

  function snapByFilter(date){
    // Snap to the finest selected unit for demo; can improve to multi-snap grid
    const f = state.axisFilter || new Set(['year']);
    const d = new Date(date);
    if(f.has('day')){ /* exact day */ }
    else if(f.has('week')){ const dow=d.getDay(); const delta=(dow+6)%7; d.setDate(d.getDate()-delta); }
    else if(f.has('month')){ d.setDate(1); }
    else if(f.has('quarter')){ const m=d.getMonth(); d.setMonth(Math.floor(m/3)*3, 1); }
    else { d.setMonth(0,1); }
    return d;
  }
  function render(){
    ensureBaseline();
    buildRows();
    computeView();
    renderAxes();
    renderRows();
    // anchor
    const scroll=document.querySelector('[data-testid="TID-TLT-SCROLL"]'); const canvas=document.querySelector('[data-testid="TID-TLT-CANVAS"]');
    const axesScroll=document.querySelector('[data-testid="TID-TLT-AXES-SCROLL"]');
    if(scroll&&canvas){ const gutter = parseFloat(getComputedStyle(canvas).marginLeft)||0; const left = Math.max(0, xForDate(state.viewStart)-gutter); scroll.scrollLeft = left; if(axesScroll){ axesScroll.scrollLeft = left; }
      if(axesScroll && !scroll._syncBound){ scroll.addEventListener('scroll', ()=>{ axesScroll.scrollLeft = scroll.scrollLeft; }); scroll._syncBound=true; }
      if(axesScroll && !axesScroll._syncBound){ axesScroll.addEventListener('scroll', ()=>{ scroll.scrollLeft = axesScroll.scrollLeft; }); axesScroll._syncBound=true; }
    }
    // viewport
    const vp=document.querySelector('[data-testid="TID-TLT-VIEWPORT"]'); if(vp){ vp.textContent = 'Viewport: '+ (window.innerWidth||document.documentElement.clientWidth)+'px'; }
    miniQA();
  }

  function bindToolbar(){
    // Zoom buttons act as filters: toggle visibility per axis row
    const map=[['TID-TLT-Z-YEAR','year'],['TID-TLT-Z-QUARTER','quarter'],['TID-TLT-Z-MONTH','month'],['TID-TLT-Z-WEEK','week'],['TID-TLT-Z-DAY','day']];
    if(!state.axisFilter){ state.axisFilter = new Set(['year']); }
    map.forEach(([tid,mode])=>{ const el=document.querySelector(`[data-testid="${tid}"]`); if(el && !el._bound){ el.addEventListener('click', ()=>{
      if(state.axisFilter.has(mode)) state.axisFilter.delete(mode); else state.axisFilter.add(mode);
      if(state.axisFilter.size===0) state.axisFilter.add('year');
      // Visual selection state
      el.classList.toggle('selected', state.axisFilter.has(mode));
      render();
    }); el._bound=true; }});
    // Initialize selected states
    map.forEach(([tid,mode])=>{ const el=document.querySelector(`[data-testid="${tid}"]`); if(el){ el.classList.toggle('selected', (state.axisFilter||new Set(['year'])).has(mode)); }});
    const vs=document.querySelector('[data-testid="TID-TLT-VIEW-START"]'); if(vs && !vs._bound){ vs.value = fmt(state.viewStart||todayLocal()); vs.addEventListener('change', ()=>{ if(vs.value){ state.viewStart = parseLocal(vs.value); render(); } }); vs._bound=true; }
    // Row height control via wheel on label area (optional)
    const labels=document.querySelector('[data-testid="TID-TLT-LABELS"]'); if(labels && !labels._wheel){ labels.addEventListener('wheel', (e)=>{ if(e.ctrlKey){ e.preventDefault(); state.rowH = Math.max(20, Math.min(56, (state.rowH||28) + (e.deltaY>0? -2: 2))); render(); } }); labels._wheel=true; }
    
    // Bind filter checkboxes to re-render on change
    const filterIds = ['TID-TLT-FSHOW-PROJ', 'TID-TLT-FSHOW-MS', 'TID-TLT-FSHOW-DL', 'TID-TLT-FSHOW-TASK'];
    filterIds.forEach(tid => {
      const el = document.querySelector(`[data-testid="${tid}"]`);
      if(el && !el._bound){ 
        el.addEventListener('change', () => render()); 
        el._bound = true; 
      }
    });
    
    // Bind project selector
    const projSel = document.querySelector('[data-testid="TID-TLT-PROJECT-SELECT"]');
    if(projSel && !projSel._bound){
      // Populate from stored projects
      if(window.projectsLoad){
        const projects = window.projectsLoad();
        projSel.innerHTML = '<option>All Projects</option>' + 
          projects.map((p, i) => `<option value="${i}">${p.name || 'Untitled'}</option>`).join('');
      }
      projSel.addEventListener('change', () => {
        if(projSel.value && projSel.value !== 'All Projects' && window.projectsLoad){
          const projects = window.projectsLoad();
          const idx = parseInt(projSel.value, 10);
          if(!isNaN(idx) && projects[idx]){
            window.projectState = JSON.parse(JSON.stringify(projects[idx]));
            render();
          }
        }
      });
      projSel._bound = true;
    }
  }

  function init(){
    const page = document.querySelector('[data-testid="TID-TL-TEST-PAGE"]'); if(!page) return;
    // ensure CSS custom prop for label width
    document.documentElement.style.setProperty('--tl-label-w', state.labelW+'px');
    bindToolbar();
    bindResizers();
    window.addEventListener('resize', ()=>{ render(); });
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
