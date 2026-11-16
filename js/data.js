/* CSV parsing, session calculation and small helpers */
function parseCSV(t){
  const rows=[];let r=[],f="",q=false;
  for(let i=0;i<t.length;i++){const c=t[i];
    if(q){ if(c=='"'){ if(t[i+1]=='"'){f+='"';i++} else q=false } else f+=c }
    else if(c=='"') q=true;
    else if(c==','){r.push(f);f=""}
    else if(c=='\n'||c=='\r'){ if(c=='\r'&&t[i+1]=='\n')i++; r.push(f);f="";rows.push(r);r=[] }
    else f+=c }
  if(f!==""||r.length){r.push(f);rows.push(r)}
  return rows.filter(x=>x.some(v=>v.trim()));
}

/* "9" → "2016-17", "8" → "2015-16" */
function sessionOf(batch){
  const b=+batch; if(!b) return "";
  const s=SESSION_BASE+b;
  return `${s}-${String(s+1).slice(-2)}`;
}

const normHeader=s=>s.toLowerCase().replace(/^your\s+/,'').replace(/[:\s]+$/,'').trim();

/* forced = "Graduate" or "Current Student": decided by which sheet tab the rows came from */
function toPeople(csv,forced){
  const rows=parseCSV(csv); if(!rows.length) return [];
  const H=rows[0].map(h=>h.trim().toLowerCase());
  // Graduate tab header may lack "Previous Workplace" while the data has it: re-align the header
  const w=H.findIndex(h=>normHeader(h)==="workplace");
  if(w>=0&&!H.some(h=>normHeader(h)==="previous workplace"&&h)&&H.some(h=>/^column \d+$/.test(h))){
    H.splice(w+1,0,"previous workplace:");
  }
  // the form has one set of columns for graduates and one for students: take the first non-empty
  const pick=(row,key)=>{
    for(let i=0;i<H.length;i++){ if(normHeader(H[i])===key && (row[i]||"").trim()) return row[i].trim() }
    return "" };
  const seen=new Set(), out=[];
  for(const row of rows.slice(1)){
    const status=forced||(pick(row,"current status").toLowerCase().startsWith("current")?"Current Student":"Graduate");
    const p={status,batch:pick(row,"batch"),name:pick(row,"name"),fb:pick(row,"facebook profile link"),
      phone:pick(row,"contact no."),desig:pick(row,"designation"),work:pick(row,"workplace"),prevWork:pick(row,"previous workplace"),
      email:pick(row,"email"),blood:pick(row,"blood group"),religion:pick(row,"religion"),
      img:pick(row,"upload image"),present:pick(row,"present address"),perm:pick(row,"permanent address"),
      district:pick(row,"district")};
    if(!p.name) continue;
    p.session=sessionOf(p.batch);
    const k=[p.status,p.name,p.phone,p.email].join("|").toLowerCase();
    if(seen.has(k)) continue; seen.add(k); out.push(p);   // drop repeated rows
  }
  return out;
}

const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ord=n=>{n=+n;if(!n)return"";const v=n%100,s=["th","st","nd","rd"];return n+(s[(v-20)%10]||s[v]||s[0])};
const imgUrl=u=>{const m=u&&u.match(/[?&]id=([\w-]+)|\/d\/([\w-]+)/);return m?`https://drive.google.com/thumbnail?id=${m[1]||m[2]}&sz=w400`:""};
const initials=n=>n.split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
function avatar(p,cls=""){
  const u=imgUrl(p.img);
  return `<div class="avatar ${cls}">${u?`<img src="${esc(u)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`:""}<span>${esc(initials(p.name))}</span></div>`;
}
