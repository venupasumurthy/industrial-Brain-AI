const fs = require('fs');

function cssToObject(cssText) {
  const obj = {};
  cssText.split(';').forEach(rule => {
    if (!rule.trim()) return;
    const [key, value] = rule.split(':').map(s => s.trim());
    if (key && value) {
      const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      obj[camelKey] = value;
    }
  });
  return JSON.stringify(obj);
}

let html = fs.readFileSync('index.html', 'utf8');

// Extract CSS
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync('app/globals.css', styleMatch[1]);
}

// Extract body innerHTML
let bodyMatch = html.match(/<div class="shell">([\s\S]*?)<\/div><!-- \/shell -->/);
if (!bodyMatch) {
  console.log("Could not find shell");
  process.exit(1);
}
let body = '<div className="shell">' + bodyMatch[1] + '</div>';

// Basic conversions
body = body.replace(/class=/g, 'className=');
body = body.replace(/onclick="sw\('([^']+)'\)"/g, 'onClick={() => sw(\'$1\')}');
body = body.replace(/onclick="fq\('([^']+)'\)"/g, 'onClick={() => fq(\'$1\')}');
body = body.replace(/onclick="alert\('([^']+)'\)"/g, 'onClick={() => alert(\'$1\')}');
body = body.replace(/onclick="mtab\(this,'([^']+)'\)"/g, 'onClick={(e) => mtab(e.currentTarget, \'$1\')}');
body = body.replace(/onsubmit=/g, 'onSubmit=');
body = body.replace(/onfocus="([^"]+)"/g, ''); // strip for simplicity
body = body.replace(/onblur="([^"]+)"/g, ''); // strip
body = body.replace(/onmouseover="([^"]+)"/g, ''); // strip
body = body.replace(/onmouseout="([^"]+)"/g, ''); // strip
body = body.replace(/autocomplete="off"/g, 'autoComplete="off"');
body = body.replace(/stroke-dasharray/g, 'strokeDasharray');
body = body.replace(/stroke-dashoffset/g, 'strokeDashoffset');
body = body.replace(/stroke-linecap/g, 'strokeLinecap');
body = body.replace(/stroke-width/g, 'strokeWidth');
body = body.replace(/viewBox/g, 'viewBox');
body = body.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
body = body.replace(/<br>/g, '<br/>');
body = body.replace(/<input([^>]+?)>/g, (match, p1) => {
  if (p1.endsWith('/')) return match;
  return `<input${p1} />`;
});

// Inline style conversion
body = body.replace(/style="([^"]*)"/g, (match, p1) => {
  return `style={${cssToObject(p1)}}`;
});

const tsxContent = `
'use client';
import { useEffect, useState, useRef } from 'react';
import './globals.css';

export default function Home() {
  const canvasRef = useRef(null);

  // Stub functions to prevent compilation errors
  const sw = (name) => {
    const VIEWS=['dash','copilot','graph','compliance','rca','lessons','ingestion','arch','pid'];
    VIEWS.forEach(v=>{
      document.getElementById('view-'+v)?.classList.toggle('on',v===name);
      document.getElementById('tab-'+v)?.classList.toggle('on',v===name);
    });
    if(name==='graph') setTimeout(renderGraph, 50);
  };

  const fq = (t) => {
    const el = document.getElementById('uinput');
    if(el) {
      el.value = t;
      el.focus();
    }
  };

  const mtab = (btn, id) => {
    document.querySelectorAll('.mtab').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    ['tl-section','fleet-section','rca-tree'].forEach(s=>{
      const el=document.getElementById(s);
      if(el)el.style.display=s===id?'block':'none';
    });
  };

  const handleQ = (e) => {
    e.preventDefault();
    // Implementation omitted for brevity, will rely on API route in future
  };

  const renderGraph = () => {
    // simplified
  };

  useEffect(() => {
    // animate counters on load
  }, []);

  return (
    ${body}
  );
}
`;

fs.writeFileSync('app/page.tsx', tsxContent);
console.log("Conversion complete");
