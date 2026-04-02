// ─────────────────────────────────────────────
//  Co-DNA · webviewPanel.ts
//  UI faithful to the original Co-DNA style.
//  3 modes: scan | explain | translate
//  + button for file / project attachment
//  Default API: https://co-dna-fullproject.onrender.com
// ─────────────────────────────────────────────



// ── Utilities ─────────────────────────────────

export function esc(s: unknown): string {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cspBlock(src: string): string {
  return [
    "default-src 'none';",
    `style-src ${src} 'unsafe-inline';`,
    `script-src https://cdn.jsdelivr.net ${src} 'unsafe-inline';`,
    `font-src ${src} https: data:;`,
    `img-src ${src} https: data:;`,
  ].join(" ");
}

// ── CSS — mirrors original vscode variable palette ────────────────────────────

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
body{
  font-family:var(--vscode-font-family);
  font-size:13px;
  line-height:1.5;
  background:var(--vscode-editor-background);
  color:var(--vscode-foreground);
  height:100vh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
}

/* ── Header ── */
.header{
  flex:0 0 auto;
  display:flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  border-bottom:1px solid var(--vscode-widget-border);
  background:var(--vscode-sideBar-background);
}
.brand{font-weight:700;font-size:14px;letter-spacing:-0.01em;}
.model-label{font-size:11px;opacity:0.75;margin-left:2px;}
.header-spacer{flex:1;}

/* ── Mode tabs (top) ── */
.mode-tabs{
  display:flex;
  gap:3px;
  background:var(--vscode-editor-background);
  border:1px solid var(--vscode-widget-border);
  border-radius:6px;
  padding:2px;
}
.mode-tab{
  background:transparent;
  border:none;
  color:var(--vscode-foreground);
  opacity:0.6;
  padding:4px 11px;
  border-radius:4px;
  cursor:pointer;
  font-family:var(--vscode-font-family);
  font-size:12px;
  font-weight:600;
  transition:opacity 0.1s,background 0.1s;
  white-space:nowrap;
}
.mode-tab:hover{opacity:0.9;background:var(--vscode-sideBar-background);}
.mode-tab.active{
  background:var(--vscode-button-background);
  color:var(--vscode-button-foreground);
  opacity:1;
}

/* ── Content ── */
.content{flex:1 1 auto;overflow-y:auto;padding:12px;}

/* ── Inner tabs ── */
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;}
.tabs button{
  background:var(--vscode-button-secondaryBackground);
  color:var(--vscode-button-secondaryForeground);
  border:none;
  padding:5px 11px;
  border-radius:6px;
  cursor:pointer;
  font-family:var(--vscode-font-family);
  font-size:12px;
}
.tabs button.active{
  background:var(--vscode-button-background);
  color:var(--vscode-button-foreground);
}
.panel{display:none;}
.panel.active{display:block;}

/* ── Scores grid ── */
.scores{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;}
.card{
  background:var(--vscode-sideBar-background);
  border:1px solid var(--vscode-widget-border);
  border-radius:8px;
  padding:11px 12px;
}
.card .label{font-size:10px;text-transform:uppercase;letter-spacing:0.05em;opacity:0.75;margin-bottom:4px;}
.card .num{font-size:26px;font-weight:700;line-height:1.1;}
.card .bar{height:3px;border-radius:99px;background:var(--vscode-widget-border);margin-top:6px;overflow:hidden;}
.card .bar-fill{height:100%;border-radius:99px;transition:width 0.5s;}

/* ── Risk badge ── */
.risk{padding:3px 9px;border-radius:999px;font-weight:600;font-size:11px;letter-spacing:0.03em;}
.risk-HIGH{background:rgba(239,68,68,0.18);color:#f87171;}
.risk-CRITICAL{background:rgba(239,68,68,0.25);color:#ef4444;}
.risk-MEDIUM{background:rgba(245,158,11,0.18);color:#fbbf24;}
.risk-LOW{background:rgba(34,197,94,0.18);color:#4ade80;}
.risk-UNKNOWN{background:var(--vscode-badge-background);color:var(--vscode-badge-foreground);}

/* ── Business impact card ── */
.impact{
  background:var(--vscode-sideBar-background);
  border:1px solid var(--vscode-widget-border);
  border-radius:8px;
  padding:11px 12px;
  margin-bottom:12px;
  display:flex;align-items:center;gap:12px;
}
.impact-num{font-size:24px;font-weight:700;color:#4ade80;}
.impact-meta{font-size:11px;opacity:0.75;margin-top:2px;}

/* ── Issue list ── */
ul{margin:0;padding-left:18px;}
li{margin-bottom:5px;line-height:1.5;}
.sev{font-size:10px;text-transform:uppercase;font-weight:700;margin-right:5px;}
.sev-high,.sev-critical{color:#f87171;}
.sev-medium{color:#fbbf24;}
.sev-low{color:#94a3b8;}
.sev-security{color:#f87171;}
.loc{opacity:0.65;font-size:11px;font-family:var(--vscode-editor-font-family,monospace);}
h3{font-size:12px;font-weight:700;margin:10px 0 6px;opacity:0.85;text-transform:uppercase;letter-spacing:0.04em;}

/* ── Mermaid ── */
.mermaid{
  background:var(--vscode-sideBar-background);
  border:1px solid var(--vscode-widget-border);
  border-radius:8px;
  padding:10px;
  min-height:80px;
  overflow:auto;
}
.hidden{display:none!important;}

/* ── Refactor plan ── */
.rf{display:flex;gap:10px;border-bottom:1px solid var(--vscode-widget-border);padding:9px 0;}
.rf:last-child{border-bottom:none;}
.rf-num{
  flex:0 0 22px;height:22px;
  background:var(--vscode-button-background);
  color:var(--vscode-button-foreground);
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;margin-top:1px;flex-shrink:0;
}
.rf-body strong{display:block;font-size:12.5px;margin-bottom:2px;}
.rf-body p{font-size:11.5px;opacity:0.8;margin-bottom:5px;}
pre.ex{
  margin:6px 0;padding:8px;
  background:var(--vscode-textCodeBlock-background);
  border-radius:6px;white-space:pre-wrap;word-break:break-word;
  font-size:12px;font-family:var(--vscode-editor-font-family,monospace);
}

/* ── Explain prose ── */
.prose{
  background:var(--vscode-sideBar-background);
  border:1px solid var(--vscode-widget-border);
  border-radius:8px;
  padding:12px;white-space:pre-wrap;word-break:break-word;
  line-height:1.65;font-size:13px;margin-bottom:10px;
}

/* ── Translate code block ── */
pre.code-out{
  background:var(--vscode-textCodeBlock-background);
  border:1px solid var(--vscode-widget-border);
  border-radius:8px;
  padding:12px;white-space:pre;overflow:auto;max-height:55vh;
  font-family:var(--vscode-editor-font-family,monospace);
  font-size:12px;line-height:1.55;
}
.lang-tag{
  display:inline-block;padding:2px 8px;border-radius:99px;
  font-size:10px;font-weight:700;letter-spacing:0.04em;
  background:rgba(74,222,128,0.15);color:#4ade80;margin-bottom:6px;
}
.code-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}

/* ── Buttons ── */
.btn{
  background:var(--vscode-button-secondaryBackground);
  color:var(--vscode-button-secondaryForeground);
  border:none;padding:5px 10px;border-radius:5px;
  cursor:pointer;font-family:var(--vscode-font-family);
  font-size:11px;font-weight:600;
}
.btn:hover{opacity:0.85;}
.btn-primary{background:var(--vscode-button-background);color:var(--vscode-button-foreground);}
.btn-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;}

/* ── Banner ── */
.banner{
  background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);
  border-radius:6px;padding:7px 10px;font-size:12px;margin-bottom:10px;
}

/* ── Empty / loading / error ── */
.state-box{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  height:100%;gap:10px;text-align:center;padding:40px 20px;
  color:var(--vscode-descriptionForeground);
}
.state-icon{font-size:32px;margin-bottom:4px;}
.state-box h2{font-size:14px;font-weight:700;color:var(--vscode-foreground);margin-bottom:2px;}
.state-box p{font-size:12px;max-width:280px;}
.spinner{
  width:28px;height:28px;
  border:2px solid var(--vscode-button-secondaryBackground);
  border-top-color:var(--vscode-button-background);
  border-radius:50%;animation:sp 0.7s linear infinite;
}
@keyframes sp{to{transform:rotate(360deg);}}
.error-box{
  background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);
  border-radius:8px;padding:12px;color:#f87171;margin-top:4px;
}
.error-box strong{display:block;margin-bottom:4px;}
.error-box small{color:var(--vscode-descriptionForeground);}

/* ── Input bar ── */
.input-bar{
  flex:0 0 auto;
  border-top:1px solid var(--vscode-widget-border);
  background:var(--vscode-sideBar-background);
  padding:8px 10px;
}
.lang-row{display:flex;align-items:center;gap:7px;margin-bottom:6px;}
.lang-row label{font-size:11px;font-weight:600;opacity:0.75;white-space:nowrap;}
select.lang-select{
  background:var(--vscode-input-background);
  color:var(--vscode-foreground);
  border:1px solid var(--vscode-input-border,var(--vscode-widget-border));
  border-radius:5px;padding:4px 8px;
  font-family:var(--vscode-font-family);font-size:12px;cursor:pointer;flex:1;
}
.input-row{display:flex;gap:6px;align-items:flex-end;}
.input-grow{flex:1;position:relative;}

textarea.code-input{
  width:100%;
  background:var(--vscode-input-background);
  color:var(--vscode-foreground);
  border:1px solid var(--vscode-input-border,var(--vscode-widget-border));
  border-radius:6px;
  padding:7px 34px 7px 9px;
  font-family:var(--vscode-editor-font-family,monospace);
  font-size:12px;resize:none;outline:none;line-height:1.45;
  transition:border-color 0.15s;
}
textarea.code-input:focus{border-color:var(--vscode-focusBorder);}
textarea.code-input::placeholder{opacity:0.55;}

/* + button */
.add-btn{
  position:absolute;right:6px;bottom:7px;
  width:22px;height:22px;
  background:var(--vscode-button-secondaryBackground);
  color:var(--vscode-button-secondaryForeground);
  border:none;border-radius:4px;cursor:pointer;
  font-size:15px;font-weight:700;
  display:flex;align-items:center;justify-content:center;line-height:1;
}
.add-btn:hover{background:var(--vscode-button-background);color:var(--vscode-button-foreground);}

/* + dropdown */
.add-menu{
  position:absolute;bottom:34px;right:0;
  background:var(--vscode-menu-background,var(--vscode-sideBar-background));
  border:1px solid var(--vscode-widget-border);
  border-radius:7px;padding:4px;min-width:170px;
  z-index:99;display:none;
  box-shadow:0 4px 16px rgba(0,0,0,0.35);
}
.add-menu.open{display:block;}
.add-menu button{
  display:flex;align-items:center;gap:7px;
  width:100%;text-align:left;background:transparent;border:none;
  color:var(--vscode-foreground);padding:6px 9px;border-radius:5px;
  cursor:pointer;font-family:var(--vscode-font-family);font-size:12px;
}
.add-menu button:hover{background:var(--vscode-list-hoverBackground);}

/* attached file chips */
.attached-files{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:5px;}
.file-chip{
  display:flex;align-items:center;gap:4px;
  background:var(--vscode-badge-background);
  color:var(--vscode-badge-foreground);
  border-radius:99px;padding:2px 8px;font-size:11px;max-width:180px;
}
.file-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.file-chip .rm{cursor:pointer;opacity:0.7;flex-shrink:0;font-size:12px;margin-left:2px;}
.file-chip .rm:hover{opacity:1;}

.run-btn{
  background:var(--vscode-button-background);
  color:var(--vscode-button-foreground);
  border:none;border-radius:6px;
  padding:0 13px;height:36px;
  cursor:pointer;font-family:var(--vscode-font-family);
  font-size:12px;font-weight:700;white-space:nowrap;flex-shrink:0;
}
.run-btn:hover{opacity:0.9;}
.hint{font-size:10px;opacity:0.5;margin-top:4px;}
`;

// ── Embedded JS ───────────────────────────────────────────────────────────────

const JS = `
(function(){
  const vscode = acquireVsCodeApi();
  let mode = 'scan';
  let state = { loading:false, result:null, error:null };
  let attachedFiles = [];

  // ── Mode tab switching ──
  document.querySelectorAll('.mode-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      mode = btn.dataset.mode;
      document.querySelectorAll('.mode-tab').forEach(t=>t.classList.toggle('active',t.dataset.mode===mode));
      updateLangRow();
      resetState();
    });
  });

  function updateLangRow(){
    const lr = document.getElementById('lang-row');
    if(lr) lr.style.display = mode==='translate'?'flex':'none';
    const ta = document.getElementById('code-input');
    if(!ta) return;
    const ph = {
      scan:'Paste code here, or leave blank to use the active editor\u2026',
      explain:'Paste code, or ask a question about it\u2026',
      translate:'Paste the code you want to translate\u2026'
    };
    ta.placeholder = ph[mode]||'';
  }

  function resetState(){
    state={loading:false,result:null,error:null};
    render();
  }

  // ── + button / menu ──
  const addBtn  = document.getElementById('add-btn');
  const addMenu = document.getElementById('add-menu');

  addBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    addMenu.classList.toggle('open');
  });
  document.addEventListener('click',()=>addMenu.classList.remove('open'));
  addMenu.addEventListener('click',(e)=>e.stopPropagation());

  document.getElementById('add-file').addEventListener('click',()=>{
    addMenu.classList.remove('open');
    vscode.postMessage({type:'pickFile'});
  });
  document.getElementById('add-project').addEventListener('click',()=>{
    addMenu.classList.remove('open');
    vscode.postMessage({type:'pickProject'});
  });

  // ── Submit ──
  document.getElementById('run-btn').addEventListener('click', submit);
  document.getElementById('code-input').addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();submit();}
  });

  function submit(){
    const code   = document.getElementById('code-input').value.trim();
    const lang   = document.getElementById('target-lang')?.value||'Python';
    const extras = attachedFiles.map(f=>f.content).join('\\n\\n---\\n\\n');
    const combined = [code, extras].filter(Boolean).join('\\n\\n');
    state={loading:true,result:null,error:null};
    render();
    vscode.postMessage({type:'submit', mode, code:combined, targetLanguage:lang});
  }

  // ── Messages from extension ──
  window.addEventListener('message',e=>{
    const msg = e.data;
    if(msg.type==='result'){
      state={loading:false,result:msg.data,error:null};
      render();
    } else if(msg.type==='error'){
      state={loading:false,result:null,error:msg.message};
      render();
    } else if(msg.type==='prepopulate'){
      if(msg.code) document.getElementById('code-input').value=msg.code;
      if(msg.mode){
        mode=msg.mode;
        document.querySelectorAll('.mode-tab').forEach(t=>t.classList.toggle('active',t.dataset.mode===mode));
        updateLangRow();
      }
      submit();
    } else if(msg.type==='fileLoaded'){
      attachedFiles.push({name:msg.name, content:msg.content});
      renderChips();
    } else if(msg.type==='projectLoaded'){
      attachedFiles.push({name:'[project] '+msg.name, content:msg.content});
      renderChips();
    }
  });

  // ── File chips ──
  function renderChips(){
    const wrap = document.getElementById('attached-files');
    wrap.innerHTML = attachedFiles.map((f,i)=>
      \`<div class="file-chip"><span title="\${esc(f.name)}">\${esc(f.name)}</span><span class="rm" data-i="\${i}">\u2715</span></div>\`
    ).join('');
    wrap.querySelectorAll('.rm').forEach(btn=>{
      btn.addEventListener('click',()=>{
        attachedFiles.splice(Number(btn.dataset.i),1);
        renderChips();
      });
    });
  }

  // ── Main render ──
  function render(){
    const el = document.getElementById('content');
    if(state.loading){ el.innerHTML = renderLoading(); return; }
    if(state.error)  { el.innerHTML = renderError(state.error); return; }
    if(!state.result){ el.innerHTML = renderEmpty(); return; }
    if(mode==='scan')           el.innerHTML = renderScan(state.result);
    else if(mode==='explain')   el.innerHTML = renderExplain(state.result);
    else if(mode==='translate') el.innerHTML = renderTranslate(state.result);
    postRender();
  }

  function postRender(){
    // Render first visible mermaid blocks
    if(window.mermaid){
      const nodes = Array.from(document.querySelectorAll('.mermaid:not(.hidden):not(.done)'));
      if(nodes.length){
        nodes.forEach(n=>n.classList.add('done'));
        try{ window.mermaid.run({nodes}); }catch(e){}
      }
    }
    // Inner tab (main panels)
    document.querySelectorAll('[data-main]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const g=btn.dataset.group||'scan';
        const k=btn.dataset.main;
        document.querySelectorAll('[data-group="'+g+'"][data-main]').forEach(b=>b.classList.toggle('active',b===btn));
        document.querySelectorAll('[data-group="'+g+'"].panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+g+'-'+k));
        renderNewMermaid(document.getElementById('panel-'+g+'-'+k));
      });
    });
    // Diagram sub-tabs
    document.querySelectorAll('[data-sub]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const g=btn.dataset.group;
        document.querySelectorAll('[data-group="'+g+'"][data-sub]').forEach(b=>b.classList.toggle('active',b===btn));
        document.querySelectorAll('[data-group="'+g+'"].mermaid').forEach(el=>el.classList.toggle('hidden',el.dataset.key!==btn.dataset.sub));
        renderNewMermaid(document.querySelector('[data-group="'+g+'"].mermaid[data-key="'+btn.dataset.sub+'"]'));
      });
    });
    // Copy buttons
    document.querySelectorAll('[data-copy]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        let text='';
        if(btn.dataset.copy==='__code__') text=state.result?.rewritten_code||'';
        else if(btn.dataset.copy==='__issues__') text=buildIssuesSummary();
        else text=btn.dataset.copy||'';
        vscode.postMessage({type:'copy',text});
        const orig=btn.textContent; btn.textContent='Copied!';
        setTimeout(()=>btn.textContent=orig,1400);
      });
    });
  }

  function renderNewMermaid(container){
    if(!container||!window.mermaid) return;
    const nodes=Array.from(container.querySelectorAll('.mermaid:not(.hidden):not(.done)'));
    if(!nodes.length) return;
    nodes.forEach(n=>n.classList.add('done'));
    try{ window.mermaid.run({nodes}); }catch(e){}
  }

  function buildIssuesSummary(){
    const d=state.result||{};
    return [
      ...(Array.isArray(d.issues)?d.issues:[]).map(i=>'['+i.severity+'] '+i.title+': '+i.details),
      ...(Array.isArray(d.security_issues)?d.security_issues:[]).map(s=>'[security] '+(s.type||'risk')+': '+(s.details||JSON.stringify(s)))
    ].join('\\n\\n');
  }

  // ── Empty / Loading / Error ──
  function renderEmpty(){
    const icons={scan:'📡',explain:'🧠',translate:'🔄'};
    const titles={scan:'Scan for technical debt',explain:'Explain any code',translate:'Translate to another language'};
    const descs={
      scan:'Detects spaghetti score, security issues, and gives a prioritized fix plan with cost estimate.',
      explain:'Get a plain-English explanation and an auto-generated flowchart.',
      translate:'Convert code idiomatically into Python, Go, Java, Rust, and 8 more.'
    };
    return \`<div class="state-box">
      <div class="state-icon">\${icons[mode]}</div>
      <h2>\${titles[mode]}</h2>
      <p>\${descs[mode]}</p>
      <p style="opacity:0.45;font-size:11px;margin-top:6px">Paste code below \u2014 or open a file and press Run</p>
    </div>\`;
  }

  function renderLoading(){
    const lbl={scan:'Scanning for technical debt\u2026',explain:'Generating explanation\u2026',translate:'Translating code\u2026'};
    return \`<div class="state-box"><div class="spinner"></div><p>\${lbl[mode]||'Working\u2026'}</p></div>\`;
  }

  function renderError(msg){
    return \`<div class="error-box"><strong>\u26a0 Error</strong>\${esc(msg)}<br><small>Check that the Co-DNA backend is reachable.</small></div>\`;
  }

  // ── SCAN ──
  function renderScan(d){
    const sp  = Number(d.spaghetti_score??0);
    const sec = Number(d.security_score??0);
    const cx  = Number(d.complexity_score??0);
    const risk = String(d.risk_level??'UNKNOWN');
    const rc  = riskCls(risk);
    const issues    = Array.isArray(d.issues)?d.issues:[];
    const secIssues = Array.isArray(d.security_issues)?d.security_issues:[];
    const plan      = Array.isArray(d.refactor_plan)?d.refactor_plan:[];
    const impact    = d.business_impact||{};
    const logic = normM(d.logic_flow_diagram||d.flowchart);
    const arch  = normM(d.architecture_diagram);
    const fn    = normM(d.function_flow_diagram);
    const banner = d.ai_partial?'<div class="banner">\u26a0 AI analysis limited \u2014 rule-based metrics still shown.</div>':'';

    const issHtml = issues.map(i=>
      '<li><span class="sev sev-'+esc(String(i.severity||'').toLowerCase())+'">'+esc(i.severity||'low')+'</span> <strong>'+esc(i.title)+'</strong> \u2014 '+esc(i.details)+(i.location?' <span class="loc">('+esc(i.location)+')</span>':'')+'</li>'
    ).join('');

    const secHtml = secIssues.map(s=>{
      const t=typeof s.type==='string'?s.type:'security';
      const det=typeof s.details==='string'?s.details:JSON.stringify(s);
      return '<li><span class="sev sev-security">security</span> <strong>'+esc(t)+'</strong> \u2014 '+esc(det)+'</li>';
    }).join('');

    const rfHtml = plan.map((p,i)=>
      '<div class="rf"><div class="rf-num">'+(i+1)+'</div><div class="rf-body"><strong>'+esc(p.step)+'</strong><p>'+esc(p.why)+'</p>'+(p.example_change?'<pre class="ex">'+esc(p.example_change)+'</pre><button class="btn" data-copy="'+esc(p.example_change)+'">Copy</button>':'')+'</div></div>'
    ).join('');

    const impactHtml = impact.estimated_cost!=null
      ? '<div class="impact"><div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;opacity:.7;margin-bottom:2px">\uD83D\uDCB0 Business Impact</div><div class="impact-num">$'+Number(impact.estimated_cost).toLocaleString()+'</div><div class="impact-meta">'+(impact.estimated_effort_hours||'?')+'h engineering effort \u00b7 Severity: '+(impact.severity||'\u2014')+'</div></div></div>'
      : '';

    return banner+
      '<div class="scores">'+scoreCard('Spaghetti',sp,scoreColor(sp))+scoreCard('Security',sec,scoreColor(sec))+scoreCard('Complexity',cx,scoreColor(cx))+'</div>'+
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span class="risk risk-'+rc+'">'+esc(risk)+' risk</span></div>'+
      impactHtml+
      '<div class="tabs">'+
        '<button data-group="scan" data-main="diagrams" class="active">Diagrams</button>'+
        '<button data-group="scan" data-main="issues">Issues ('+(issues.length+secIssues.length)+')</button>'+
        '<button data-group="scan" data-main="refactor">Refactor plan</button>'+
      '</div>'+
      '<div id="panel-scan-diagrams" class="panel active">'+
        '<div class="tabs" style="margin-bottom:7px">'+
          '<button data-group="diagrams" data-sub="logic" class="active">Logic flow</button>'+
          '<button data-group="diagrams" data-sub="arch">Architecture</button>'+
          '<button data-group="diagrams" data-sub="fn">Function flow</button>'+
        '</div>'+
        '<div class="mermaid" data-group="diagrams" data-key="logic">'+esc(logic)+'</div>'+
        '<div class="mermaid hidden" data-group="diagrams" data-key="arch">'+esc(arch)+'</div>'+
        '<div class="mermaid hidden" data-group="diagrams" data-key="fn">'+esc(fn)+'</div>'+
      '</div>'+
      '<div id="panel-scan-issues" class="panel">'+
        '<h3>Technical issues</h3><ul>'+(issHtml||'<li>No issues found.</li>')+'</ul>'+
        '<h3>Security issues</h3><ul>'+(secHtml||'<li>No security issues found.</li>')+'</ul>'+
        '<div class="btn-row"><button class="btn" data-copy="__issues__">Copy summary</button></div>'+
      '</div>'+
      '<div id="panel-scan-refactor" class="panel">'+(rfHtml||'<p style="opacity:.7;font-size:12px">No refactor steps returned.</p>')+'</div>';
  }

  // ── EXPLAIN ──
  function renderExplain(d){
    const expl = String(d.explanation||'No explanation returned.');
    const logic = normM(d.logic_flow_diagram||d.flowchart);
    const fn    = normM(d.function_flow_diagram);
    const arch  = normM(d.architecture_diagram);
    return (
      '<div class="tabs">'+
        '<button data-group="explain" data-main="explanation" class="active">Explanation</button>'+
        '<button data-group="explain" data-main="diagrams">Flowcharts</button>'+
      '</div>'+
      '<div id="panel-explain-explanation" class="panel active">'+
        '<div class="prose">'+esc(expl)+'</div>'+
        '<div class="btn-row"><button class="btn" data-copy="'+esc(expl)+'">Copy explanation</button></div>'+
      '</div>'+
      '<div id="panel-explain-diagrams" class="panel">'+
        '<div class="tabs" style="margin-bottom:7px">'+
          '<button data-group="exDiag" data-sub="logic" class="active">Logic flow</button>'+
          '<button data-group="exDiag" data-sub="fn">Function flow</button>'+
          '<button data-group="exDiag" data-sub="arch">Architecture</button>'+
        '</div>'+
        '<div class="mermaid" data-group="exDiag" data-key="logic">'+esc(logic)+'</div>'+
        '<div class="mermaid hidden" data-group="exDiag" data-key="fn">'+esc(fn)+'</div>'+
        '<div class="mermaid hidden" data-group="exDiag" data-key="arch">'+esc(arch)+'</div>'+
      '</div>'
    );
  }

  // ── TRANSLATE ──
  function renderTranslate(d){
    const code = String(d.rewritten_code||'// No output returned.');
    const lang = document.getElementById('target-lang')?.value||'Python';
    const lines = code.split('\\n').length;
    return (
      '<div class="code-meta">'+
        '<span class="lang-tag">\u26a1 '+esc(lang)+'</span>'+
        '<span style="font-size:11px;opacity:.6">'+lines+' lines</span>'+
      '</div>'+
      '<pre class="code-out">'+esc(code)+'</pre>'+
      '<div class="btn-row"><button class="btn btn-primary" data-copy="__code__">Copy translated code</button></div>'
    );
  }

  // ── Helpers ──
  function scoreCard(label,val,color){
    return '<div class="card"><div class="label">'+label+'</div><div class="num" style="color:'+color+'">'+val+'</div><div class="bar"><div class="bar-fill" style="width:'+Math.min(100,val)+'%;background:'+color+'"></div></div></div>';
  }
  function scoreColor(v){
    if(v>=75) return '#f87171';
    if(v>=50) return '#fbbf24';
    if(v>=25) return '#f97316';
    return '#4ade80';
  }
  function riskCls(r){
    const u=String(r).toUpperCase();
    if(u.includes('CRITICAL')) return 'CRITICAL';
    if(u.includes('HIGH'))     return 'HIGH';
    if(u.includes('MEDIUM'))   return 'MEDIUM';
    if(u.includes('LOW'))      return 'LOW';
    return 'UNKNOWN';
  }
  function normM(raw){
    let s=String(raw||'').trim();
    if(!s) return 'flowchart TD\\n  A[No diagram]';
    const dup=/^((?:flowchart|graph)\\s+(?:TD|LR|RL|BT))\\s+(?:(?:flowchart|graph)\\s+(?:TD|LR|RL|BT))\\s*/i;
    let g=0; while(dup.test(s)&&g++<8) s=s.replace(dup,'$1\\n');
    if(/^(flowchart|graph)\\s+(TD|LR|RL|BT)\\b/i.test(s)) return s;
    return 'flowchart TD\\n'+s;
  }
  function esc(s){
    return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // Init
  updateLangRow();
  render();
})();
`;

// ── Build full HTML ────────────────────────────────────────────────────────────

export function buildPanelHtml(cspSource: string, modelLabel: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${esc(cspBlock(cspSource))}">
  <title>Co-DNA</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>${CSS}</style>
</head>
<body>

<!-- ── Header ── -->
<header class="header">
  <span class="brand">Co-DNA · DebtSight</span>
  <span class="model-label">${esc(modelLabel)}</span>
  <div class="header-spacer"></div>
  <nav class="mode-tabs">
    <button class="mode-tab active" data-mode="scan">📡 Scan</button>
    <button class="mode-tab" data-mode="explain">🧠 Explain</button>
    <button class="mode-tab" data-mode="translate">🔄 Translate</button>
  </nav>
</header>

<!-- ── Content ── -->
<main class="content" id="content"></main>

<!-- ── Input bar ── -->
<footer class="input-bar">
  <div class="attached-files" id="attached-files"></div>

  <div class="lang-row" id="lang-row" style="display:none">
    <label for="target-lang">Translate to</label>
    <select class="lang-select" id="target-lang">
      <option>Python</option>
      <option>JavaScript</option>
      <option>TypeScript</option>
      <option>Java</option>
      <option>C++</option>
      <option>C#</option>
      <option>Go</option>
      <option>Rust</option>
      <option>PHP</option>
      <option>Ruby</option>
      <option>Swift</option>
      <option>Kotlin</option>
    </select>
  </div>

  <div class="input-row">
    <div class="input-grow">
      <textarea
        class="code-input"
        id="code-input"
        rows="3"
        placeholder="Paste code here, or leave blank to use the active editor\u2026"
      ></textarea>

      <button class="add-btn" id="add-btn" title="Add file or project">+</button>
      <div class="add-menu" id="add-menu">
        <button id="add-file">📄 Add file</button>
        <button id="add-project">📁 Add entire project</button>
      </div>
    </div>

    <button class="run-btn" id="run-btn">▶ Run</button>
  </div>
  <div class="hint">Ctrl+Enter to submit · Leave blank to analyse the active editor</div>
</footer>

<script>
  window.mermaid?.initialize({ startOnLoad:false, securityLevel:'loose', theme:'dark' });
</script>
<script>${JS}</script>
</body>
</html>`;
}
