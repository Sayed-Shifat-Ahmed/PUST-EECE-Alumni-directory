/* UI: tabs, cards, full-list table, sorting, CSV download */
let ALL=[], tab="Graduate", sort={key:"batch",dir:1}, selected=new Set();
const grid=$("#grid"), tableWrap=$("#tableWrap"), table=$("#table");
const FILTERS=["#q","#fStatus","#fBatch","#fBlood","#fDist"];

const COLS=[
  {k:"name",l:"Name"},{k:"email",l:"Email"},{k:"work",l:"Workplace"},
  {k:"status",l:"Type"},{k:"batch",l:"Batch",num:1},{k:"session",l:"Session",num:1},
  {k:"phone",l:"Contact"},{k:"desig",l:"Designation"},{k:"blood",l:"Blood"},{k:"district",l:"District"}
];
const statusLabel=p=>p.status==="Graduate"?"Graduate":"Student";

/* ----- filters ----- */
function fillSelect(sel,label,vals,num){
  const cur=sel.value;
  vals=[...new Set(vals.filter(Boolean))].sort(num?(a,b)=>a-b:undefined);
  sel.innerHTML=`<option value="">${label}</option>`+vals.map(v=>`<option value="${esc(v)}">${num?ord(v)+" batch":esc(v)}</option>`).join("");
  if(vals.includes(cur)) sel.value=cur;
}
function scope(){ return tab==="Directory"?ALL:ALL.filter(p=>p.status===tab) }
function buildFilters(){
  const L=scope();
  fillSelect($("#fBatch"),"All batches",L.map(p=>p.batch),true);
  fillSelect($("#fBlood"),"Any blood group",L.map(p=>p.blood));
  fillSelect($("#fDist"),"All districts",L.map(p=>p.district));
}
function filtered(){
  const q=$("#q").value.trim().toLowerCase(),st=$("#fStatus").value,
        b=$("#fBatch").value,bl=$("#fBlood").value,d=$("#fDist").value;
  return scope().filter(p=>(!st||tab!=="Directory"||p.status===st)&&(!b||p.batch===b)&&(!bl||p.blood===bl)&&(!d||p.district===d)
    &&(!q||[p.name,p.work,p.desig,p.district,p.email].join(" ").toLowerCase().includes(q)));
}

/* ----- sorting ----- */
const sortVal=(p,c)=>c.num?(+p.batch||0):(p[c.k]||"").toLowerCase();
function sorted(list){
  const c=COLS.find(x=>x.k===sort.key);
  return [...list].sort((a,b)=>{
    const x=sortVal(a,c),y=sortVal(b,c),ex=c.num?!x:!x, ey=c.num?!y:!y;
    if(ex!==ey) return ex?1:-1;                  // empty values always last
    const r=c.num?x-y:String(x).localeCompare(String(y),undefined,{numeric:true});
    return (r||a.name.localeCompare(b.name))*sort.dir;
  });
}

/* ----- cards (graduate / student tabs) ----- */
const dd=(k,v,cls="")=>v?`<div class="${cls}"><dt>${k}</dt><dd>${v}</dd></div>`:"";
function cardHTML(p,i){
  const g=p.status==="Graduate", row=(k,v)=>v?`<div class="row"><i>${k}</i><span>${esc(v)}</span></div>`:"";
  const mail=p.email?`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`:"";
  const fb=p.fb?`<a href="${esc(p.fb)}" target="_blank" rel="noopener">Open profile</a>`:"";
  return `<article class="pcard">

  <div class="pic">${avatar(p)}${p.blood?`<span class="blood">${esc(p.blood)}</span>`:""}${p.district?`<span class="dist">${esc(p.district)}</span>`:""}</div>
    <div class="info"><div class="top"><span class="batch">${ord(p.batch)||"–"} Batch</span><span>Session: ${esc(p.session)||"–"}</span></div>
    <div class="name">${esc(p.name)}${p.fb?`<a class="fb" href="${esc(p.fb)}" target="_blank" rel="noopener" aria-label="Facebook profile of ${esc(p.name)}">f</a>`:""}</div>
    ${row("Contact",p.phone)}${g?row("Designation",p.desig)+row("Workplace",p.work):row("Email",p.email)}
    <button class="more" aria-expanded="false" aria-controls="d${i}" data-i="${i}">Details »</button></div>
    <dl class="panel" id="d${i}" hidden>
      ${dd("Email",mail)}${dd("Previous workplace",esc(p.prevWork))}${dd("Blood group",esc(p.blood))}${dd("Religion",esc(p.religion))}${dd("District",esc(p.district))}
      ${dd("Facebook",fb)}${dd("Present address",esc(p.present),"full")}${dd("Permanent address",esc(p.perm),"full")}
    </dl></article>`;
}
function renderCards(list){
  list=list.sort((a,b)=>(+a.batch||0)-(+b.batch||0)||a.name.localeCompare(b.name));
  grid.innerHTML=list.length?list.map(p=>cardHTML(p,ALL.indexOf(p))).join("")
    :`<div class="empty">No members match. Clear the filters or try another search.</div>`;
}

/* ----- table (full list) ----- */
function renderTable(list){
  list=sorted(list);
  const rowsHTML=list.map(p=>{const i=ALL.indexOf(p);
    return `<tr class="${selected.has(i)?"sel":""}"><td class="chk"><input type="checkbox" data-i="${i}" ${selected.has(i)?"checked":""} aria-label="Select ${esc(p.name)}"></td>
    <td><div class="who">${avatar(p,"sm")}<div><b>${esc(p.name)}</b><small>${ord(p.batch)||"–"} Batch · ${esc(p.session)||"–"}</small></div></div></td>
    <td>${p.email?`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`:'<span class="mute">–</span>'}</td>
    <td>${esc(p.work)||"–"}</td>
    <td><span class="tag ${p.status==="Graduate"?"g":""}">${statusLabel(p)}</span></td>
    <td>${ord(p.batch)||"–"}</td><td>${esc(p.session)||"–"}</td>
    <td>${esc(p.phone)||"–"}</td><td>${esc(p.desig)||"–"}</td><td>${esc(p.blood)||"–"}</td><td>${esc(p.district)||"–"}</td></tr>`}).join("");
  const allSel=list.length&&list.every(p=>selected.has(ALL.indexOf(p)));
  table.innerHTML=`<thead><tr><th class="chk"><input type="checkbox" id="selAll" ${allSel?"checked":""} aria-label="Select all shown"></th>`+
    COLS.map(c=>`<th aria-sort="${sort.key===c.k?(sort.dir>0?"ascending":"descending"):"none"}"><button type="button" data-sort="${c.k}">${c.l}</button></th>`).join("")+
    `</tr></thead><tbody>${rowsHTML||`<tr><td colspan="${COLS.length+1}" class="mute" style="text-align:center;padding:30px">No members match.</td></tr>`}</tbody>`;
  table._rows=list;
}

/* ----- render ----- */
function render(){
  const dir=tab==="Directory", list=filtered();
  grid.hidden=dir; tableWrap.hidden=!dir; $("#fStatus").hidden=!dir; $("#download").hidden=!dir;
  document.querySelector(".filters").classList.toggle("dir",dir);
  const noun=dir?"member":tab==="Graduate"?"graduate":"current student";
  $("#meta").textContent=`${list.length} ${noun}${list.length===1?"":"s"} shown`+(dir&&selected.size?` · ${selected.size} selected`:"");
  if(dir){ renderTable(list); updateDownload(list) } else renderCards(list);
}
function updateDownload(list){
  const n=[...selected].filter(i=>list.includes(ALL[i])).length;
  $("#download").textContent=n?`Download selected (${n})`:`Download list (${list.length})`;
}

/* ----- download CSV ----- */
function downloadCSV(){
  const list=filtered(), chosen=list.filter(p=>selected.has(ALL.indexOf(p))), data=sorted(chosen.length?chosen:list);
  const cols=[["Name","name"],["Type","status"],["Batch","batch"],["Session","session"],["Email","email"],["Contact","phone"],
    ["Designation","desig"],["Workplace","work"],["Previous workplace","prevWork"],["Blood group","blood"],["Religion","religion"],["District","district"],
    ["Present address","present"],["Permanent address","perm"],["Facebook","fb"]];
  const cell=v=>`"${String(v??"").replace(/"/g,'""')}"`;
  const csv="\ufeff"+[cols.map(c=>cell(c[0])).join(","),...data.map(p=>cols.map(c=>cell(p[c[1]])).join(","))].join("\r\n");
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  a.download=`eece-alumni-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

/* ----- events ----- */
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
  tab=t.dataset.t;
  document.querySelectorAll(".tab").forEach(x=>x.setAttribute("aria-selected",x===t));
  FILTERS.forEach(s=>$(s).value="");selected.clear();
  buildFilters();render();
});
FILTERS.forEach(s=>$(s).addEventListener("input",render));
$("#reset").onclick=()=>{FILTERS.forEach(s=>$(s).value="");render()};
$("#download").onclick=downloadCSV;

grid.addEventListener("click",e=>{            // expand / collapse card details
  const b=e.target.closest(".more"); if(!b) return;
  const open=b.getAttribute("aria-expanded")==="true";
  b.setAttribute("aria-expanded",!open);
  b.textContent=open?"Details »":"Hide details «";
  document.getElementById(b.getAttribute("aria-controls")).hidden=open;
});
table.addEventListener("click",e=>{           // column sorting
  const s=e.target.closest("[data-sort]"); if(!s) return;
  sort=sort.key===s.dataset.sort?{key:sort.key,dir:-sort.dir}:{key:s.dataset.sort,dir:1};
  render();
});
table.addEventListener("change",e=>{          // row + select-all checkboxes
  if(e.target.id==="selAll") table._rows.forEach(p=>{const i=ALL.indexOf(p);e.target.checked?selected.add(i):selected.delete(i)});
  else if(e.target.dataset.i!==undefined){const i=+e.target.dataset.i;e.target.checked?selected.add(i):selected.delete(i)}
  else return;
  render();
});

/* ----- load: one sheet tab per group ----- */
function setData(people){
  ALL=people;
  $("#nGrad").textContent=ALL.filter(p=>p.status==="Graduate").length;
  $("#nStu").textContent=ALL.filter(p=>p.status!=="Graduate").length;
  buildFilters();render();
}
const SHEET=(String(SHEET_ID).match(/\/d\/([\w-]+)/)||[,String(SHEET_ID).trim()])[1];

async function getCSV(url){
  let res;
  try{ res=await fetch(url) }
  catch(e){ throw new Error("request blocked (sheet is not public, the ID is wrong, or there is no internet)") }
  if(!res.ok) throw new Error("HTTP "+res.status);
  const t=await res.text();
  if(/^\s*<(!doctype|html)/i.test(t)) throw new Error("Google sent a web page, not data (sheet is not shared publicly)");
  return t;
}
/* Fallback that needs no CORS: Google returns the tab as a <script>, which works even from a local file */
function tableToCSV(t){
  let head=t.cols.map(c=>c.label||""), rows=t.rows.map(r=>(r.c||[]).map(c=>c?(c.f??c.v??""):""));
  if(!head.some(Boolean)){ head=rows.shift()||[] }   // Google put the header row into the data
  const q=v=>`"${String(v).replace(/"/g,'""')}"`;
  return [head,...rows].map(r=>r.map(q).join(",")).join("\n");
}
function scriptTab(base,name){
  return new Promise((resolve,reject)=>{
    const cb="gviz_"+Math.random().toString(36).slice(2), s=document.createElement("script");
    const done=()=>{clearTimeout(timer);delete window[cb];s.remove()};
    const timer=setTimeout(()=>{done();reject(new Error("no answer from Google (sheet is not shared publicly, or the ID is wrong)"))},12000);
    window[cb]=r=>{done();
      if(r.status!=="ok") return reject(new Error((r.errors&&r.errors[0]&&(r.errors[0].detailed_message||r.errors[0].message))||"Google returned an error"));
      resolve(tableToCSV(r.table))};
    s.onerror=()=>{done();reject(new Error("script blocked or sheet not found"))};
    s.src=`${base}/gviz/tq?tqx=responseHandler:${cb};out:json&headers=1&sheet=${encodeURIComponent(name)}`;
    document.head.append(s);
  });
}
async function fetchTab(tab,status){
  const base=`https://docs.google.com/spreadsheets/d/${SHEET}`, tries=[];
  if(tab.pub) tries.push(()=>getCSV(tab.pub));
  tries.push(()=>getCSV(`${base}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab.name)}`));
  tries.push(()=>scriptTab(base,tab.name));
  if(tab.gid!=="") tries.push(()=>getCSV(`${base}/export?format=csv&gid=${encodeURIComponent(tab.gid)}`));
  const errs=[];
  for(const t of tries){
    try{ return toPeople(await t(),status) }catch(e){ errs.push(e.message); console.warn("Sheet load attempt failed:",e) }
  }
  throw new Error([...new Set(errs)].join("; "));
}
(async function(){
  const samples=()=>[...toPeople(SAMPLE_GRADUATE_CSV,"Graduate"),...toPeople(SAMPLE_CURRENT_CSV,"Current Student")];
  if(!SHEET){setData(samples());return}
  const jobs=[[TABS.graduate,"Graduate"],[TABS.current,"Current Student"]];
  const results=await Promise.allSettled(jobs.map(([t,s])=>fetchTab(t,s)));
  const bad=jobs.map((j,i)=>[j[0].name,results[i]]).filter(x=>x[1].status==="rejected");
  setData(bad.length===jobs.length?samples():results.flatMap(r=>r.status==="fulfilled"?r.value:[]));
  if(bad.length){
    const why=bad.map(([n,r])=>`<li><b>${esc(n)}:</b> ${esc(r.reason.message)}</li>`).join("");
    const hint=location.protocol==="file:"?"<p>You opened the page as a local file. Upload it to a host (GitHub Pages, Netlify) or run a local server, then try again.</p>":"";
    grid.insertAdjacentHTML("afterbegin",`<div class="err"><p>Couldn’t load ${bad.length===jobs.length?"the sheet, so sample data is shown":"part of the sheet"}.</p><ul style="text-align:left;display:inline-block;margin:8px 0">${why}</ul>${hint}<p>Fix: share the sheet as “Anyone with the link – Viewer”, or use File → Share → Publish to web (CSV) and paste the link into <code>TABS</code> in js/config.js.</p></div>`);
  }
})();
