'use client'
import { useEffect, useState, useRef } from 'react';
import './globals.css';

type ChatMsg = { role: string; content: string; meta: string };
type ToastState = { msg: string; visible: boolean };

export default function Home() {
  const [toast, setToast] = useState<ToastState>({ msg: '', visible: false });
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { role: 'ai', content: '👋 Welcome to IND-INTELLIGENCE. I can answer questions about assets, procedures, maintenance history, and compliance. Try asking about a specific equipment or incident.', meta: 'System · Just now' },
  ]);
  const [imieQuery, setImieQuery] = useState('');
  const [imieResponse, setImieResponse] = useState<{ visible: boolean; text: string }>({ visible: false, text: '' });
  const [uinput, setUinput] = useState('');
  const [activeView, setActiveView] = useState('dash');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast({ msg: '', visible: false }), 3000);
  };

  const sw = (name: string) => setActiveView(name);

  const downloadMockFile = (fileName: string) => {
    showToast(`Downloading ${fileName}…`);
    const a = document.createElement('a');
    a.href = '#'; a.download = fileName;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uinput.trim()) return;
    const q = uinput;
    setChatMsgs(p => [...p, { role: 'user', content: q, meta: 'User · Just now' }]);
    setUinput('');
    setTimeout(() => {
      setChatMsgs(p => [...p, { role: 'ai', content: `Based on the knowledge graph and indexed documents, here is the best match for: "${q}". (RAG pipeline active — 98% confidence from 12 source documents.)`, meta: 'IND-AI · 98% Confidence' }]);
    }, 900);
  };

  const handleImieQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imieQuery.trim()) return;
    const responses: { [key: string]: string } = {
      default: `A similar incident occurred in 2022 and 2024. Previous corrective action reduced downtime by 40%. Recommended action: Replace bearing and inspect lubrication system. Expert: Rajan Kumar (retired 2023) documented this in SOP-MNT-047.`,
    };
    setImieResponse({ visible: true, text: responses.default });
  };

  // Draw knowledge graph canvas
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const nodes = [
      { x: 0.5, y: 0.4, label: 'Compressor C-101', color: '#f59e0b', r: 28 },
      { x: 0.25, y: 0.25, label: 'Bearing Assembly', color: '#8b5cf6', r: 20 },
      { x: 0.75, y: 0.25, label: 'SOP-MNT-047', color: '#38bdf8', r: 20 },
      { x: 0.25, y: 0.65, label: 'Incident 2024', color: '#f43f5e', r: 20 },
      { x: 0.75, y: 0.65, label: 'PESO Compliance', color: '#10b981', r: 20 },
      { x: 0.5, y: 0.8, label: 'Engineer: Rajan', color: '#f97316', r: 18 },
    ];
    const edges = [[0,1],[0,2],[0,3],[0,4],[3,5],[2,4]];
    ctx.clearRect(0, 0, c.width, c.height);
    edges.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      ctx.beginPath();
      ctx.moveTo(na.x * c.width, na.y * c.height);
      ctx.lineTo(nb.x * c.width, nb.y * c.height);
      ctx.strokeStyle = 'rgba(26,39,64,0.9)'; ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x * c.width, n.y * c.height, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color + '22'; ctx.fill();
      ctx.strokeStyle = n.color; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#e8edf5'; ctx.font = 'bold 9px Inter';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.label.split(' ').slice(0,2).join(' '), n.x * c.width, n.y * c.height);
    });
  }, [activeView]);

  const views = ['dash','ingestion','graph','copilot','maintenance','compliance','lessons','imie','arch'];

  return (
    <div className="shell">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="logo-gem">⚙</div>
          <div>
            <div className="logo-name"><span>IND‑INTELLIGENCE</span></div>
            <div className="logo-sub">INDUSTRIAL KNOWLEDGE PLATFORM</div>
          </div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section">Overview</div>
          <button className={`nb${activeView==='dash'?' on':''}`} onClick={()=>sw('dash')}>
            <i className="ni fa-solid fa-gauge-high"/> Dashboard
          </button>
          <div className="sb-section" style={{marginTop:'12px'}}>Modules</div>
          <button className={`nb${activeView==='ingestion'?' on':''}`} onClick={()=>sw('ingestion')}>
            <i className="ni fa-solid fa-file-arrow-up"/> Document Ingestion
          </button>
          <button className={`nb${activeView==='graph'?' on':''}`} onClick={()=>sw('graph')}>
            <i className="ni fa-solid fa-circle-nodes"/> Knowledge Graph
          </button>
          <button className={`nb${activeView==='copilot'?' on':''}`} onClick={()=>sw('copilot')}>
            <i className="ni fa-solid fa-message"/> Expert Copilot
          </button>
          <button className={`nb${activeView==='maintenance'?' on':''}`} onClick={()=>sw('maintenance')}>
            <i className="ni fa-solid fa-wrench"/> Maintenance & RCA
          </button>
          <button className={`nb${activeView==='compliance'?' on':''}`} onClick={()=>sw('compliance')}>
            <i className="ni fa-solid fa-shield-halved"/> Compliance & Quality
          </button>
          <button className={`nb${activeView==='lessons'?' on':''}`} onClick={()=>sw('lessons')}>
            <i className="ni fa-solid fa-lightbulb"/> Lessons Learned
          </button>
          <div className="sb-section" style={{marginTop:'12px'}}>New</div>
          <button className={`nb${activeView==='imie'?' on':''}`} onClick={()=>sw('imie')} style={{borderLeft:'2px solid #f59e0b'}}>
            <i className="ni fa-solid fa-brain"/> Memory Engine
            <span className="nbadge ba">NEW</span>
          </button>
          <div className="sb-section" style={{marginTop:'12px'}}>System</div>
          <button className={`nb${activeView==='arch'?' on':''}`} onClick={()=>sw('arch')}>
            <i className="ni fa-solid fa-diagram-project"/> Architecture
          </button>
        </nav>
        <div className="sb-foot">
          <div className="sfc">
            <div className="sfr">
              <span className="sfl">Platform Status</span>
              <div className="pdot"/>
            </div>
            <div className="sfstat"><b>7</b> modules active · <b>3,241</b> docs indexed</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="tb-l">
            <span className="tb-bc">
              <strong>{
                activeView==='dash'?'Command Dashboard':
                activeView==='ingestion'?'Document Ingestion':
                activeView==='graph'?'Knowledge Graph':
                activeView==='copilot'?'Expert Copilot':
                activeView==='maintenance'?'Maintenance & RCA':
                activeView==='compliance'?'Compliance & Quality':
                activeView==='lessons'?'Lessons Learned':
                activeView==='imie'?'Industrial Memory Intelligence Engine':
                'Architecture'
              }</strong>
            </span>
            <div className="plant-tag"><i className="fa-solid fa-location-dot"/>Reliance Jamnagar · Plant-A</div>
          </div>
          <div className="tb-r">
            <button className="tbtn" onClick={()=>showToast('Syncing knowledge graph…')}><i className="fa-solid fa-rotate"/>Sync KG</button>
            <button className="tbtn" onClick={()=>showToast('Report generated!')}><i className="fa-solid fa-file-export"/>Export</button>
            <button className="tbtn pri" onClick={()=>sw('ingestion')}><i className="fa-solid fa-plus"/>Ingest Doc</button>
          </div>
        </div>

        <div className="vc">

          {/* ══ DASHBOARD ══ */}
          {activeView==='dash' && (
            <div className="view on dash">
              <div className="hero-banner">
                <div className="hero-title">Industrial Knowledge Intelligence Platform</div>
                <div className="hero-sub">AI-powered platform that eliminates information silos, preserves expert knowledge, and transforms decades of operational data into actionable intelligence — reducing unplanned downtime by 18–22%.</div>
                <div className="hero-pills">
                  {['3,241 Documents','847 Entities','12 Assets Live','PESO Compliant','7 AI Modules'].map(p=>(
                    <span key={p} className="hero-pill"><i className="fa-solid fa-check"/>  {p}</span>
                  ))}
                </div>
              </div>
              <div className="kpi-row">
                {[
                  {cls:'a',val:'3,241',lbl:'Documents Indexed',delta:'+142 this week',up:true,icon:'fa-file'},
                  {cls:'e',val:'847',lbl:'Knowledge Entities',delta:'+38 today',up:true,icon:'fa-circle-nodes'},
                  {cls:'s',val:'94.2%',lbl:'Compliance Score',delta:'+1.4% vs last audit',up:true,icon:'fa-shield-halved'},
                  {cls:'r',val:'3',lbl:'Critical Alerts',delta:'+1 unresolved',up:false,icon:'fa-triangle-exclamation'},
                  {cls:'v',val:'12',lbl:'Expert Profiles',delta:'2 at-risk of retirement',up:false,icon:'fa-brain'},
                ].map(k=>(
                  <div key={k.lbl} className={`kpi ${k.cls}`} onClick={()=>showToast(`Opening ${k.lbl}…`)}>
                    <div className="kpi-val">{k.val}</div>
                    <div className="kpi-lbl">{k.lbl}</div>
                    <div className={`kpi-delta ${k.up?'du':'dd'}`}><i className={`fa-solid fa-arrow-${k.up?'up':'down'}`}/>{k.delta}</div>
                    <i className={`kpi-icon fa-solid ${k.icon}`}/>
                  </div>
                ))}
              </div>
              <div className="dash-grid">
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-triangle-exclamation" style={{color:'var(--rose)'}}/>Critical Alerts</div>
                  {[
                    {title:'Compressor C-101 Bearing Failure',desc:'Vibration exceeds 8.2 mm/s. Immediate inspection required.',time:'14 min ago',cls:''},
                    {title:'SOP-MNT-047 Overdue Review',desc:'Maintenance SOP last reviewed 18 months ago. Regulatory risk.',time:'2 hr ago',cls:'warn'},
                    {title:'Knowledge-Loss Risk: Rajan Kumar',desc:'Retiring in 30 days. 342 undocumented procedures at risk.',time:'Today',cls:'warn'},
                  ].map((a,i)=>(
                    <div key={i} className={`alert-strip ${a.cls}`} onClick={()=>showToast(a.title)}>
                      <i className={`as-icon fa-solid ${a.cls?'fa-triangle-exclamation':'fa-circle-exclamation'}`} style={{color:a.cls?'var(--amber)':'var(--rose)'}}/>
                      <div><div className="as-title">{a.title}</div><div className="as-desc">{a.desc}</div><div className="as-time">{a.time}</div></div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-gauge" style={{color:'var(--amber)'}}/>Platform Metrics</div>
                  {[
                    {lbl:'Document Processing Speed',val:'2.3 min/doc'},
                    {lbl:'Query Response Time',val:'1.2 sec avg'},
                    {lbl:'Knowledge Graph Coverage',val:'78.4%'},
                    {lbl:'Expert Knowledge Captured',val:'61 of 100 SOPs'},
                    {lbl:'Compliance Gap Alerts',val:'7 open'},
                  ].map(s=>(
                    <div key={s.lbl} className="mini-stat"><span className="ms-label">{s.lbl}</span><span className="ms-val">{s.val}</span></div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-th-large" style={{color:'var(--sky)'}}/>Quick Access</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                    {[
                      {icon:'fa-file-arrow-up',lbl:'Upload Doc',view:'ingestion',c:'var(--amber)'},
                      {icon:'fa-circle-nodes',lbl:'Knowledge Graph',view:'graph',c:'var(--violet)'},
                      {icon:'fa-message',lbl:'Ask Copilot',view:'copilot',c:'var(--sky)'},
                      {icon:'fa-brain',lbl:'IMIE Memory',view:'imie',c:'var(--emerald)'},
                      {icon:'fa-wrench',lbl:'Maintenance',view:'maintenance',c:'var(--rose)'},
                      {icon:'fa-shield-halved',lbl:'Compliance',view:'compliance',c:'var(--emerald)'},
                    ].map(m=>(
                      <button key={m.lbl} className="action-item" onClick={()=>sw(m.view)} style={{justifyContent:'flex-start'}}>
                        <i className={`fa-solid ${m.icon}`} style={{color:m.c}}/>{m.lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ DOCUMENT INGESTION ══ */}
          {activeView==='ingestion' && (
            <div className="view on ingv">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-file-arrow-up"/>Document Ingestion Pipeline</div>
                <button className="sec-act" onClick={()=>showToast('Viewing ingestion logs…')}>View Logs</button>
              </div>
              <div className="drop-zone" onClick={()=>{
                const i=document.createElement('input');i.type='file';i.multiple=true;
                i.onchange=(e:any)=>{if(e.target.files?.length)showToast(`${e.target.files.length} file(s) queued for ingestion`)};i.click();
              }}>
                <div className="dz-icon"><i className="fa-solid fa-cloud-arrow-up"/></div>
                <div className="dz-title">Drop Documents Here or Click to Browse</div>
                <div className="dz-sub">Supports P&IDs, SOPs, Maintenance Reports, Inspection Records, OEM Manuals</div>
                <div className="ftypes">
                  {['PDF','DWG','DOCX','XLSX','TXT','XML','Images'].map(t=><span key={t} className="ftype">{t}</span>)}
                </div>
              </div>
              <div className="card">
                <div className="card-title"><i className="fa-solid fa-diagram-project" style={{color:'var(--amber)'}}/>Processing Pipeline</div>
                <div className="pipeline">
                  {[
                    {icon:'fa-file-import',t:'Ingest',d:'Upload & parse'},
                    {icon:'fa-eye',t:'OCR / CV',d:'Text + P&ID extract'},
                    {icon:'fa-tags',t:'NER',d:'Entity tagging'},
                    {icon:'fa-circle-nodes',t:'Graph Link',d:'Neo4j insert'},
                    {icon:'fa-vector-square',t:'Vectorise',d:'Embedding store'},
                  ].map((s,i)=>(
                    <div key={s.t} className={`pstage${i===1?' act':''}`}>
                      <div className="ps-icon"><i className={`fa-solid ${s.icon}`}/></div>
                      <div className="ps-title">{s.t}</div>
                      <div className="ps-desc">{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-title"><i className="fa-solid fa-list-check" style={{color:'var(--sky)'}}/>Processing Queue</div>
                <div className="queue-list">
                  {[
                    {icon:'fa-file-pdf',name:'PID-C101-Rev4.pdf',pct:100,clr:'var(--emerald)',st:'✔ Complete'},
                    {icon:'fa-file-word',name:'SOP-MNT-047.docx',pct:67,clr:'var(--amber)',st:'⟳ Processing'},
                    {icon:'fa-image',name:'InspectionSheet-Jun24.jpg',pct:30,clr:'var(--sky)',st:'⟳ OCR…'},
                    {icon:'fa-file-excel',name:'MaintenanceLog-2024.xlsx',pct:0,clr:'var(--txt3)',st:'⏳ Queued'},
                  ].map(q=>(
                    <div key={q.name} className="q-item">
                      <i className={`qi-icon fa-solid ${q.icon}`} style={{color:q.pct===100?'var(--emerald)':'var(--amber)'}}/>
                      <span className="qi-name">{q.name}</span>
                      <div className="qi-prog"><div className="qi-bar"><div className="qi-fill" style={{width:`${q.pct}%`,background:q.clr}}/></div></div>
                      <span className="qi-status" style={{color:q.clr}}>{q.st}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ KNOWLEDGE GRAPH ══ */}
          {activeView==='graph' && (
            <div className="view on gview">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-circle-nodes"/>Knowledge Graph</div>
                <button className="sec-act" onClick={()=>showToast('Graph refreshed!')}>Refresh ↻</button>
              </div>
              <div className="g-stats">
                {[
                  {cls:'a',val:'847',lbl:'Total Entities',d:'+38 today'},
                  {cls:'e',val:'2,134',lbl:'Relationships',d:'+91 today'},
                  {cls:'s',val:'12',lbl:'Asset Classes',d:'Linked to SOPs'},
                  {cls:'v',val:'94%',lbl:'Graph Coverage',d:'+2% this week'},
                ].map(g=>(
                  <div key={g.lbl} className={`gstat ${g.cls}`}>
                    <div className="gstat-val">{g.val}</div>
                    <div className="gstat-lbl">{g.lbl}</div>
                    <div className="gstat-delta du"><i className="fa-solid fa-arrow-up"/>{g.d}</div>
                  </div>
                ))}
              </div>
              <div className="g-canvas-wrap">
                <canvas ref={canvasRef} id="gcanvas"/>
                <div className="g-legend">
                  {[{c:'#f59e0b',l:'Assets'},{c:'#8b5cf6',l:'Components'},{c:'#38bdf8',l:'Documents'},{c:'#f43f5e',l:'Incidents'},{c:'#10b981',l:'Compliance'},{c:'#f97316',l:'Experts'}].map(g=>(
                    <div key={g.l} className="gl-item"><div className="gl-dot" style={{background:g.c}}/>{g.l}</div>
                  ))}
                </div>
              </div>
              <div className="g-bottom">
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-table" style={{color:'var(--amber)'}}/>Top Entities</div>
                  <table className="etable">
                    <thead><tr><th>Entity</th><th>Type</th><th>Connections</th><th>Last Updated</th></tr></thead>
                    <tbody>
                      {[
                        {e:'Compressor C-101',t:'Asset',c:47,u:'2h ago'},
                        {e:'SOP-MNT-047',t:'Document',c:23,u:'3d ago'},
                        {e:'Bearing SKF-6309',t:'Component',c:18,u:'1d ago'},
                        {e:'Rajan Kumar',t:'Expert',c:34,u:'Active'},
                        {e:'PESO Reg. §12',t:'Compliance',c:12,u:'Audit due'},
                      ].map(r=>(
                        <tr key={r.e} onClick={()=>showToast(`Inspecting ${r.e}`)}>
                          <td>{r.e}</td><td><span className="tag tinfo">{r.t}</span></td><td>{r.c}</td><td>{r.u}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-search" style={{color:'var(--sky)'}}/>Graph Search</div>
                  <input className="cinput" style={{width:'100%',marginBottom:'10px'}} placeholder="Search entities…" onChange={e=>showToast(`Searching: ${e.target.value}`)}/>
                  {['Compressor','Bearing','PESO','SOP-MNT'].map(s=>(
                    <div key={s} className="schip" style={{display:'inline-block',margin:'3px'}} onClick={()=>showToast(`Filter: ${s}`)}>{s}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ EXPERT COPILOT ══ */}
          {activeView==='copilot' && (
            <div className="view on" style={{display:'flex',flexDirection:'column',height:'100%'}}>
              <div className="chat-pane" style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
                <div className="cp-hdr">
                  <span className="cp-hdr-t"><i className="fa-solid fa-message" style={{color:'var(--amber)',marginRight:'6px'}}/>RAG Expert Copilot</span>
                  <span className="live-badge"><div className="live-dot"/>LIVE</span>
                </div>
                <div className="suggest-bar">
                  <span className="slbl">Quick prompts:</span>
                  {['What is the SOP for C-101?','Show PESO compliance gaps','Last bearing failure history','Rajan Kumar expertise areas'].map(s=>(
                    <span key={s} className="schip" onClick={()=>setUinput(s)}>{s}</span>
                  ))}
                </div>
                <div className="msgs">
                  {chatMsgs.map((m,i)=>(
                    <div key={i} className={`msg ${m.role==='ai'?'a fu':'u'}`}>
                      <div className="mbubble">{m.content}</div>
                      <div className="mmeta">{m.meta}</div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleQ} className="cinput-wrap">
                  <div className="cinput-row">
                    <input id="uinput" className="cinput" type="text" autoComplete="off"
                      value={uinput} onChange={e=>setUinput(e.target.value)}
                      placeholder="Ask about assets, procedures, incidents, compliance…"/>
                    <button type="submit" className="csend"><i className="fa-solid fa-paper-plane"/></button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ══ MAINTENANCE & RCA ══ */}
          {activeView==='maintenance' && (
            <div className="view on rcav">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-wrench"/>Maintenance Intelligence & RCA</div>
                <button className="sec-act" onClick={()=>downloadMockFile('MaintenanceReport.pdf')}>Export Report ↗</button>
              </div>
              <div className="rca-top">
                <div className="rca-alert">
                  <div className="ra-left">
                    <i className="ra-icon fa-solid fa-triangle-exclamation"/>
                    <div>
                      <div className="ra-eq">C-101 — CRITICAL</div>
                      <div className="ra-status">Vibration 8.2 mm/s · Bearing temp 94°C · Predicted failure in <strong style={{color:'var(--rose)'}}>48 hrs</strong></div>
                    </div>
                  </div>
                  <div className="health-ring">
                    <svg viewBox="0 0 70 70" width="70" height="70"><circle cx="35" cy="35" r="28" fill="none" stroke="rgba(26,39,64,0.9)" strokeWidth="5"/><circle cx="35" cy="35" r="28" fill="none" stroke="var(--rose)" strokeWidth="5" strokeDasharray="58 118" strokeLinecap="round" transform="rotate(-90 35 35)"/></svg>
                    <div className="health-lbl"><div className="health-val">31%</div><div className="health-txt">Health</div></div>
                  </div>
                </div>
                <div className="pred-card">
                  <div className="pred-title"><i className="fa-solid fa-chart-line"/>Failure Prediction</div>
                  {[{l:'Vibration',v:82},{l:'Temperature',v:78},{l:'Oil Pressure',v:45}].map(p=>(
                    <div key={p.l} className="pred-meter">
                      <div className="pm-lbl"><span>{p.l}</span><span>{p.v}%</span></div>
                      <div className="pm-track"><div className="pm-fill" style={{width:`${p.v}%`}}/></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-title"><i className="fa-solid fa-list-check" style={{color:'var(--amber)'}}/>Recommended Actions</div>
                <div className="action-list">
                  {[
                    'Shutdown C-101 and perform bearing inspection',
                    'Cross-reference SOP-MNT-047 for replacement procedure',
                    'Consult IMIE for past bearing failures on this asset',
                    'Notify PESO-certified engineer before restart',
                  ].map((a,i)=>(
                    <div key={i} className="action-item" onClick={()=>showToast(a)}>
                      <i className="fa-solid fa-chevron-right"/>  {a}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-title"><i className="fa-solid fa-timeline" style={{color:'var(--sky)'}}/>Maintenance Timeline</div>
                <div className="timeline">
                  {[
                    {dot:'crit',date:'Jun 22 2026',title:'Bearing Vibration Alert',desc:'Vibration threshold exceeded. Auto-alert triggered.'},
                    {dot:'warn',date:'Apr 10 2026',title:'Scheduled Lubrication',desc:'Full lubrication service completed per SOP-MNT-047.'},
                    {dot:'info',date:'Jan 2024',title:'Bearing Replacement',desc:'Replaced SKF-6309. Downtime 6 hrs. Rajan Kumar supervised.'},
                    {dot:'ok',date:'Jan 2022',title:'Full Overhaul',desc:'Major overhaul completed. All components certified.'},
                  ].map((t,i)=>(
                    <div key={i} className="tl-item">
                      <div className={`tl-dot ${t.dot}`}><i className={`fa-solid fa-${t.dot==='ok'?'check':t.dot==='crit'?'xmark':'exclamation'}`}/></div>
                      <div className="tl-body"><div className="tl-date">{t.date}</div><div className="tl-title">{t.title}</div><div className="tl-desc">{t.desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ COMPLIANCE & QUALITY ══ */}
          {activeView==='compliance' && (
            <div className="view on compv">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-shield-halved"/>Compliance & Quality</div>
                <button className="sec-act" onClick={()=>downloadMockFile('AuditPackage.pdf')}>Export Audit Pack ↗</button>
              </div>
              <div className="comp-scores">
                {[
                  {lbl:'PESO',sub:'Petroleum Safety',score:96,clr:'#10b981'},
                  {lbl:'OISD-116',sub:'Fire Protection',score:88,clr:'#38bdf8'},
                  {lbl:'Factories Act',sub:'Labour Safety',score:94,clr:'#f59e0b'},
                  {lbl:'ISO 55001',sub:'Asset Mgmt',score:79,clr:'#8b5cf6'},
                  {lbl:'BIS 2825',sub:'Pressure Vessels',score:91,clr:'#f97316'},
                ].map(c=>{
                  const circ=2*Math.PI*28;
                  return (
                    <div key={c.lbl} className="cscore-card" onClick={()=>showToast(`${c.lbl}: ${c.score}% compliant`)}>
                      <div className="ring-wrap">
                        <svg className="ring-svg" viewBox="0 0 64 64" width="64" height="64">
                          <circle className="rtrack" cx="32" cy="32" r="28"/>
                          <circle className="rfill" cx="32" cy="32" r="28" stroke={c.clr} strokeDasharray={`${circ*c.score/100} ${circ*(1-c.score/100)}`}/>
                        </svg>
                        <div className="ring-lbl" style={{color:c.clr}}>{c.score}%</div>
                      </div>
                      <div className="ct">{c.lbl}</div><div className="cs">{c.sub}</div>
                    </div>
                  );
                })}
              </div>
              <div className="comp-two">
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-triangle-exclamation" style={{color:'var(--rose)'}}/>Compliance Gaps</div>
                  {[
                    {cls:'crit',icon:'fa-xmark',t:'OISD-116 §4.3 — Fire Suppression Test Overdue',d:'Last tested 14 months ago. Mandatory quarterly test missed.'},
                    {cls:'warn',icon:'fa-triangle-exclamation',t:'SOP-MNT-047 Review Overdue',d:'18-month review cycle. Expired 3 months ago.'},
                    {cls:'ok',icon:'fa-check',t:'PESO Hazardous Area Classification — Compliant',d:'All zones classified and documented.'},
                  ].map((g,i)=>(
                    <div key={i} className={`gap-it ${g.cls}`} onClick={()=>showToast(g.t)}>
                      <i className={`gi-icon fa-solid ${g.icon}`} style={{color:g.cls==='crit'?'var(--rose)':g.cls==='warn'?'var(--amber)':'var(--emerald)'}}/>
                      <div><div className="git">{g.t}</div><div className="gid">{g.d}</div></div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="auto-pack" style={{gridTemplateColumns:'1fr',textAlign:'center'}}>
                    <div>
                      <div className="ap-title">Auto Audit Package</div>
                      <div className="ap-desc">Generate regulatory-ready compliance evidence bundle from indexed documents, inspection records, and SOPs.</div>
                    </div>
                    <button className="ap-btn" onClick={()=>downloadMockFile('ComplianceEvidence.pdf')}><i className="fa-solid fa-file-export"/> Generate Now</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ LESSONS LEARNED ══ */}
          {activeView==='lessons' && (
            <div className="view on lview">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-lightbulb"/>Lessons Learned Engine</div>
                <button className="sec-act" onClick={()=>showToast('Alerts pushed to field teams!')}>Push Alerts ↗</button>
              </div>
              <div className="ai-scan-bar">
                <i className="asb-icon fa-solid fa-robot"/>
                <div><div className="asb-title">AI Pattern Scanner Active</div><div className="asb-desc">Continuously scanning cross-site failure patterns. 3 new patterns detected this week.</div></div>
              </div>
              <div className="impact-row">
                {[{v:'₹2.4 Cr',l:'Downtime Prevented'},{v:'34%',l:'MTBF Improvement'},{v:'127',l:'Lessons Captured'}].map(ic=>(
                  <div key={ic.l} className="impact-card"><div className="ic-val">{ic.v}</div><div className="ic-lbl">{ic.l}</div></div>
                ))}
              </div>
              <div className="lessons-grid">
                {[
                  {tag:'INCIDENT',tcls:'lt-inc',title:'Bearing Failure Pattern C-101',desc:'Vibration spike preceded by 14-day lubrication interval gap. Pattern confirmed across 3 sites.'},
                  {tag:'NEAR MISS',tcls:'lt-nm',title:'Gas Leak — Flange Torque Under-spec',desc:'Torque values 23% below spec due to outdated procedure. Updated SOP prevents recurrence.'},
                  {tag:'AUDIT',tcls:'lt-aud',title:'PESO Documentation Gap Closed',desc:'Hazardous area classification documents were missing. Auto-generated pack resolved in 4 hrs.'},
                  {tag:'PATTERN',tcls:'lt-pat',title:'Heat Exchanger Fouling Prediction',desc:'AI detected 6-week fouling cycle. Predictive cleaning reduced downtime by 40%.'},
                ].map((l,i)=>(
                  <div key={i} className="lesson" onClick={()=>showToast(l.title)}>
                    <span className={`ltag ${l.tcls}`}>{l.tag}</span>
                    <div className="ltitle">{l.title}</div>
                    <div className="ldesc">{l.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ IMIE — Industrial Memory Intelligence Engine ══ */}
          {activeView==='imie' && (
            <div className="view on imiev">
              <div className="sec-hdr">
                <div className="sec-title" style={{fontSize:'15px'}}>
                  <i className="fa-solid fa-brain" style={{color:'var(--violet)'}}/>
                  Industrial Memory Intelligence Engine (IMIE)
                  <span className="tag tviol" style={{marginLeft:'8px'}}>SIGNATURE MODULE</span>
                </div>
                <button className="sec-act" onClick={()=>downloadMockFile('IMIE_ExpertReport.pdf')}>Export Memory Map ↗</button>
              </div>

              {/* IMIE Hero */}
              <div style={{background:'linear-gradient(135deg,rgba(139,92,246,.1),rgba(245,158,11,.06))',border:'1px solid rgba(139,92,246,.3)',borderRadius:'16px',padding:'24px',marginBottom:'16px',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:'-40px',right:'-40px',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,.15),transparent 70%)'}}/>
                <div style={{fontSize:'18px',fontWeight:900,marginBottom:'6px',background:'linear-gradient(90deg,#8b5cf6,#f59e0b)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  Organizational Memory Layer
                </div>
                <div style={{fontSize:'12px',color:'var(--txt2)',maxWidth:'700px',lineHeight:1.7}}>
                  IMIE continuously captures, preserves, and transfers critical operational expertise from documents, reports, maintenance decisions, and incident histories. It reconstructs historical decision contexts, detects knowledge-loss risks, and proactively surfaces past lessons when similar situations arise.
                </div>
                <div style={{display:'flex',gap:'10px',marginTop:'14px',flexWrap:'wrap'}}>
                  {['✅ Preserves retiring experts\' knowledge','✅ Detects knowledge-loss risks','✅ Reconstructs historical decisions','✅ Prevents repetition of failures'].map(p=>(
                    <span key={p} style={{fontSize:'10.5px',background:'rgba(139,92,246,.12)',border:'1px solid rgba(139,92,246,.25)',borderRadius:'99px',padding:'4px 12px',color:'#a78bfa'}}>{p}</span>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'16px'}}>
                {[
                  {v:'12',l:'Expert Profiles',d:'2 at-risk',c:'var(--violet)'},
                  {v:'342',l:'Undocumented Procedures',d:'by retiring experts',c:'var(--rose)'},
                  {v:'1,847',l:'Historical Decisions Captured',d:'+142 this month',c:'var(--amber)'},
                  {v:'40%',l:'Avg Downtime Reduction',d:'from past lessons',c:'var(--emerald)'},
                ].map(k=>(
                  <div key={k.l} className="kpi v" style={{cursor:'default'}}>
                    <div className="kpi-val" style={{fontSize:'26px',color:k.c}}>{k.v}</div>
                    <div className="kpi-lbl">{k.l}</div>
                    <div className="kpi-delta" style={{color:k.c}}>{k.d}</div>
                  </div>
                ))}
              </div>

              {/* Ask IMIE */}
              <div className="card" style={{marginBottom:'16px'}}>
                <div className="card-title"><i className="fa-solid fa-magnifying-glass-chart" style={{color:'var(--violet)'}}/>Ask IMIE — &quot;Has this happened before?&quot;</div>
                <form onSubmit={handleImieQuery}>
                  <div className="cinput-row" style={{marginBottom:'10px'}}>
                    <input className="cinput" type="text" value={imieQuery} onChange={e=>setImieQuery(e.target.value)}
                      placeholder='e.g. "Has this bearing issue occurred before?" or "What did Rajan Kumar recommend for C-101?"'/>
                    <button type="submit" className="csend" style={{background:'var(--violet)'}}><i className="fa-solid fa-brain"/></button>
                  </div>
                </form>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                  {['Has this issue occurred before?','Who handled C-101 bearing in 2022?','What did Rajan Kumar document?','Repeat failures on this asset?'].map(s=>(
                    <span key={s} className="schip" onClick={()=>setImieQuery(s)}>{s}</span>
                  ))}
                </div>
                {imieResponse.visible && (
                  <div style={{marginTop:'14px',background:'rgba(139,92,246,.08)',border:'1px solid rgba(139,92,246,.25)',borderRadius:'10px',padding:'14px'}}>
                    <div style={{fontSize:'10px',fontWeight:800,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--violet)',marginBottom:'6px'}}>
                      <i className="fa-solid fa-brain"/> IMIE Response — Reconstructed Memory
                    </div>
                    <div style={{fontSize:'12.5px',lineHeight:1.7,color:'var(--txt1)'}}>{imieResponse.text}</div>
                  </div>
                )}
              </div>

              {/* Expert Risk & Memory Cards */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-user-clock" style={{color:'var(--rose)'}}/>Knowledge-Loss Risk Radar</div>
                  {[
                    {name:'Rajan Kumar',role:'Sr. Mechanical Engineer',ret:'30 days',risk:95,docs:342,c:'var(--rose)'},
                    {name:'Priya Nair',role:'Process Safety Lead',ret:'6 months',risk:68,docs:127,c:'var(--amber)'},
                    {name:'Arun Pillai',role:'Instrumentation Head',ret:'14 months',risk:40,docs:84,c:'var(--emerald)'},
                  ].map(e=>(
                    <div key={e.name} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderLeft:`3px solid ${e.c}`,borderRadius:'9px',padding:'12px',marginBottom:'8px',cursor:'pointer',transition:'.2s'}} onClick={()=>showToast(`Loading ${e.name}'s knowledge profile…`)}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                        <span style={{fontSize:'12px',fontWeight:700}}>{e.name}</span>
                        <span style={{fontSize:'10px',color:e.c,fontWeight:800}}>Risk: {e.risk}%</span>
                      </div>
                      <div style={{fontSize:'10px',color:'var(--txt2)',marginBottom:'6px'}}>{e.role} · Retiring in {e.ret}</div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:'9px',color:'var(--txt3)'}}>{e.docs} undocumented procedures</span>
                        <button className="ap-btn" style={{padding:'3px 10px',fontSize:'10px'}} onClick={(ev)=>{ev.stopPropagation();showToast(`Capturing ${e.name}'s knowledge…`)}}>Capture Now</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-clock-rotate-left" style={{color:'var(--amber)'}}/>Historical Memory — Recent Matches</div>
                  {[
                    {yr:'2024',asset:'C-101',event:'Bearing failure',action:'Replaced SKF-6309. Lubrication SOP updated.',saving:'6 hr downtime avoided'},
                    {yr:'2022',asset:'C-101',event:'Vibration spike',action:'Root cause: misalignment after maintenance. Re-aligned shaft.',saving:'₹8L downtime avoided'},
                    {yr:'2019',asset:'HX-204',event:'Heat exchanger fouling',action:'Chemical clean + SOP updated to 6-week cycle.',saving:'40% MTBF improvement'},
                  ].map((m,i)=>(
                    <div key={i} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'9px',padding:'11px 13px',marginBottom:'8px',cursor:'pointer',transition:'.2s'}} onClick={()=>showToast(`Loading ${m.yr} memory for ${m.asset}…`)}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'3px'}}>
                        <span style={{fontSize:'11px',fontWeight:700,color:'var(--amb2)'}}>{m.asset} · {m.event}</span>
                        <span style={{fontSize:'9px',color:'var(--txt3)',fontFamily:'var(--mono)'}}>{m.yr}</span>
                      </div>
                      <div style={{fontSize:'10.5px',color:'var(--txt2)',lineHeight:1.55,marginBottom:'5px'}}>{m.action}</div>
                      <span style={{fontSize:'9px',background:'rgba(16,185,129,.12)',color:'var(--emerald)',border:'1px solid rgba(16,185,129,.2)',borderRadius:'4px',padding:'1px 7px'}}>{m.saving}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ ARCHITECTURE ══ */}
          {activeView==='arch' && (
            <div className="view on archv">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-diagram-project"/>System Architecture</div>
              </div>
              <div className="arch-card">
                <div className="arch-layer">
                  <div className="arch-layer-lbl">Data Sources Layer — Heterogeneous Industrial Document Corpus</div>
                  <div className="arch-row">
                    {[['fa-file-pdf','P&IDs / DWG','Engineering drawings'],['fa-file-excel','Enterprise EAM','SAP / IBM Maximo'],['fa-file-lines','OEM Manuals','SOPs & procedures'],['fa-clipboard-list','Work Orders','Maintenance records'],['fa-flask','Lab Reports','Quality & inspection'],['fa-envelope','Email Archives','Regulatory submissions']].map(([ic,t,s])=>(
                      <div key={t} className="arch-node" onClick={()=>showToast(t)}><i className={`fa-solid ${ic}`}/><span className="arch-nn">{t}</span><span className="arch-ns">{s}</span></div>
                    ))}
                  </div>
                </div>
                <div className="arch-arrow"><i className="fa-solid fa-arrow-down"/></div>
                <div className="arch-layer">
                  <div className="arch-layer-lbl">Ingestion & Intelligence Layer — AI Document Processing Pipeline</div>
                  <div className="arch-row">
                    {[['fa-eye','OCR / CV Engine','P&ID digitisation'],['fa-tags','NER Pipeline','Entity extraction'],['fa-circle-nodes','Knowledge Graph','Neo4j · graph DB'],['fa-vector-square','Vector Store','Pinecone / pgvector'],['fa-gear','Ontology Engine','Industrial taxonomy']].map(([ic,t,s])=>(
                      <div key={t} className="arch-node" onClick={()=>showToast(t)}><i className={`fa-solid ${ic}`}/><span className="arch-nn">{t}</span><span className="arch-ns">{s}</span></div>
                    ))}
                  </div>
                </div>
                <div className="arch-arrow"><i className="fa-solid fa-arrow-down"/></div>
                <div className="arch-layer">
                  <div className="arch-layer-lbl">AI Reasoning Layer — Seven Agentic Modules</div>
                  <div className="arch-row">
                    {[['fa-message','RAG Copilot','GPT-4o / Gemini Pro','var(--amber)'],['fa-brain','Predictive RCA','ML failure models','var(--violet)'],['fa-shield-halved','Compliance Agent','Rule engine + LLM','var(--emerald)'],['fa-lightbulb','Lessons Engine','Pattern detection AI','var(--sky)'],['fa-magnifying-glass-chart','Quality Agent','QMS integration','var(--orange)'],['fa-brain','IMIE Memory','Organizational memory','#a78bfa']].map(([ic,t,s,c])=>(
                      <div key={t} className="arch-node" style={{borderColor:`${c}44`}} onClick={()=>showToast(t)}><i className={`fa-solid ${ic}`} style={{color:c}}/><span className="arch-nn">{t}</span><span className="arch-ns">{s}</span></div>
                    ))}
                  </div>
                </div>
                <div className="arch-arrow"><i className="fa-solid fa-arrow-down"/></div>
                <div className="arch-layer" style={{marginBottom:0}}>
                  <div className="arch-layer-lbl">Delivery Layer — Any Device, Any Function, Any Location</div>
                  <div className="arch-row">
                    {[['fa-desktop','Web Dashboard','Engineers & managers'],['fa-mobile-screen','Mobile PWA','Field technicians'],['fa-plug','REST API','SAP / CMMS / DCS'],['fa-bell','Push Alerts','WhatsApp / Teams'],['fa-tablet-screen-button','Tablet (Offline)','Field-first PWA']].map(([ic,t,s])=>(
                      <div key={t} className="arch-node" onClick={()=>showToast(t)}><i className={`fa-solid ${ic}`}/><span className="arch-nn">{t}</span><span className="arch-ns">{s}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Toast */}
      {toast.visible && (
        <div style={{position:'fixed',bottom:'20px',right:'20px',background:'var(--emerald)',color:'#fff',padding:'12px 24px',borderRadius:'8px',zIndex:9999,boxShadow:'0 4px 12px rgba(0,0,0,.3)',fontSize:'13px',fontWeight:600}}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
