// Timelines Page - Main implementation
(function() {
  'use strict';

  // Timeline state
  window.tlState = {
    zoom: 'quarter',
    origin: new Date(),
    viewStart: null,
    pxPerDay: 6,
    autoZoom: false
  };

  // Initialize timeline from stored project data
  window.tlInitFromStore = function() {
    console.log('[TL] tlInitFromStore');
    const projects = projectsLoad();
    const sel = document.querySelector('[data-testid="TID-TL-PROJECT-SELECT"]');
    
    if (projects.length > 0) {
      window.projectState = window.projectState || JSON.parse(JSON.stringify(projects[0]));
    } else {
      // Create a draft project
      tlEnsureDraftProject();
    }
    
    // Set view start
    if (window.projectState && window.projectState.start) {
      window.tlState.viewStart = tlParseDateLocal(window.projectState.start);
    } else {
      window.tlState.viewStart = new Date();
    }
    
    // Set origin
    const vs = window.tlState.viewStart;
    window.tlState.origin = new Date(vs.getFullYear(), vs.getMonth(), 1);
  };

  // Helper functions
  function tlParseDateLocal(s) {
    if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate());
    if (typeof s === 'string') {
      const [y, m, d] = s.split('-').map(n => parseInt(n, 10));
      return new Date(y, (m || 1) - 1, d || 1);
    }
    return new Date(s);
  }

  function tlFmtDateLocal(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function tlDateToX(d) {
    const origin = new Date(window.tlState.origin.getFullYear(), window.tlState.origin.getMonth(), 1);
    const pxPerDay = window.tlState.pxPerDay || 6;
    const dt = tlParseDateLocal(d);
    const dd = (dt - origin) / (1000 * 60 * 60 * 24);
    return Math.round(dd * pxPerDay);
  }

  function tlEnsureDraftProject() {
    const today = new Date();
    const next = new Date(today);
    next.setMonth(today.getMonth() + 1);
    window.projectState = {
      name: 'Untitled Project',
      start: tlFmtDateLocal(today),
      end: tlFmtDateLocal(next),
      milestones: [],
      isDraft: true
    };
  }

  // Main render function
  window.tlRender = function() {
    console.log('[TL] tlRender start');
    const lanes = document.getElementById('tl-lanes');
    if (!lanes) {
      console.warn('[TL] lanes element missing');
      return;
    }

    // Ensure we have a project
    if (!window.projectState) {
      tlEnsureDraftProject();
    }

    // Build rows for rendering
    const rows = [];
    const state = window.projectState;
    
    // Read filters
    const fShowProj = document.querySelector('[data-testid="TID-TL-FSHOW-PROJ"]')?.checked !== false;
    const fShowMs = document.querySelector('[data-testid="TID-TL-FSHOW-MS"]')?.checked !== false;
    const fShowDl = document.querySelector('[data-testid="TID-TL-FSHOW-DL"]')?.checked !== false;
    const fShowTask = document.querySelector('[data-testid="TID-TL-FSHOW-TASK"]')?.checked !== false;

    if (state) {
      if (fShowProj) {
        rows.push({
          kind: 'proj',
          title: state.name || 'Project',
          level: 0,
          start: state.start,
          end: state.end
        });
      }

      (state.milestones || []).forEach((ms, mi) => {
        if (fShowMs) {
          rows.push({
            kind: 'ms',
            title: ms.title || `M${mi + 1}`,
            level: 1,
            start: ms.start || state.start,
            end: ms.end || state.end,
            mi
          });
        }

        (ms.deliverables || []).forEach((dl, di) => {
          if (fShowDl) {
            rows.push({
              kind: 'dl',
              title: dl.title || `D${mi + 1}.${di + 1}`,
              level: 2,
              start: dl.start,
              end: dl.end,
              mi,
              di
            });
          }

          (dl.tasks || []).forEach((t, ti) => {
            if (fShowTask) {
              rows.push({
                kind: 'task',
                title: t.title || `T${mi + 1}.${di + 1}.${ti + 1}`,
                level: 3,
                start: t.start,
                end: t.end,
                mi,
                di,
                ti
              });
            }
          });
        });
      });
    }

    console.log('[TL] rows built', rows.length, rows);

    // Render labels
    const labels = document.querySelector('.tl-labels');
    if (labels) {
      labels.innerHTML = '';
      
      // Header
      const hdr = document.createElement('div');
      hdr.className = 'tl-label-header';
      hdr.textContent = 'Project descriptors';
      labels.appendChild(hdr);

      // Labels for each row
      rows.forEach((r, idx) => {
        const div = document.createElement('div');
        div.className = 'tl-label-row lvl-' + r.level;
        div.setAttribute('data-testid', `TID-TL-LABEL-${r.kind.toUpperCase()}-${idx}`);
        div.textContent = r.title;
        labels.appendChild(div);
      });
    }

    // Render lanes
    lanes.innerHTML = '';
    rows.forEach((r, idx) => {
      const lane = document.createElement('div');
      lane.className = 'tl-lane';
      lane.setAttribute('data-testid', `TID-TL-LANE-${r.kind.toUpperCase()}-${idx}`);
      lanes.appendChild(lane);

      // Add bar if dates present
      if (r.start && r.end) {
        const bar = document.createElement('div');
        bar.className = `tl-bar ${r.kind}`;
        bar.setAttribute('data-testid', `TID-TL-BAR-${r.kind.toUpperCase()}-${idx}`);
        
        const xStart = tlDateToX(r.start);
        const xEnd = tlDateToX(r.end);
        const x = xStart;
        const w = Math.max(12, xEnd - xStart);
        
        bar.style.left = x + 'px';
        bar.style.width = w + 'px';
        bar.style.top = (lane.offsetTop + 6) + 'px';
        
        // Add labels
        const lblStart = document.createElement('div');
        lblStart.className = 'tl-label';
        lblStart.textContent = r.start;
        bar.appendChild(lblStart);
        
        const lblEnd = document.createElement('div');
        lblEnd.className = 'tl-label';
        lblEnd.textContent = r.end;
        bar.appendChild(lblEnd);
        
        lanes.appendChild(bar);
      }
    });

    console.log('[TL] tlRender done');
  };

  // Set zoom level
  window.tlSetZoom = function(mode) {
    const valid = ['year', 'quarter', 'month', 'week', 'day'];
    if (!valid.includes(mode)) return;
    window.tlState.zoom = mode;
    tlRender();
  };

  // Apply and return to projects
  window.tlApplyAndBack = function() {
    if (window.projectState) {
      projectsUpsert(window.projectState);
    }
    projectsPopulateSelectors();
    if (typeof window.backToProjects === 'function') {
      window.backToProjects();
    } else {
      // Fallback: navigate to projects page
      if (typeof window.navigateTo === 'function') {
        window.navigateTo('#/projects');
      } else {
        location.hash = '#/projects';
      }
    }
  };

  // Project storage helpers
  function projectsLoad() {
    try {
      return JSON.parse(localStorage.getItem('pm_projects') || '[]');
    } catch (e) {
      return [];
    }
  }

  function projectsUpsert(p) {
    const list = projectsLoad();
    const i = list.findIndex(x => x.name && p.name && x.name.toLowerCase() === p.name.toLowerCase());
    if (i >= 0) {
      list[i] = p;
    } else {
      list.push(p);
    }
    localStorage.setItem('pm_projects', JSON.stringify(list));
    return list;
  }

  function projectsPopulateSelectors() {
    const list = projectsLoad();
    const sel = document.querySelector('[data-testid="TID-TL-PROJECT-SELECT"]');
    if (sel) {
      sel.innerHTML = list.length ?
        list.map((p, i) => `<option value="${i}">${p.name}</option>`).join('') :
        '<option>No projects</option>';
    }
  }

  // Initialize when navigating to timelines
  function initTimelines() {
    if (location.hash === '#/timelines') {
      try {
        if (typeof window.tlInitFromStore === 'function') {
          window.tlInitFromStore();
        }
        if (typeof window.tlRender === 'function') {
          window.tlRender();
        }
      } catch (e) {
        console.error('[TL] Init error:', e);
      }
    }
  }

  // Listen for hash changes
  window.addEventListener('hashchange', initTimelines);
  
  // Init if already on timelines page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimelines);
  } else {
    initTimelines();
  }

  console.log('[TL] timelines.js loaded');
})();
