const fs = require('fs');

let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Update Imports and Top State
code = code.replace(`import { useEffect, useState, useRef } from 'react';`, 
`import { useEffect, useState, useRef } from 'react';`);

code = code.replace(`export default function Home() {`, `export default function Home() {
  const [toast, setToast] = useState({msg: '', visible: false});
  const [chatMsgs, setChatMsgs] = useState([{role: 'ai', content: '👋 I am your Industrial Knowledge Copilot — powered by RAG over 1,420 indexed documents.\\nAsk me anything — I will answer with source citations and confidence scores.', meta: 'IND-AI · Just now'}]);
  const [uinput, setUinput] = useState('');
  const [ingestProg, setIngestProg] = useState(0);
  const [scanModal, setScanModal] = useState(false);

  const showToast = (msg: any) => {
    setToast({msg, visible: true});
    setTimeout(() => setToast({msg: '', visible: false}), 3000);
  };`);

// 2. Replace fq
code = code.replace(/const fq = \(t: any\) => \{[\s\S]*?\};/, `const fq = (t: any) => {
    setUinput(t);
  };`);

// 3. Replace handleQ
code = code.replace(/const handleQ = \(e: any\) => \{[\s\S]*?\};/, `const handleQ = (e: any) => {
    e.preventDefault();
    if(!uinput.trim()) return;
    const q = uinput;
    setChatMsgs(p => [...p, {role: 'user', content: q, meta: 'User · Just now'}]);
    setUinput('');
    setTimeout(() => {
      setChatMsgs(p => [...p, {role: 'ai', content: 'Here is the requested information regarding: "' + q + '". According to the latest OISD guidelines and the OEM manual (Rev 3), the parameters are within normal operating limits.', meta: 'IND-AI · 98% Confidence'}]);
    }, 1000);
  };`);

// 4. Replace alerts with showToast
code = code.replace(/alert\('([^']+)'\)/g, `showToast('$1')`);

// 5. Replace Scan Asset button
code = code.replace(/<button className="tbtn" title="QR-code equipment lookup"><i className="fa-solid fa-qrcode"><\/i> Scan Asset<\/button>/, 
  `<button className="tbtn" title="QR-code equipment lookup" onClick={() => { setScanModal(true); setTimeout(() => { setScanModal(false); sw('rca'); }, 1500); }}><i className="fa-solid fa-qrcode"></i> Scan Asset</button>`);

// 6. Replace Chat Box UI
const chatBoxRegex = /<div className="msgs" id="chat-box">[\s\S]*?<\/div>\s*<\/div>\s*<div className="suggest-bar">/;
code = code.replace(chatBoxRegex, `<div className="msgs" id="chat-box">
          {chatMsgs.map((m, i) => (
            <div key={i} className={\`msg \${m.role === 'ai' ? 'a fu' : 'u'}\`}>
              <div className="mbubble">{m.content}</div>
              <div className="mmeta">{m.meta}</div>
            </div>
          ))}
        </div>
        <div className="suggest-bar">`);

// 7. Input binding
code = code.replace(/<input id="uinput" className="cinput" type="text" autoComplete="off"([\s\S]*?)\/>/, 
  `<input id="uinput" className="cinput" type="text" autoComplete="off" value={uinput} onChange={(e) => setUinput(e.target.value)}$1/>`);

// 8. Refresh button binding
code = code.replace(/<button className="sec-act">Refresh ↻<\/button>/, 
  `<button className="sec-act" onClick={() => { showToast('Graph layout refreshed.'); renderGraph(); }}>Refresh ↻</button>`);

// 9. Generate Maint Report binding
code = code.replace(/<button className="sec-act">Generate Maintenance Report ↗<\/button>/, 
  `<button className="sec-act" onClick={() => showToast('RCA Report Generated & Emailed.')}>Generate Maintenance Report ↗</button>`);

// 10. Voice query toast
code = code.replace(/<button type="button" className="csend"(.*?)title="Voice-enabled query">/, 
  `<button type="button" className="csend"$1title="Voice-enabled query" onClick={() => showToast('Listening... Speak now.')}>`);

// 11. Add Toasts and Modals before the end of shell
code = code.replace(/<\/div>\s*<\/main>\s*<\/div>\s*\);/g, `
        {toast.visible && <div style={{position:'fixed', bottom:'20px', right:'20px', background:'var(--emerald)', color:'#fff', padding:'12px 24px', borderRadius:'8px', zIndex:9999, boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}>{toast.msg}</div>}
        {scanModal && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{width:'300px', height:'300px', border:'4px dashed var(--amber)', position:'relative', borderRadius:'12px'}}>
            <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'var(--amber)', textAlign:'center', fontFamily:'var(--mono)'}}>
              <i className="fa-solid fa-qrcode" style={{fontSize:'48px', marginBottom:'10px'}}></i><br/>SCANNING ASSET...
            </div>
          </div>
        </div>}
      </div>
    </main>
  </div>
  );`);

fs.writeFileSync('app/page.tsx', code);
console.log('Update complete');
