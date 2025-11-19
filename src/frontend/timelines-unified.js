// Unified Timeline Table Implementation
(function(){
  const state = {
    zoom: new Set(['year']), // Multiple zoom levels can be active
    viewStart: null,
    projectStart: null,
    projectEnd: null,
    columnWidths: {}, // Store column widths by date key
    defaultColumnWidth: 60, // Default width for timeline columns
    rows: [],
    timelineDates: {
      years: [],
      quarters: [],
      months: [],
      weeks: [],
      days: []
    }
  };

  function todayLocal(){ const t=new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  function fmt(d){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const dd=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${dd}`; }
  function parseLocal(s){ 
    if(s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate()); 
    const [y,m,d]=String(s||'').split('-').map(n=>parseInt(n,10)); 
    return new Date(y||1970,(m?m-1:0), d||1); 
  }

  // Ensure baseline project dates
  function ensureBaseline(){
    const hasDates = !!(window.projectState && window.projectState.start && window.projectState.end);
    if(hasDates){ 
      state.projectStart = parseLocal(window.projectState.start); 
      state.projectEnd = parseLocal(window.projectState.end); 
    } else { 
      const startDate=todayLocal(); 
      const endDate=new Date(startDate); 
      endDate.setFullYear(endDate.getFullYear()+10); 
      state.projectStart=startDate; 
      state.projectEnd=endDate; 
    }
    if(!state.viewStart){ state.viewStart = new Date(state.projectStart); }
  }

  // Build project hierarchy rows
  function buildRows(){
    const ps = fmt(state.projectStart), pe = fmt(state.projectEnd);
    
    // Read filter checkboxes
    const fShowProj = document.querySelector('[data-testid="TID-TLT-FSHOW-PROJ"]')?.checked !== false;
    const fShowMs = document.querySelector('[data-testid="TID-TLT-FSHOW-MS"]')?.checked !== false;
    const fShowDl = document.querySelector('[data-testid="TID-TLT-FSHOW-DL"]')?.checked !== false;
    const fShowTask = document.querySelector('[data-testid="TID-TLT-FSHOW-TASK"]')?.checked !== false;
    
    state.rows = [];
    
    // If we have actual project data, use it
    if(window.projectState && window.projectState.milestones && window.projectState.milestones.length > 0){
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
      if(fShowProj) state.rows.push({ kind:'proj', title: (window.projectState?.name || 'Project'), level:0, start: ps, end: pe, progress: 35 });
      if(fShowMs) state.rows.push({ kind:'ms', title: 'M1', level:1, start: ps, end: pe, progress: 50 });
      if(fShowDl) state.rows.push({ kind:'dl', title: 'D1.1', level:2, start: ps, end: pe, progress: 20 });
      if(fShowTask) state.rows.push({ kind:'task', title: 'T1.1.1', level:3, start: ps, end: pe, progress: 10 });
    }
  }

  // Generate timeline date columns based on project span and active zoom levels
  function generateTimelineDates(){
    ensureBaseline();
    
    const monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    // Reset all date arrays
    state.timelineDates = {
      years: [],
      quarters: [],
      months: [],
      weeks: [],
      days: []
    };
    
    // Generate years
    let year = state.projectStart.getFullYear();
    const endYear = state.projectEnd.getFullYear();
    while(year <= endYear){
      state.timelineDates.years.push({ 
        label: String(year), 
        date: new Date(year, 0, 1),
        key: `year-${year}`
      });
      year++;
    }
    
    // Generate quarters
    let qDate = new Date(state.projectStart.getFullYear(), Math.floor(state.projectStart.getMonth()/3)*3, 1);
    while(qDate <= state.projectEnd){
      const q = Math.floor(qDate.getMonth()/3)+1;
      state.timelineDates.quarters.push({
        label: `Q${q}`,
        date: new Date(qDate),
        key: `quarter-${qDate.getFullYear()}-${q}`
      });
      qDate.setMonth(qDate.getMonth()+3, 1);
    }
    
    // Generate months
    let mDate = new Date(state.projectStart.getFullYear(), state.projectStart.getMonth(), 1);
    while(mDate <= state.projectEnd){
      state.timelineDates.months.push({
        label: monthNames[mDate.getMonth()],
        date: new Date(mDate),
        key: `month-${mDate.getFullYear()}-${mDate.getMonth()}`
      });
      mDate.setMonth(mDate.getMonth()+1, 1);
    }
    
    // Generate weeks
    let wDate = new Date(state.projectStart);
    const dow = wDate.getDay();
    const delta = (dow+6)%7;
    wDate.setDate(wDate.getDate()-delta);
    let wIdx = 1;
    while(wDate <= state.projectEnd){
      state.timelineDates.weeks.push({
        label: `W${wIdx}`,
        date: new Date(wDate),
        key: `week-${fmt(wDate)}`
      });
      wDate.setDate(wDate.getDate()+7);
      wIdx++;
    }
    
    // Generate days
    let dDate = new Date(state.projectStart.getFullYear(), state.projectStart.getMonth(), state.projectStart.getDate());
    while(dDate <= state.projectEnd){
      state.timelineDates.days.push({
        label: String(dDate.getDate()).padStart(2,'0'),
        date: new Date(dDate),
        key: `day-${fmt(dDate)}`
      });
      dDate.setDate(dDate.getDate()+1);
    }
  }

  // Calculate which column a date falls into
  function getColumnForDate(date, timelineType){
    const d = parseLocal(date);
    const items = state.timelineDates[timelineType];
    
    for(let i = 0; i < items.length; i++){
      const current = items[i].date;
      const next = items[i + 1] ? items[i + 1].date : new Date(state.projectEnd.getFullYear() + 1, 0, 1);
      
      if(d >= current && d < next){
        return i;
      }
    }
    
    return -1;
  }

  // Helper function to calculate colspan for a time period
  function calculateColspan(startDate, endDate, dayColumns){
    let count = 0;
    for(let i = 0; i < dayColumns.length; i++){
      const dayDate = dayColumns[i].date;
      const nextDayDate = i < dayColumns.length - 1 ? dayColumns[i + 1].date : new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() + 1);
      
      if(dayDate >= startDate && dayDate < endDate){
        count++;
      }
    }
    return Math.max(1, count);
  }

  // Render the unified table
  function renderTable(){
    const table = document.querySelector('[data-testid="TID-TLT-TABLE"]');
    if(!table) return;
    
    table.innerHTML = '';
    
    // The base unit is DAYS - all other time periods merge day columns
    // Store in state so resize handlers can access it
    state.dayColumns = state.timelineDates.days;
    const dayColumns = state.dayColumns;
    const totalDayCols = dayColumns.length;
    
    if(totalDayCols === 0){
      console.warn('[Timeline] No day columns to render');
      return;
    }
    
    // Create header rows (5 rows for date headers)
    const thead = document.createElement('thead');
    
    // Row 1: Year (merge day columns per year)
    const row1 = document.createElement('tr');
    // First row: create merged cell spanning all 5 header rows for fixed columns
    const th = document.createElement('th');
    th.className = 'merged-header';
    th.rowSpan = 5;
    th.colSpan = 2;
    th.innerHTML = '<div>Project Descriptors</div><div style="margin-top:8px;">Project Progress</div>';
    row1.appendChild(th);
    
    // Add year cells with proper colspan
    state.timelineDates.years.forEach((yearInfo, yearIdx) => {
      const yearStart = yearInfo.date;
      const yearEnd = new Date(yearStart.getFullYear() + 1, 0, 1);
      
      // Find which day columns this year spans
      const dayColIndices = [];
      dayColumns.forEach((dayInfo, dIdx) => {
        if(dayInfo.date >= yearStart && dayInfo.date < yearEnd){
          dayColIndices.push(dIdx);
        }
      });
      const colspan = dayColIndices.length;
      
      if(colspan > 0){
        const thYear = document.createElement('th');
        thYear.className = 'timeline-date-cell timeline-year';
        thYear.textContent = yearInfo.label;
        thYear.colSpan = colspan;
        thYear.dataset.key = yearInfo.key;
        thYear.dataset.zoomType = 'years';
        thYear.dataset.dayColumns = JSON.stringify(dayColIndices);
        row1.appendChild(thYear);
      }
    });
    thead.appendChild(row1);
    
    // Row 2: Quarter (merge day columns per quarter)
    const row2 = document.createElement('tr');
    state.timelineDates.quarters.forEach((quarterInfo, qIdx) => {
      const qStart = quarterInfo.date;
      const qEnd = new Date(qStart);
      qEnd.setMonth(qStart.getMonth() + 3);
      
      // Find which day columns this quarter spans
      const dayColIndices = [];
      dayColumns.forEach((dayInfo, dIdx) => {
        if(dayInfo.date >= qStart && dayInfo.date < qEnd){
          dayColIndices.push(dIdx);
        }
      });
      const colspan = dayColIndices.length;
      
      if(colspan > 0){
        const thQuarter = document.createElement('th');
        thQuarter.className = 'timeline-date-cell timeline-quarter';
        thQuarter.textContent = quarterInfo.label;
        thQuarter.colSpan = colspan;
        thQuarter.dataset.key = quarterInfo.key;
        thQuarter.dataset.zoomType = 'quarters';
        thQuarter.dataset.dayColumns = JSON.stringify(dayColIndices);
        row2.appendChild(thQuarter);
      }
    });
    thead.appendChild(row2);
    
    // Row 3: Month (merge day columns per month)
    const row3 = document.createElement('tr');
    state.timelineDates.months.forEach((monthInfo, mIdx) => {
      const mStart = monthInfo.date;
      const mEnd = new Date(mStart);
      mEnd.setMonth(mStart.getMonth() + 1);
      
      // Find which day columns this month spans
      const dayColIndices = [];
      dayColumns.forEach((dayInfo, dIdx) => {
        if(dayInfo.date >= mStart && dayInfo.date < mEnd){
          dayColIndices.push(dIdx);
        }
      });
      const colspan = dayColIndices.length;
      
      if(colspan > 0){
        const thMonth = document.createElement('th');
        thMonth.className = 'timeline-date-cell timeline-month';
        thMonth.textContent = monthInfo.label;
        thMonth.colSpan = colspan;
        thMonth.dataset.key = monthInfo.key;
        thMonth.dataset.zoomType = 'months';
        thMonth.dataset.dayColumns = JSON.stringify(dayColIndices);
        row3.appendChild(thMonth);
      }
    });
    thead.appendChild(row3);
    
    // Row 4: Week (merge 7 day columns per week)
    const row4 = document.createElement('tr');
    state.timelineDates.weeks.forEach((weekInfo, wIdx) => {
      const wStart = weekInfo.date;
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 7);
      
      // Find which day columns this week spans
      const dayColIndices = [];
      dayColumns.forEach((dayInfo, dIdx) => {
        if(dayInfo.date >= wStart && dayInfo.date < wEnd){
          dayColIndices.push(dIdx);
        }
      });
      const colspan = dayColIndices.length;
      
      if(colspan > 0){
        const thWeek = document.createElement('th');
        thWeek.className = 'timeline-date-cell timeline-week';
        thWeek.textContent = weekInfo.label;
        thWeek.colSpan = colspan;
        thWeek.dataset.key = weekInfo.key;
        thWeek.dataset.zoomType = 'weeks';
        thWeek.dataset.dayColumns = JSON.stringify(dayColIndices);
        row4.appendChild(thWeek);
      }
    });
    thead.appendChild(row4);
    
    // Row 5: Day (individual columns - NOT merged)
    const row5 = document.createElement('tr');
    dayColumns.forEach((dayInfo, dIdx) => {
      const thDay = document.createElement('th');
      thDay.className = 'timeline-date-cell timeline-day';
      thDay.textContent = dayInfo.label;
      thDay.dataset.key = dayInfo.key;
      thDay.dataset.zoomType = 'days';
      thDay.dataset.colIdx = dIdx;
      
      // Apply stored width if exists
      const width = state.columnWidths[dayInfo.key] || state.defaultColumnWidth;
      thDay.style.width = width + 'px';
      thDay.style.minWidth = width + 'px';
      
      row5.appendChild(thDay);
    });
    thead.appendChild(row5);
    
    table.appendChild(thead);
    
    // Create body rows (project items)
    const tbody = document.createElement('tbody');
    
    state.rows.forEach((row, rowIdx) => {
      const tr = document.createElement('tr');
      tr.dataset.rowIdx = rowIdx;
      tr.dataset.kind = row.kind;
      
      // Column 1: Project Descriptor
      const tdDesc = document.createElement('td');
      tdDesc.className = `col-descriptor lvl-${row.level}`;
      tdDesc.textContent = row.title;
      tr.appendChild(tdDesc);
      
      // Column 2: Progress
      const tdProg = document.createElement('td');
      tdProg.className = 'col-progress';
      tdProg.textContent = (row.progress || 0) + '%';
      tr.appendChild(tdProg);
      
      // Timeline cells: use day columns as the base (finest granularity)
      const timelineCells = dayColumns;
      
      // Calculate bar position using days
      const startCol = getColumnForDate(row.start, 'days');
      const endCol = getColumnForDate(row.end, 'days');
      
      timelineCells.forEach((dateInfo, colIdx) => {
        const td = document.createElement('td');
        td.className = 'timeline-bar-cell';
        td.dataset.key = dateInfo.key;
        td.dataset.colIdx = colIdx;
        
        // Apply stored width if exists
        const width = state.columnWidths[dateInfo.key] || state.defaultColumnWidth;
        td.style.width = width + 'px';
        td.style.minWidth = width + 'px';
        
        // If this cell is within the bar range, add the slider bar
        if(colIdx >= startCol && colIdx <= endCol){
          const bar = document.createElement('div');
          bar.className = `timeline-slider-bar ${row.kind}`;
          bar.dataset.rowIdx = rowIdx;
          
          // Calculate bar width and position within cell
          if(colIdx === startCol && colIdx === endCol){
            // Bar fits in one cell
            bar.style.left = '2px';
            bar.style.right = '2px';
            bar.style.width = 'calc(100% - 4px)';
          } else if(colIdx === startCol){
            // First cell of bar
            bar.style.left = '2px';
            bar.style.right = '0';
            bar.style.width = 'calc(100% - 2px)';
          } else if(colIdx === endCol){
            // Last cell of bar
            bar.style.left = '0';
            bar.style.right = '2px';
            bar.style.width = 'calc(100% - 2px)';
          } else {
            // Middle cells
            bar.style.left = '0';
            bar.style.right = '0';
            bar.style.width = '100%';
          }
          
          // Add progress overlay
          const overlay = document.createElement('div');
          overlay.className = 'progress-overlay';
          overlay.style.width = Math.max(0, Math.min(100, row.progress || 0)) + '%';
          bar.appendChild(overlay);
          
          // Add resize handles (only on first and last cells)
          if(colIdx === startCol){
            const handleLeft = document.createElement('div');
            handleLeft.className = 'resize-handle left';
            handleLeft.title = 'Drag to change start date';
            bar.appendChild(handleLeft);
          }
          if(colIdx === endCol){
            const handleRight = document.createElement('div');
            handleRight.className = 'resize-handle right';
            handleRight.title = 'Drag to change end date';
            bar.appendChild(handleRight);
          }
          
          td.appendChild(bar);
        }
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    // Bind column resize functionality
    bindColumnResize();
    // Bind bar drag functionality
    bindBarDrag();
  }

  // Bind column resize functionality
  function bindColumnResize(){
    const table = document.querySelector('[data-testid="TID-TLT-TABLE"]');
    if(!table) return;
    
    let resizing = false;
    let startX = 0;
    let startWidths = {};
    let currentHeader = null;
    let affectedDayColumns = [];
    
    // Add resize handles to all timeline header cells
    table.querySelectorAll('th.timeline-date-cell').forEach(cell => {
      // Add a visual resize handle
      const handle = document.createElement('div');
      handle.className = 'column-resize-handle';
      handle.title = 'Drag to resize column';
      cell.appendChild(handle);
      
      handle.addEventListener('mousedown', (e) => {
        resizing = true;
        startX = e.clientX;
        currentHeader = cell;
        
        // Determine which day columns are affected
        if(cell.dataset.dayColumns){
          // This is a merged header (year/quarter/month/week)
          affectedDayColumns = JSON.parse(cell.dataset.dayColumns);
        } else if(cell.dataset.colIdx !== undefined){
          // This is a day header
          affectedDayColumns = [parseInt(cell.dataset.colIdx, 10)];
        }
        
        // Store starting widths for all affected day columns
        startWidths = {};
        affectedDayColumns.forEach(colIdx => {
          const dayKey = state.dayColumns[colIdx].key;
          const currentWidth = state.columnWidths[dayKey] || state.defaultColumnWidth;
          startWidths[colIdx] = currentWidth;
        });
        
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
        e.stopPropagation();
      });
    });
    
    document.addEventListener('mousemove', (e) => {
      if(!resizing || !currentHeader || affectedDayColumns.length === 0) return;
      
      const dx = e.clientX - startX;
      const numCols = affectedDayColumns.length;
      const dxPerCol = dx / numCols; // Distribute the resize across all affected columns
      
      // Update each affected day column
      affectedDayColumns.forEach(colIdx => {
        const dayKey = state.dayColumns[colIdx].key;
        const oldWidth = startWidths[colIdx] || state.defaultColumnWidth;
        const newWidth = Math.max(20, oldWidth + dxPerCol);
        
        state.columnWidths[dayKey] = newWidth;
        
        // Update all cells with this day key (header and body cells)
        table.querySelectorAll(`[data-key="${dayKey}"]`).forEach(cell => {
          cell.style.width = newWidth + 'px';
          cell.style.minWidth = newWidth + 'px';
        });
      });
    });
    
    document.addEventListener('mouseup', () => {
      if(resizing){
        resizing = false;
        currentHeader = null;
        affectedDayColumns = [];
        startWidths = {};
        document.body.style.cursor = '';
      }
    });
  }

  // Bind bar drag functionality
  function bindBarDrag(){
    // TODO: Implement bar dragging for moving start/end dates
    // This would involve detecting drag on .timeline-slider-bar and .resize-handle elements
    console.log('[Timeline] Bar drag functionality to be implemented');
  }

  // Render function
  function render(){
    ensureBaseline();
    buildRows();
    generateTimelineDates();
    renderTable();
    updateViewport();
    miniQA();
  }

  // Update viewport display
  function updateViewport(){
    const vp = document.querySelector('[data-testid="TID-TLT-VIEWPORT"]');
    if(vp){ 
      vp.textContent = 'Viewport: ' + (window.innerWidth || document.documentElement.clientWidth) + 'px'; 
    }
  }

  // Mini QA checks
  function miniQA(){
    const out = [];
    
    // Check if table exists
    const table = document.querySelector('[data-testid="TID-TLT-TABLE"]');
    if(!table) out.push('CRITICAL: Timeline table not rendered');
    
    // Check if merged header exists
    const mergedHeader = table?.querySelector('th.merged-header');
    if(!mergedHeader) out.push('CRITICAL: Merged header cell missing');
    
    // Check if merged header has correct rowspan/colspan
    if(mergedHeader && (mergedHeader.rowSpan !== 5 || mergedHeader.colSpan !== 2)){
      out.push('CRITICAL: Merged header cell has incorrect span (should be 5 rows x 2 cols)');
    }
    
    // Check that we have 5 header rows
    const headerRows = table?.querySelectorAll('thead tr');
    if(headerRows && headerRows.length !== 5){
      out.push('WARNING: Expected 5 header rows, found ' + headerRows.length);
    }
    
    // Check that day columns are not merged (no colspan on day cells)
    const dayCells = table?.querySelectorAll('th.timeline-day');
    if(dayCells){
      dayCells.forEach((cell, idx) => {
        if(cell.colSpan && cell.colSpan > 1){
          out.push('ERROR: Day column ' + idx + ' should not be merged (has colspan=' + cell.colSpan + ')');
        }
      });
    }
    
    // Display problems
    const p = document.querySelector('[data-testid="TID-TLT-PROBLEMS"]');
    if(p){
      if(out.length){
        p.innerHTML = '<ul>' + out.map(s => '<li>' + s + '</li>').join('') + '</ul>';
        p.removeAttribute('hidden');
      } else {
        p.setAttribute('hidden', '');
        p.innerHTML = '';
      }
    }
  }

  // Bind toolbar controls
  function bindToolbar(){
    // Zoom buttons are now informational only - all levels always displayed
    // But we can still highlight the selected zoom level for reference
    const map = [
      ['TID-TLT-Z-YEAR', 'year'],
      ['TID-TLT-Z-QUARTER', 'quarter'],
      ['TID-TLT-Z-MONTH', 'month'],
      ['TID-TLT-Z-WEEK', 'week'],
      ['TID-TLT-Z-DAY', 'day']
    ];
    
    map.forEach(([tid, mode]) => {
      const el = document.querySelector(`[data-testid="${tid}"]`);
      if(el && !el._bound){
        el.addEventListener('click', () => {
          // Remove selected from all
          map.forEach(([t, m]) => {
            const e = document.querySelector(`[data-testid="${t}"]`);
            if(e) e.classList.remove('selected');
          });
          // Add selected to clicked
          el.classList.add('selected');
        });
        el._bound = true;
      }
    });
    
    // Initialize with year selected by default
    const yearBtn = document.querySelector('[data-testid="TID-TLT-Z-YEAR"]');
    if(yearBtn) yearBtn.classList.add('selected');
    
    // View start date
    const vs = document.querySelector('[data-testid="TID-TLT-VIEW-START"]');
    if(vs && !vs._bound){
      vs.value = fmt(state.viewStart || todayLocal());
      vs.addEventListener('change', () => {
        if(vs.value){
          state.viewStart = parseLocal(vs.value);
          render();
        }
      });
      vs._bound = true;
    }
    
    // Filter checkboxes
    const filterIds = ['TID-TLT-FSHOW-PROJ', 'TID-TLT-FSHOW-MS', 'TID-TLT-FSHOW-DL', 'TID-TLT-FSHOW-TASK'];
    filterIds.forEach(tid => {
      const el = document.querySelector(`[data-testid="${tid}"]`);
      if(el && !el._bound){
        el.addEventListener('change', () => render());
        el._bound = true;
      }
    });
    
    // Project selector
    const projSel = document.querySelector('[data-testid="TID-TLT-PROJECT-SELECT"]');
    if(projSel && !projSel._bound){
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

  // Initialize
  function init(){
    const page = document.querySelector('[data-testid="TID-TL-TEST-PAGE"]');
    if(!page) return;
    
    bindToolbar();
    window.addEventListener('resize', () => { updateViewport(); });
    
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
  
  // Expose to window
  window.tlRender = render;
  window.tlInitFromStore = function(){
    const page = document.querySelector('[data-testid="TID-TL-TEST-PAGE"]');
    if(!page) return;
    
    if(window.projectState){
      render();
    } else {
      if(window.projectsLoad){
        const projects = window.projectsLoad();
        if(projects && projects.length > 0){
          window.projectState = JSON.parse(JSON.stringify(projects[0]));
        }
      }
      render();
    }
  };
})();
