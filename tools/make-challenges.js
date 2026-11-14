#!/usr/bin/env node
/*
  ABC Sempoa — publish daily / weekly challenge files.

  Uses the game's own generator (the <challenge-generator> block in index.html), so a published file
  holds exactly the questions the game would generate for that day / week. Files that already exist
  are left alone (so a hand-edited day is never overwritten) unless --force is given.

  Usage:
    node tools/make-challenges.js                      # tomorrow (Asia/Jakarta) + its week
    node tools/make-challenges.js --date 2026-11-20    # a given day + its week
    node tools/make-challenges.js --days 14            # tomorrow and the 13 days after it
    node tools/make-challenges.js --date today         # today instead of tomorrow
    node tools/make-challenges.js --force              # overwrite existing files

  Output:
    challenges/daily/YYYY-MM-DD.json
    challenges/weekly/YYYY-Www.json      (ISO week, starts on Monday)
*/
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..'), TZ='Asia/Jakarta';

// ---- load the generator from the game itself ----
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const m=html.match(/\/\/ <challenge-generator>[^\n]*\n([\s\S]*?)\/\/ <\/challenge-generator>/);
if(!m){console.error('Could not find the <challenge-generator> block in index.html');process.exit(1);}
const version=(html.match(/const VERSION='([^']+)'/)||[])[1]||'?';
const G=new Function(m[1]+'\nreturn {PLANS,makeSet,dayKey,weekKey,validSet,seedFor};')();

// ---- arguments ----
const args=process.argv.slice(2), opt=k=>{const i=args.indexOf(k);return i>=0?args[i+1]:undefined;};
const force=args.includes('--force'), days=Math.max(1,parseInt(opt('--days')||'1',10));
const todayTZ=()=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const toDate=s=>{const [y,mo,d]=s.split('-').map(Number);return new Date(y,mo-1,d);};
let startStr=opt('--date')||'tomorrow';
let start=startStr==='today'?toDate(todayTZ()):startStr==='tomorrow'?(d=>{d.setDate(d.getDate()+1);return d;})(toDate(todayTZ())):toDate(startStr);
if(isNaN(start)){console.error('Bad --date, use YYYY-MM-DD');process.exit(1);}

// ---- write ----
const strip=qs=>qs.map(q=>q.type==='calc'?{type:'calc',terms:q.terms,answer:q.answer}:{type:'build',answer:q.answer});
function write(mode,key){
  const dir=path.join(ROOT,'challenges',mode), file=path.join(dir,key+'.json');
  if(fs.existsSync(file)&&!force) return {file,status:'kept'};
  const qs=G.makeSet(mode,key);
  if(!G.validSet(qs)) throw new Error('generated an invalid set for '+mode+' '+key);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(file,JSON.stringify({mode,key,seed:G.seedFor(mode,key),generator:version,questions:strip(qs)},null,2)+'\n');
  return {file,status:'written'};
}
const out=[], weeks=new Set();
for(let i=0;i<days;i++){
  const d=new Date(start); d.setDate(d.getDate()+i);
  out.push(['daily',G.dayKey(d),write('daily',G.dayKey(d))]);
  const wk=G.weekKey(d); if(!weeks.has(wk)){weeks.add(wk);out.push(['weekly',wk,write('weekly',wk)]);}
}
for(const [mode,key,r] of out) console.log(`${r.status==='written'?'✓ wrote':'• kept '} ${mode.padEnd(6)} ${key}  ${path.relative(ROOT,r.file)}`);
