'use client'
import { useEffect, useState, useRef } from 'react';
import './globals.css';

type ChatMsg = { role: string; content: string; meta: string };
type ToastState = { msg: string; visible: boolean };

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<ToastState>({ msg: '', visible: false });
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { role: 'ai', content: '👋 Welcome to IND-INTELLIGENCE. I can answer questions about assets, procedures, maintenance history, and compliance. Try asking about a specific equipment or incident.', meta: 'System · Just now' },
  ]);
  const [imieQuery, setImieQuery] = useState('');
  const [imieResponse, setImieResponse] = useState<{ visible: boolean; text: string }>({ visible: false, text: '' });
  const [uinput, setUinput] = useState('');
  const [activeView, setActiveView] = useState('executive');
  const [kgSelected, setKgSelected] = useState<string | null>(null);
  const [sysTime, setSysTime] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setSysTime(d.toISOString().split('T')[1].split('.')[0] + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const views = ['dash','ingestion','graph','copilot','maintenance','compliance','lessons','imie','executive','arch'];

  return (
    <div className="shell" data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div>
            <div className="logo-name">Industrial Brain AI</div>
            <div className="logo-sub">KNOWLEDGE PLATFORM</div>
          </div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section">Overview</div>
            <button className={`nb${activeView==='executive'?' on':''}`} onClick={()=>sw('executive')}>
              <i className="ni fa-solid fa-chart-pie"/> Executive View
              <span className="nbadge bp">C-SUITE</span>
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
          <div className="sb-section" style={{marginTop:'12px'}}>Intelligence</div>
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
            <div className="sfstat"><b>8</b> modules active · <b>3,241</b> docs indexed</div>
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
                activeView==='executive'?'Executive Intelligence Dashboard':
                'Architecture'
              }</strong>
            </span>
            <div className="plant-tag"><i className="fa-solid fa-location-dot"/>Reliance Jamnagar · Plant-A</div>
          </div>
          <div className="tb-r">
            <button className="tbtn" onClick={() => setIsDarkMode(!isDarkMode)}>
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}/>
            </button>
            <button className="tbtn" onClick={()=>showToast('Syncing knowledge graph…')}><i className="fa-solid fa-rotate"/>Sync KG</button>
            <button className="tbtn" onClick={()=>showToast('Report generated!')}><i className="fa-solid fa-file-export"/>Export</button>
            <button className="tbtn pri" onClick={()=>sw('ingestion')}><i className="fa-solid fa-plus"/>Ingest Doc</button>
          </div>
        </div>

        <div className="vc">

          {/* ══ DASHBOARD ══ */}
          {activeView==='dash' && (
              <div className="view on dash">
                {/* Executive KPI Row */}
                <div className="exec-kpi-row">
                  {[{val:'3,241',lbl:'Documents Ingested',delta:'+142 this week',up:true,icon:'fa-file-lines',accent:'var(--primary)'},
                    {val:'78.4%',lbl:'Knowledge Coverage',delta:'+5.2% this month',up:true,icon:'fa-brain',accent:'var(--violet)'},
                    {val:'72%',lbl:'Asset Health Score',delta:'-3% vs last month',up:false,icon:'fa-heart-pulse',accent:'var(--emerald)'},
                    {val:'94.2%',lbl:'Compliance Score',delta:'+1.4% vs last audit',up:true,icon:'fa-shield-halved',accent:'var(--sky)'},
                    {val:'HIGH',lbl:'Downtime Risk',delta:'Pump P101 critical',up:false,icon:'fa-triangle-exclamation',accent:'var(--rose)'},
                    {val:'4',lbl:'Open Critical Issues',delta:'2 require escalation',up:false,icon:'fa-circle-exclamation',accent:'var(--amber)'}
                  ].map(k=>(
                    <div key={k.lbl} className="exec-kpi" onClick={()=>showToast(`Drilling into ${k.lbl}…`)}>
                      <div className="exec-kpi-icon" style={{background:`color-mix(in srgb, ${k.accent} 12%, transparent)`,color:k.accent}}>
                        <i className={`fa-solid ${k.icon}`}></i>
                      </div>
                      <div className="exec-kpi-val" style={{color:k.accent}}>{k.val}</div>
                      <div className="exec-kpi-lbl">{k.lbl}</div>
                      <div className={`exec-kpi-delta ${k.up?'du':'dd'}`}>
                        <i className={`fa-solid fa-arrow-${k.up?'up':'down'}`}></i>{k.delta}
                      </div>
                      <div className="exec-spark"><svg viewBox="0 0 60 20" preserveAspectRatio="none"><polyline fill="none" stroke={k.accent} strokeWidth="1.5" strokeLinejoin="round" points={k.up?'0,18 10,14 20,16 30,10 40,8 50,6 60,2':'0,4 10,6 20,3 30,8 40,12 50,14 60,18'} /></svg></div>
                    </div>
                  ))}
                </div>
                {/* Trend Charts Row */}
                <div className="exec-charts-row">
                  <div className="card exec-chart-card">
                    <div className="card-title"><i className="fa-solid fa-chart-area" style={{color:'var(--primary)'}}></i> Knowledge Growth Trend (6 Months)</div>
                    <div className="exec-bar-chart">
                      {[{month:'Jan',val:1820,pct:56},{month:'Feb',val:2140,pct:66},{month:'Mar',val:2480,pct:76},{month:'Apr',val:2710,pct:83},{month:'May',val:2990,pct:92},{month:'Jun',val:3241,pct:100}].map(b=>(
                        <div key={b.month} className="exec-bar-col">
                          <div className="exec-bar-val">{b.val.toLocaleString()}</div>
                          <div className="exec-bar-track"><div className="exec-bar-fill" style={{height:`${b.pct}%`}}></div></div>
                          <div className="exec-bar-label">{b.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card exec-chart-card">
                    <div className="card-title"><i className="fa-solid fa-fire" style={{color:'var(--rose)'}}></i> Risk Heatmap — Asset × Category</div>
                    <div className="exec-heatmap">
                      <div className="hm-header"><div className="hm-corner"></div><div>Vibration</div><div>Temp</div><div>Pressure</div><div>Corrosion</div></div>
                      {[{asset:'Pump P101',vals:[95,88,45,30]},{asset:'Boiler B201',vals:[20,72,65,55]},{asset:'Comp C-101',vals:[15,10,12,8]},{asset:'HX-204',vals:[25,35,20,78]}].map(r=>(
                        <div key={r.asset} className="hm-row">
                          <div className="hm-label">{r.asset}</div>
                          {r.vals.map((v,i)=>(
                            <div key={i} className="hm-cell" style={{background: v>80?'rgba(225,29,72,.7)':v>60?'rgba(245,158,11,.6)':v>30?'rgba(245,158,11,.25)':'rgba(16,185,129,.2)',color: v>60?'#fff':'var(--txt1)'}} onClick={()=>showToast(`${r.asset} — Risk level ${v}%`)}>{v}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Bottom Section: Compliance Overview + Asset Intelligence + AI Recommendations */}
                <div className="bottom-section">
                  {/* Placeholder for additional sections */}
                </div>
              </div>
          )}

          {/* ══ DOCUMENT INGESTION ══ */}
          {activeView==='ingestion' && (
            <div className="view on ingv">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-file-arrow-up"/>Universal Document Ingestion Engine</div>
                <button className="sec-act" onClick={()=>showToast('Viewing ingestion logs…')}><i className="fa-solid fa-terminal" style={{marginRight:'6px'}}/> View Logs</button>
              </div>
              
              <div className="ingest-two">
                {/* Drag and Drop */}
                <div className="dz-area" onClick={()=>{
                  const i=document.createElement('input');i.type='file';i.multiple=true;
                  i.onchange=(e:any)=>{if(e.target.files?.length)showToast(`${e.target.files.length} file(s) queued for ingestion`)};i.click();
                }}>
                  <div className="dz-icon"><i className="fa-solid fa-cloud-arrow-up"/></div>
                  <div className="dz-title">Drop Documents Here or Click to Browse</div>
                  <div className="dz-sub">Supports PDF, DOCX, XLSX, CSV, Emails, Scanned Images, P&ID Drawings</div>
                  <div className="ftypes">
                    {['PDF','DOCX','XLSX','CSV','MSG','JPG','DWG'].map(t=><span key={t} className="ftype">{t}</span>)}
                  </div>
                </div>

                {/* Processing Queue */}
                <div className="card" style={{height:'100%',display:'flex',flexDirection:'column'}}>
                  <div className="card-title"><i className="fa-solid fa-list-check" style={{color:'var(--amber)'}}/>Processing Queue</div>
                  <div className="queue-list" style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'12px'}}>
                    {[
                      {icon:'fa-file-pdf',name:'PID-C101-Rev4.pdf',pct:100,clr:'var(--emerald)',st:'✔ Complete'},
                      {icon:'fa-file-word',name:'SOP-MNT-047.docx',pct:67,clr:'var(--amber)',st:'⟳ Running OCR...'},
                      {icon:'fa-image',name:'InspectionSheet-Jun24.jpg',pct:30,clr:'var(--sky)',st:'⟳ Extracting text...'},
                      {icon:'fa-file-excel',name:'MaintenanceLog-2024.xlsx',pct:0,clr:'var(--txt3)',st:'⏳ Queued'},
                    ].map(q=>(
                      <div key={q.name} className="q-item" style={{background:'var(--bg3)',border:'1px solid var(--border)',padding:'12px',borderRadius:'8px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
                          <i className={`fa-solid ${q.icon}`} style={{color:q.pct===100?'var(--emerald)':'var(--txt2)',fontSize:'16px'}}/>
                          <span style={{fontSize:'13px',fontWeight:600,color:'var(--txt1)'}}>{q.name}</span>
                          <span style={{marginLeft:'auto',fontSize:'11px',fontWeight:700,color:q.clr}}>{q.st}</span>
                        </div>
                        <div className="qi-prog"><div className="qi-bar"><div className="qi-fill" style={{width:`${q.pct}%`,background:q.clr}}/></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Document Library */}
              <div className="card">
                <div className="card-title"><i className="fa-solid fa-folder-open" style={{color:'var(--sky)'}}/>Document Library</div>
                <table className="doc-lib-table">
                  <thead><tr><th>Document Name</th><th>Classification</th><th>AI Summary</th></tr></thead>
                  <tbody>
                    {[
                      {n:'PID-C101-Rev4.pdf',c:'[P&ID]',clr:'tinfo',s:'Piping and instrumentation diagram for Compressor C-101. Updated with bypass valve V-402.'},
                      {n:'SOP-MNT-047.docx',c:'[SOP]',clr:'tok',s:'Standard operating procedure for bearing replacement in centrifugal compressors.'},
                      {n:'MaintenanceLog-2024.xlsx',c:'[Maintenance Log]',clr:'twarn',s:'Record of all routine and breakdown maintenance for Plant-A in 2024.'},
                    ].map(d=>(
                      <tr key={d.n} onClick={()=>showToast(`Viewing ${d.n}`)}>
                        <td style={{fontWeight:600}}><i className="fa-solid fa-file-lines" style={{marginRight:'8px',color:'var(--txt3)'}}/>{d.n}</td>
                        <td><span className={`tag ${d.clr}`}>{d.c}</span></td>
                        <td style={{color:'var(--txt2)',fontSize:'12px',lineHeight:1.4}}>{d.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Entity Extraction Panel */}
              <div className="card">
                <div className="card-title"><i className="fa-solid fa-tags" style={{color:'var(--emerald)'}}/>Extracted Intelligence</div>
                <div className="ent-panel">
                  {[
                    {t:'Equipment IDs',ic:'fa-industry',it:['C-101','P-402','HX-204']},
                    {t:'Process Parameters',ic:'fa-gauge-high',it:['Vibration > 8.2mm/s','Temp 140°C','Pressure 12bar']},
                    {t:'Personnel Names',ic:'fa-users',it:['Rajan Kumar','Anil Patel','Priya Nair']},
                    {t:'Dates',ic:'fa-calendar-day',it:['Oct 14, 2024','Jun 22, 2026']},
                    {t:'Failure Events',ic:'fa-triangle-exclamation',it:['Bearing seizure','Seal leak','Valve stuck']},
                    {t:'Compliance',ic:'fa-shield-halved',it:['PESO 14.2','ISO 9001','OISD-116']},
                    {t:'Maintenance',ic:'fa-wrench',it:['Replaced O-rings','Lubrication check']},
                  ].map(ec=>(
                    <div key={ec.t} className="ent-cat">
                      <div className="ent-cat-title"><i className={`fa-solid ${ec.ic}`}/> {ec.t}</div>
                      <div className="ent-list">
                        {ec.it.map(item=><span key={item} className="ent-item">{item}</span>)}
                      </div>
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
                <button className="sec-act" onClick={()=>showToast('Graph refreshed!')}><i className="fa-solid fa-rotate-right" style={{marginRight:'6px'}}/> Sync Graph</button>
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
                    <div className="gstat-delta"><i className="fa-solid fa-arrow-up"/>{g.d}</div>
                  </div>
                ))}
              </div>
              
              <div className="kg-toolbar">
                <div className="kg-filter-btn active"><div className="fdot" style={{background:'#f59e0b'}}/> Assets</div>
                <div className="kg-filter-btn active"><div className="fdot" style={{background:'#8b5cf6'}}/> Components</div>
                <div className="kg-filter-btn active"><div className="fdot" style={{background:'#38bdf8'}}/> Documents</div>
                <div className="kg-filter-btn"><div className="fdot" style={{background:'#f43f5e'}}/> Incidents</div>
                <div className="kg-filter-btn"><div className="fdot" style={{background:'#10b981'}}/> Compliance</div>
                <div className="kg-filter-btn"><div className="fdot" style={{background:'#f97316'}}/> Personnel</div>
                <div style={{marginLeft:'auto'}} className="cinput-wrap"><input type="text" className="cinput" placeholder="Search nodes..." style={{padding:'6px 12px', fontSize:'11px', width:'200px'}}/></div>
              </div>

              <div className={`kg-main ${kgSelected ? '' : 'collapsed'}`}>
                <div className="kg-graph-area" onClick={()=>setKgSelected(null)}>
                  <canvas ref={canvasRef} id="gcanvas"/>
                  <div className="kg-legend-bar">
                    <div className="kgl"><div className="kgl-dot" style={{background:'#f59e0b'}}/>Asset</div>
                    <div className="kgl"><div className="kgl-dot" style={{background:'#8b5cf6'}}/>Component</div>
                    <div className="kgl"><div className="kgl-dot" style={{background:'#38bdf8'}}/>Document</div>
                    <div className="kgl"><div className="kgl-dot" style={{background:'#f43f5e'}}/>Incident</div>
                  </div>
                  <div className="kg-zoom">
                    <button><i className="fa-solid fa-plus"/></button>
                    <button><i className="fa-solid fa-minus"/></button>
                    <button><i className="fa-solid fa-expand"/></button>
                  </div>
                </div>

                {kgSelected && (
                  <div className="kg-detail">
                    <div className="kg-detail-header">
                      <div className="kg-detail-icon" style={{background:'rgba(245,158,11,0.1)', color:'#f59e0b'}}>
                        <i className="fa-solid fa-fan"/>
                      </div>
                      <div>
                        <div className="kg-detail-name">{kgSelected}</div>
                        <div className="kg-detail-type">Asset / Equipment</div>
                      </div>
                      <button className="kg-close" onClick={()=>setKgSelected(null)}><i className="fa-solid fa-xmark"/></button>
                    </div>
                    <div className="kg-detail-tabs">
                      <button className="kg-dtab active"><i className="fa-solid fa-info-circle"/> Overview</button>
                      <button className="kg-dtab"><i className="fa-solid fa-link"/> Relations</button>
                      <button className="kg-dtab"><i className="fa-solid fa-file-pdf"/> Docs</button>
                    </div>
                    <div className="kg-detail-body">
                      <div className="kg-detail-list">
                        <div className="kg-dl-item" onClick={()=>showToast('Viewing SOP-MNT-047')}>
                          <div className="dli-title"><i className="fa-solid fa-file-pdf" style={{color:'#38bdf8', marginRight:'6px'}}/>SOP-MNT-047</div>
                          <div className="dli-meta">Linked To · Maintenance Procedure</div>
                        </div>
                        <div className="kg-dl-item" onClick={()=>sw('maintenance')}>
                          <div className="dli-title"><i className="fa-solid fa-triangle-exclamation" style={{color:'#f43f5e', marginRight:'6px'}}/>Failure Event 2024</div>
                          <div className="dli-meta">Failed Due To · Bearing Seizure</div>
                          <div className="dli-status" style={{background:'rgba(244,63,94,0.1)', color:'#f43f5e'}}>Resolved</div>
                        </div>
                        <div className="kg-dl-item" onClick={()=>showToast('Viewing Personnel Profile')}>
                          <div className="dli-title"><i className="fa-solid fa-user-helmet-safety" style={{color:'#f97316', marginRight:'6px'}}/>Rajan Kumar</div>
                          <div className="dli-meta">Maintained By · Senior Engineer</div>
                        </div>
                        <div className="kg-dl-item" onClick={()=>sw('compliance')}>
                          <div className="dli-title"><i className="fa-solid fa-shield-halved" style={{color:'#10b981', marginRight:'6px'}}/>PESO Cert §12</div>
                          <div className="dli-meta">Governed By · Safety Regulation</div>
                          <div className="dli-status" style={{background:'rgba(16,185,129,0.1)', color:'#10b981'}}>Valid</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="g-bottom" style={{marginTop:'20px'}}>
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
                      ].map(r=>(
                        <tr key={r.e} onClick={(e)=>{e.stopPropagation(); setKgSelected(r.e);}}>
                          <td>{r.e}</td><td><span className="tag tinfo">{r.t}</span></td><td>{r.c}</td><td>{r.u}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ EXPERT COPILOT ══ */}
          {activeView==='copilot' && (
            <div className="view on" style={{display:'flex',flexDirection:'column',height:'100%'}}>
              <div className="chat-pane" style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
                <div className="cp-hdr">
                  <span className="cp-hdr-t"><i className="fa-solid fa-message" style={{color:'var(--amber)',marginRight:'6px'}}/>Industrial Knowledge Copilot</span>
                  <span className="live-badge"><div className="live-dot"/>LIVE RAG</span>
                </div>
                <div className="suggest-bar">
                  <span className="slbl">Quick asks:</span>
                  {['Why did Pump P101 fail?','Show maintenance history of Boiler B201','Which SOP applies to compressor shutdown?'].map(s=>(
                    <span key={s} className="schip" onClick={()=>setUinput(s)}>{s}</span>
                  ))}
                </div>
                <div className="msgs">
                  {chatMsgs.map((m,i)=>(
                    <div key={i} className={`msg ${m.role==='ai'?'a fu':'u'}`}>
                      <div className="mbubble">{m.content}</div>
                      {m.role === 'ai' && i > 0 && (
                        <div className="cp-source">
                          <div className="cp-source-title"><i className="fa-solid fa-book-open"/> Source Citations</div>
                          <div className="cp-cite"><div className="cp-cite-num">1</div> SOP-MNT-047 v2.1 (Section 4.2)</div>
                          <div className="cp-cite"><div className="cp-cite-num">2</div> Incident Report INC-2024-08</div>
                          
                          <div className="cp-confidence">
                            <div className="cp-conf-label">CONFIDENCE 94%</div>
                            <div className="cp-conf-bar"><div className="cp-conf-fill" style={{width:'94%', background:'var(--emerald)'}}/></div>
                          </div>
                          
                          <div className="cp-kg-refs">
                            <div className="cp-kg-ref"><i className="fa-solid fa-circle-nodes"/> Pump P101</div>
                            <div className="cp-kg-ref"><i className="fa-solid fa-circle-nodes"/> Bearing Seizure</div>
                          </div>

                          <div className="cp-followups">
                            <div className="schip" onClick={()=>setUinput('Show me the bearing specs')}>Show bearing specs</div>
                            <div className="schip" onClick={()=>setUinput('Who authorized the last maintenance?')}>Who authorized this?</div>
                          </div>
                        </div>
                      )}
                      <div className="mmeta">{m.meta}</div>
                    </div>
                  ))}
                </div>
                <div className="cinput-wrap">
                  <form className="cinput-row" onSubmit={handleQ}>
                    <input type="text" className="cinput" placeholder="Ask about procedures, maintenance, or past incidents..." value={uinput} onChange={e=>setUinput(e.target.value)}/>
                    <button type="submit" className="csend"><i className="fa-solid fa-paper-plane"/></button>
                  </form>
                </div>
              </div>
              <div style={{background:'var(--bg2)',borderLeft:'1px solid var(--border)',padding:'20px',display:'flex',flexDirection:'column',gap:'20px',overflowY:'auto', width:'300px'}}>
                <div>
                  <div className="sec-title" style={{fontSize:'10px',marginBottom:'12px'}}><i className="fa-solid fa-brain"/> Active Context</div>
                  <div style={{fontSize:'12px',color:'var(--txt2)',lineHeight:1.6}}>
                    The Copilot is currently grounded in <strong>3,241 documents</strong> from the Plant-A corpus.
                  </div>
                </div>
                <div>
                  <div className="sec-title" style={{fontSize:'10px',marginBottom:'12px'}}><i className="fa-solid fa-file-pdf" style={{color:'var(--rose)'}}/> Referenced Docs</div>
                  <div className="action-list">
                    <div className="action-item"><i className="fa-solid fa-file-pdf"/> SOP-MNT-047 v2.1</div>
                    <div className="action-item"><i className="fa-solid fa-file-word"/> Incident-INC-2024.docx</div>
                    <div className="action-item"><i className="fa-solid fa-file-excel"/> Equipment_Specs.xlsx</div>
                  </div>
                </div>
                <div>
                  <div className="sec-title" style={{fontSize:'10px',marginBottom:'12px'}}><i className="fa-solid fa-clock-rotate-left" style={{color:'var(--sky)'}}/> Chat History</div>
                  <div className="action-list">
                    <div className="action-item" style={{background:'transparent',borderColor:'transparent',padding:'4px',fontSize:'11px',color:'var(--txt2)'}}>What is the shutdown procedure for C-101?</div>
                    <div className="action-item" style={{background:'transparent',borderColor:'transparent',padding:'4px',fontSize:'11px',color:'var(--txt2)'}}>Show me the P&ID for the cooling system.</div>
                    <div className="action-item" style={{background:'transparent',borderColor:'transparent',padding:'4px',fontSize:'11px',color:'var(--txt2)'}}>List all pending PESO compliance tasks.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ MAINTENANCE & RCA ══ */}
          {activeView==='maintenance' && (
            <div className="view on rcav">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-wrench"/>Maintenance Intelligence & RCA</div>
                <button className="sec-act" onClick={()=>downloadMockFile('MaintenanceReport.pdf')}><i className="fa-solid fa-file-export" style={{marginRight:'6px'}}/> Export Report</button>
              </div>
              <div className="rca-top">
                <div className="rca-alert">
                  <div className="ra-left">
                    <i className="ra-icon fa-solid fa-triangle-exclamation"/>
                    <div>
                      <div className="ra-eq">Pump P101 — CRITICAL</div>
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
              
              <div className="rca-top" style={{marginTop:'20px', gridTemplateColumns:'1fr 1fr'}}>
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-network-wired" style={{color:'var(--violet)'}}/>Root Cause Analysis Tree</div>
                  <div className="rca-tree">
                    <div className="rca-node root"><i className="fa-solid fa-triangle-exclamation"/> Pump P101 Failure Risk</div>
                    <div className="rca-branch">
                      <div className="rca-node cause"><i className="fa-solid fa-temperature-arrow-up"/> High Bearing Temp (94°C)</div>
                      <div className="rca-branch">
                        <div className="rca-node sub">Lubrication Starvation</div>
                        <div className="rca-branch">
                          <div className="rca-node sub">Clogged Oil Filter (Identified in Inspection)</div>
                        </div>
                      </div>
                    </div>
                    <div className="rca-branch">
                      <div className="rca-node cause"><i className="fa-solid fa-wave-square"/> Abnormal Vibration (8.2 mm/s)</div>
                      <div className="rca-branch">
                        <div className="rca-node sub">Shaft Misalignment</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-list-check" style={{color:'var(--amber)'}}/>Equipment Risk Ranking</div>
                  <table className="risk-table">
                    <thead><tr><th>Asset ID</th><th>Health</th><th>Est. Downtime</th><th>Action</th></tr></thead>
                    <tbody>
                      <tr onClick={()=>showToast('Inspecting Pump P101')}><td>Pump P101</td><td><span className="health-badge critical">31%</span></td><td>48 hrs</td><td><button className="tag tinfo">Inspect</button></td></tr>
                      <tr onClick={()=>showToast('Inspecting Boiler B201')}><td>Boiler B201</td><td><span className="health-badge warning">64%</span></td><td>12 days</td><td><button className="tag tinfo">Schedule</button></td></tr>
                      <tr onClick={()=>showToast('Inspecting Comp C-101')}><td>Comp C-101</td><td><span className="health-badge good">92%</span></td><td>--</td><td><button className="tag">Log</button></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card" style={{marginTop:'20px'}}>
                <div className="card-title"><i className="fa-solid fa-calendar-days" style={{color:'var(--sky)'}}/>Predictive Maintenance Schedule</div>
                <div className="schedule-grid">
                  <div className="sched-item">
                    <div className="sched-date"><div className="sd-month">Jun</div><div className="sd-day">24</div></div>
                    <div>
                      <div className="si-title">Pump P101 Overhaul</div>
                      <div className="si-desc">Replace bearings, align shaft, flush lubrication system.</div>
                      <div className="si-tag" style={{background:'rgba(225,29,72,0.1)', color:'#e11d48'}}>Critical Priority</div>
                    </div>
                  </div>
                  <div className="sched-item">
                    <div className="sched-date"><div className="sd-month">Jul</div><div className="sd-day">02</div></div>
                    <div>
                      <div className="si-title">Boiler B201 Inspection</div>
                      <div className="si-desc">Routine UT thickness check and burner calibration.</div>
                      <div className="si-tag" style={{background:'rgba(245,158,11,0.1)', color:'#f59e0b'}}>Medium Priority</div>
                    </div>
                  </div>
                  <div className="sched-item">
                    <div className="sched-date"><div className="sd-month">Aug</div><div className="sd-day">15</div></div>
                    <div>
                      <div className="si-title">Comp C-101 Service</div>
                      <div className="si-desc">Filter replacement and oil change per SOP.</div>
                      <div className="si-tag" style={{background:'rgba(5,150,105,0.1)', color:'#10b981'}}>Low Priority</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ COMPLIANCE & QUALITY ══ */}
          {activeView==='compliance' && (
            <div className="view on compv">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-shield-halved"/>Compliance Intelligence</div>
                <button className="sec-act" onClick={()=>downloadMockFile('AuditPackage.pdf')}>Export Audit Pack ↗</button>
              </div>
              <div className="comp-scores">
                {[
                  {lbl:'PESO',sub:'Petroleum Safety',score:96,clr:'#10b981'},
                  {lbl:'OISD-116',sub:'Fire Protection',score:88,clr:'#38bdf8'},
                  {lbl:'Factories Act',sub:'Labour Safety',score:94,clr:'#f59e0b'},
                  {lbl:'ISO 55001',sub:'Asset Mgmt',score:79,clr:'#8b5cf6'},
                  {lbl:'ISO 9001',sub:'Quality Mgmt',score:91,clr:'#f97316'},
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
              <div className="comp-two" style={{marginTop:'20px'}}>
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-triangle-exclamation" style={{color:'var(--rose)'}}/>Critical Compliance Gaps</div>
                  <div className="doc-alert-item" onClick={()=>showToast('Viewing Missing Document Alert')}>
                    <i className="fa-solid fa-file-circle-xmark"/>
                    <div><strong>Missing Documentation:</strong> Boiler B201 annual UT thickness report is missing from system. Required by Factories Act.</div>
                  </div>
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
                <div>
                  <div className="card" style={{marginBottom:'20px'}}>
                    <div className="card-title"><i className="fa-solid fa-calendar-check" style={{color:'var(--sky)'}}/>Upcoming Audits & Inspections</div>
                    <div className="audit-tl">
                      <div className="insp-reminder">
                        <div className="ir-icon" style={{background:'rgba(225,29,72,0.1)', color:'#e11d48'}}><i className="fa-solid fa-fire"/></div>
                        <div>
                          <div className="ir-title">OISD Surveillance Audit</div>
                          <div className="ir-meta">External Auditor · Full Site</div>
                        </div>
                        <div className="ir-days" style={{background:'rgba(225,29,72,0.1)', color:'#e11d48'}}>in 5 days</div>
                      </div>
                      <div className="insp-reminder">
                        <div className="ir-icon" style={{background:'rgba(245,158,11,0.1)', color:'#f59e0b'}}><i className="fa-solid fa-gas-pump"/></div>
                        <div>
                          <div className="ir-title">PESO License Renewal</div>
                          <div className="ir-meta">Documentation Review</div>
                        </div>
                        <div className="ir-days" style={{background:'rgba(245,158,11,0.1)', color:'#f59e0b'}}>in 14 days</div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="auto-pack" style={{gridTemplateColumns:'1fr',textAlign:'center'}}>
                      <div>
                        <div className="ap-title">Auto Audit Evidence Generator</div>
                        <div className="ap-desc">Generate regulatory-ready compliance evidence bundle from indexed documents, inspection records, and SOPs.</div>
                      </div>
                      <button className="ap-btn" onClick={()=>downloadMockFile('ComplianceEvidence.pdf')}><i className="fa-solid fa-file-export"/> Generate Package</button>
                    </div>
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
                <div className="sec-title" style={{fontSize:'18px'}}>
                  <i className="fa-solid fa-brain" style={{color:'var(--violet)'}}/>
                  Industrial Memory Intelligence Engine (IMIE)
                  <span className="tag tviol" style={{marginLeft:'10px'}}>SIGNATURE MODULE</span>
                </div>
                <button className="sec-act" onClick={()=>downloadMockFile('IMIE_ExpertReport.pdf')}>Export Memory Map ↗</button>
              </div>

              {/* IMIE Hero */}
              <div style={{background:'linear-gradient(135deg,rgba(139,92,246,.1),rgba(245,158,11,.06))',border:'1px solid rgba(139,92,246,.3)',borderRadius:'16px',padding:'24px',marginBottom:'16px',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:'-40px',right:'-40px',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,.15),transparent 70%)'}}/>
                <div style={{fontSize:'18px',fontWeight:900,marginBottom:'6px',background:'linear-gradient(90deg,#8b5cf6,#f59e0b)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  Organizational Memory Layer
                </div>
                <div style={{fontSize:'14px',color:'#ffffff',textShadow:'0 1px 2px rgba(0,0,0,0.8)',maxWidth:'700px',lineHeight:1.7}}>
                  IMIE continuously captures, preserves, and transfers critical operational expertise from documents, reports, maintenance decisions, and incident histories. It reconstructs historical decision contexts, detects knowledge-loss risks, and proactively surfaces past lessons when similar situations arise.
                </div>
                <div style={{display:'flex',gap:'10px',marginTop:'14px',flexWrap:'wrap'}}>
                  {['✅ Preserves retiring experts\' knowledge','✅ Detects knowledge-loss risks','✅ Reconstructs historical decisions','✅ Prevents repetition of failures'].map(p=>(
                    <span key={p} style={{fontSize:'12px',background:'rgba(139,92,246,.25)',border:'1px solid rgba(139,92,246,.4)',borderRadius:'99px',padding:'6px 14px',color:'#ffffff',fontWeight:600}}>{p}</span>
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
                    <div className="kpi-val" style={{fontSize:'32px',color:k.c}}>{k.v}</div>
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
                    <button type="submit" className="csend" style={{background:'var(--violet)',color:'#fff'}}><i className="fa-solid fa-brain"/></button>
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

          {/* ══ EXECUTIVE DASHBOARD ══ */}
          {activeView==='executive' && (
            <div className="view on execv">
              <div className="sec-hdr">
                <div className="sec-title"><i className="fa-solid fa-chart-pie"/>Executive Intelligence Dashboard</div>
                <div style={{display:'flex',gap:'8px'}}>
                  <button className="sec-act" onClick={()=>showToast('Generating board report…')}>Board Report ↗</button>
                  <button className="sec-act" onClick={()=>downloadMockFile('ExecutiveReport.pdf')}>Export PDF ↗</button>
                </div>
              </div>

              {/* Executive KPI Row */}
              <div className="exec-kpi-row">
                {[
                  {val:'3,241',lbl:'Documents Ingested',delta:'+142 this week',up:true,icon:'fa-file-lines',accent:'var(--primary)'},
                  {val:'78.4%',lbl:'Knowledge Coverage',delta:'+5.2% this month',up:true,icon:'fa-brain',accent:'var(--violet)'},
                  {val:'72%',lbl:'Asset Health Score',delta:'-3% vs last month',up:false,icon:'fa-heart-pulse',accent:'var(--emerald)'},
                  {val:'94.2%',lbl:'Compliance Score',delta:'+1.4% vs last audit',up:true,icon:'fa-shield-halved',accent:'var(--sky)'},
                  {val:'HIGH',lbl:'Downtime Risk',delta:'Pump P101 critical',up:false,icon:'fa-triangle-exclamation',accent:'var(--rose)'},
                  {val:'4',lbl:'Open Critical Issues',delta:'2 require escalation',up:false,icon:'fa-circle-exclamation',accent:'var(--amber)'},
                ].map(k=>(
                  <div key={k.lbl} className="exec-kpi" onClick={()=>showToast(`Drilling into ${k.lbl}…`)}>
                    <div className="exec-kpi-icon" style={{background:`color-mix(in srgb, ${k.accent} 12%, transparent)`,color:k.accent}}>
                      <i className={`fa-solid ${k.icon}`}/>
                    </div>
                    <div className="exec-kpi-val" style={{color:k.accent}}>{k.val}</div>
                    <div className="exec-kpi-lbl">{k.lbl}</div>
                    <div className={`exec-kpi-delta ${k.up?'du':'dd'}`}>
                      <i className={`fa-solid fa-arrow-${k.up?'up':'down'}`}/>{k.delta}
                    </div>
                    {/* Mini sparkline */}
                    <div className="exec-spark">
                      <svg viewBox="0 0 60 20" preserveAspectRatio="none">
                        <polyline fill="none" stroke={k.accent} strokeWidth="1.5" strokeLinejoin="round"
                          points={k.up?'0,18 10,14 20,16 30,10 40,8 50,6 60,2':'0,4 10,6 20,3 30,8 40,12 50,14 60,18'}/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trend Charts Row */}
              <div className="exec-charts-row">
                <div className="card exec-chart-card">
                  <div className="card-title"><i className="fa-solid fa-chart-area" style={{color:'var(--primary)'}}/> Knowledge Growth Trend (6 Months)</div>
                  <div className="exec-bar-chart">
                    {[
                      {month:'Jan',val:1820,pct:56},
                      {month:'Feb',val:2140,pct:66},
                      {month:'Mar',val:2480,pct:76},
                      {month:'Apr',val:2710,pct:83},
                      {month:'May',val:2990,pct:92},
                      {month:'Jun',val:3241,pct:100},
                    ].map(b=>(
                      <div key={b.month} className="exec-bar-col">
                        <div className="exec-bar-val">{b.val.toLocaleString()}</div>
                        <div className="exec-bar-track">
                          <div className="exec-bar-fill" style={{height:`${b.pct}%`}}/>
                        </div>
                        <div className="exec-bar-label">{b.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card exec-chart-card">
                  <div className="card-title"><i className="fa-solid fa-fire" style={{color:'var(--rose)'}}/> Risk Heatmap — Asset × Category</div>
                  <div className="exec-heatmap">
                    <div className="hm-header"><div className="hm-corner"/><div>Vibration</div><div>Temp</div><div>Pressure</div><div>Corrosion</div></div>
                    {[
                      {asset:'Pump P101',vals:[95,88,45,30]},
                      {asset:'Boiler B201',vals:[20,72,65,55]},
                      {asset:'Comp C-101',vals:[15,10,12,8]},
                      {asset:'HX-204',vals:[25,35,20,78]},
                    ].map(r=>(
                      <div key={r.asset} className="hm-row">
                        <div className="hm-label">{r.asset}</div>
                        {r.vals.map((v,i)=>(
                          <div key={i} className="hm-cell" style={{
                            background: v>80?'rgba(225,29,72,.7)':v>60?'rgba(245,158,11,.6)':v>30?'rgba(245,158,11,.25)':'rgba(16,185,129,.2)',
                            color: v>60?'#fff':'var(--txt1)'
                          }} onClick={()=>showToast(`${r.asset} — Risk level ${v}%`)}>{v}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Compliance Overview + Asset Intelligence + AI Recommendations */}
              <div className="exec-bottom-grid">
                {/* Compliance Overview */}
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-shield-halved" style={{color:'var(--emerald)'}}/> Compliance Overview</div>
                  <div className="exec-compliance-list">
                    {[
                      {reg:'PESO',score:96,status:'Compliant',clr:'var(--emerald)'},
                      {reg:'OISD-116',score:88,status:'Minor Gaps',clr:'var(--amber)'},
                      {reg:'Factories Act',score:94,status:'Compliant',clr:'var(--emerald)'},
                      {reg:'ISO 55001',score:79,status:'Action Needed',clr:'var(--rose)'},
                      {reg:'ISO 9001',score:91,status:'Compliant',clr:'var(--emerald)'},
                    ].map(c=>(
                      <div key={c.reg} className="exec-comp-item" onClick={()=>{sw('compliance');showToast(`Viewing ${c.reg} details…`)}}>
                        <div className="eci-name">{c.reg}</div>
                        <div className="eci-bar-track">
                          <div className="eci-bar-fill" style={{width:`${c.score}%`,background:c.clr}}/>
                        </div>
                        <div className="eci-score" style={{color:c.clr}}>{c.score}%</div>
                        <div className="eci-status" style={{background:`color-mix(in srgb, ${c.clr} 12%, transparent)`,color:c.clr}}>{c.status}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asset Intelligence Overview */}
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-industry" style={{color:'var(--amber)'}}/> Asset Intelligence Overview</div>
                  <table className="exec-asset-table">
                    <thead><tr><th>Asset</th><th>Health</th><th>Next Maintenance</th><th>Risk</th><th>Action</th></tr></thead>
                    <tbody>
                      {[
                        {asset:'Pump P101',health:31,next:'Jun 24',risk:'Critical',rclr:'var(--rose)'},
                        {asset:'Boiler B201',health:64,next:'Jul 02',risk:'Medium',rclr:'var(--amber)'},
                        {asset:'Comp C-101',health:92,next:'Aug 15',risk:'Low',rclr:'var(--emerald)'},
                        {asset:'HX-204',health:58,next:'Jul 10',risk:'Medium',rclr:'var(--amber)'},
                      ].map(a=>(
                        <tr key={a.asset} onClick={()=>{sw('maintenance');showToast(`Viewing ${a.asset}…`)}}>
                          <td style={{fontWeight:600}}>{a.asset}</td>
                          <td>
                            <div className="exec-health-wrap">
                              <div className="exec-health-bar"><div className="exec-health-fill" style={{width:`${a.health}%`,background:a.health>80?'var(--emerald)':a.health>50?'var(--amber)':'var(--rose)'}}/></div>
                              <span className="exec-health-num">{a.health}%</span>
                            </div>
                          </td>
                          <td><span style={{fontFamily:'var(--mono)',fontSize:'11px'}}>{a.next}</span></td>
                          <td><span className="exec-risk-badge" style={{background:`color-mix(in srgb, ${a.rclr} 12%, transparent)`,color:a.rclr}}>{a.risk}</span></td>
                          <td><button className="tag tinfo" onClick={(e)=>{e.stopPropagation();sw('maintenance')}}>Inspect</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent AI Recommendations */}
                <div className="card">
                  <div className="card-title"><i className="fa-solid fa-robot" style={{color:'var(--violet)'}}/> Recent AI Recommendations</div>
                  <div className="exec-ai-feed">
                    {[
                      {pri:'CRITICAL',pclr:'var(--rose)',title:'Immediate overhaul recommended for Pump P101',desc:'Bearing temperature 94°C and vibration 8.2 mm/s indicate imminent failure. Estimated 48hr window.',time:'14 min ago',action:'View RCA'},
                      {pri:'HIGH',pclr:'var(--amber)',title:'OISD-116 fire suppression test overdue',desc:'Mandatory quarterly test missed. Schedule within 5 days to avoid audit non-conformity.',time:'2 hr ago',action:'View Compliance'},
                      {pri:'MEDIUM',pclr:'var(--sky)',title:'Knowledge capture urgency: Rajan Kumar retiring',desc:'342 undocumented procedures at risk. IMIE recommends immediate knowledge transfer sessions.',time:'Today',action:'Open IMIE'},
                      {pri:'LOW',pclr:'var(--emerald)',title:'Heat exchanger cleaning cycle optimized',desc:'AI pattern analysis suggests 6-week cleaning cycle. Projected 40% MTBF improvement for HX-204.',time:'Yesterday',action:'View Lessons'},
                    ].map((r,i)=>(
                      <div key={i} className="exec-rec-item" onClick={()=>showToast(r.title)}>
                        <div className="eri-header">
                          <span className="eri-pri" style={{background:`color-mix(in srgb, ${r.pclr} 12%, transparent)`,color:r.pclr}}>{r.pri}</span>
                          <span className="eri-time">{r.time}</span>
                        </div>
                        <div className="eri-title">{r.title}</div>
                        <div className="eri-desc">{r.desc}</div>
                        <button className="eri-action" onClick={(e)=>{
                          e.stopPropagation();
                          if(r.action==='View RCA')sw('maintenance');
                          else if(r.action==='View Compliance')sw('compliance');
                          else if(r.action==='Open IMIE')sw('imie');
                          else sw('lessons');
                        }}><i className="fa-solid fa-arrow-right"/>{r.action}</button>
                      </div>
                    ))}
                  </div>
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
        {/* ── MISSION CONTROL HUD ── */}
        <div className="hud-bottom">
          <div className="hud-stat ok"><i className="fa-solid fa-satellite-dish"/> UPLINK: SECURE</div>
          <div className="hud-stat ok"><i className="fa-solid fa-server"/> CORE: NOMINAL</div>
          <div className="hud-stat"><i className="fa-solid fa-shield-halved"/> ENCRYPTION: AES-256</div>
          <div style={{flex:1}}/>
          <div className="hud-stat"><i className="fa-solid fa-clock"/> SYS.TIME: {sysTime || 'ACTIVE'}</div>
        </div>
      </main>

      {/* Toast */}
      {toast.visible && (
        <div style={{position:'fixed',bottom:'40px',right:'20px',background:'var(--bg2)',color:'var(--primary)',border:'1px solid var(--primary)',padding:'12px 24px',borderRadius:'4px',zIndex:9999,boxShadow:'var(--glow)',fontSize:'11px',fontWeight:700,letterSpacing:'0.04em',textTransform:'uppercase',fontFamily:'var(--mono)'}}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
