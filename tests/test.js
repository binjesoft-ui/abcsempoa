const {T,runQueue,resetQueue}=require('./harness.js');
const ok=(c,m)=>{if(!c){console.log('FAIL:',m);process.exitCode=1;}else console.log('ok  ',m);};
const P=(id,x,y,touch=true)=>({id,x,y,wasTouch:touch});

{ const b=new T.Boot(); b.create(); ok(JSON.stringify(b.canvases)===JSON.stringify(['bead0','bead1','bead2','bead3','beadBrown'])&&b.started&&b.started[0]==='Home','Boot draws the 5 sharp bead textures and opens Home'); }
for(const orient of ['landscape','portrait']) for(const lang of ['id','en']){
  T.setLang(lang); T.setOrient(orient); console.log('\n=== '+orient+' · '+lang);
  // ---------- every scene builds ----------
  const home=new T.Home(); home.create({}); runQueue(home,1000); ok(true,'Home builds');
  for(let i=0;i<T.LESSONS.length;i++){ const s=new T.Learn(); s.create({i}); runQueue(s,500); }
  ok(true,'all 10 lessons build');
  const cert=new T.Cert(); cert.create({}); ok(true,'Cert builds');
  const fr=new T.Free(); fr.create({}); ok(true,'Free (manual) builds');
  const fi=new T.Free(); fi.create({mode:'input'}); ok(true,'Free (input) builds');
  const ch=new T.Challenge(); ch.create({}); ok(true,'Challenge builds');
  ch.create({_opts:true}); ok(true,'Challenge with options panel open builds');
  const rs=new T.Result(); rs.create({score:900,correct:8,best:4,time:125,results:ch.qs.map((Q,i)=>({Q,ok:i%3!==0,given:5,skipped:i===3,noPinch:i===6}))}); ok(true,'Result builds');
  home.create({_opts:true}); ok(true,'Options panel builds');
}
T.setLang('id'); T.setOrient('landscape');

// ---------- full sempoa: value, digits on the unit rod ----------
const s=new T.Learn(); s.create({i:0});
const ab=new T.Abacus(s,700,80,13,{unit:9,scale:1.1,viewW:760,labels:'none'});
ab.set(305,true); ok(ab.value()===305,'13-rod sempoa: set(305) reads back 305 (value='+ab.value()+')');
ok(ab.dig(9)===5&&ab.dig(8)===0&&ab.dig(7)===3,'digits sit on the unit rod (rod 9 = ones)');
ab.state[10]={h:1,e:0}; ok(ab.value()===305.5,'a bead right of the unit rod is a decimal (305.5)');
ab.set(0,true);

// ---------- drag on the full sempoa (with scroll offset) ----------
ab.setScroll((18+132*9+66)*1.1-ab.viewW/2); // ones rod in the middle of the window
const r=9, x=ab.c.x+ab.rodX[r]*ab.k;           // screen x of the ones rod
const yBead=ab.c.y+(ab.beads[r].e[0].y+20)*ab.k; // first bottom bead
ab.grab(P(1,x,yBead),r,'e',0); ab.move(P(1,x,yBead-80)); ab.up(P(1,x,yBead-80));
ok(ab.value()===1,'push one bottom bead up on the ones rod → 1 (value='+ab.value()+')');
// touch outside the visible window is ignored
ab.grab(P(2,ab.vx0-50,yBead),r,'e',1); ok(!ab.drags.has(2),'touch outside the visible window is ignored');
// pinch with two fingers at the same time → 6 with no technique error
ab.set(0,true); runQueue(s,1000);
const yH=ab.c.y+(ab.beads[r].h.y+20)*ab.k;
ab.grab(P(3,x,yH),r,'h',0); ab.grab(P(4,x,yBead),r,'e',0);
ab.move(P(3,x,yH+80)); ab.move(P(4,x,yBead-80)); ab.up(P(3,x,yH+80)); ab.up(P(4,x,yBead-80));
ok(ab.value()===6&&ab.techniqueErrors().length===0,'two-finger pinch makes 6 and counts as a pinch');
// one by one with a long pause → technique error
ab.set(0,true); runQueue(s,1000);
ab.grab(P(5,x,yH),r,'h',0); ab.move(P(5,x,yH+80)); ab.up(P(5,x,yH+80)); runQueue(s,1500);
ab.grab(P(6,x,yBead),r,'e',0); ab.move(P(6,x,yBead-80)); ab.up(P(6,x,yBead-80));
ok(ab.value()===6&&ab.techniqueErrors().length===1,'one-by-one 6 is flagged (errors='+JSON.stringify(ab.techniqueErrors())+')');

// ---------- slider ----------
ab.slideTo(ab.sl.sx0); ok(ab.scrollX===0,'slider far left → scroll 0');
ab.slideTo(ab.sl.sx0+ab.sl.sw); ok(Math.abs(ab.scrollX-ab.maxScroll)<0.01,'slider far right → max scroll');

// ---------- Ketik Angka on the full sempoa ----------
const caps=[]; let done=false;
ab.set(0,true); ab.sorobanTo(1205,t=>caps.push(t),()=>done=true); runQueue(s,60000);
ok(done&&ab.value()===1205,'Ketik Angka 1205 ends at 1205 (value='+ab.value()+')');
console.log('     captions:',caps.join(' | '));

// ---------- Contohkan / Help demo returns the beads ----------
ab.set(12,true); let d2=false; ab.demo(17,()=>{},()=>d2=true); runQueue(s,60000);
ok(d2&&ab.value()===12,'demo shows 12→17 then puts the beads back at 12');

// ---------- Challenge flow: running total ▶, submit, skip, results ----------
for(const orient of ['landscape','portrait']){ T.setOrient(orient); console.log('--- challenge flow · '+orient);
const ch=new T.Challenge(); ch.create({});
let calcIdx=ch.qs.findIndex(q=>q.type==='calc'); ch.qi=calcIdx; ch.loadQ();
const Q=ch.qs[calcIdx];
ch.ab.set(Q.totals[0],true); ch.onBeads(ch.ab.value()); ok(ch.cur===1,'▶ moves after the first number is shown');
ch.ab.set(Q.answer,true); ch.onBeads(ch.ab.value()); ok(ch.cur===2,'▶ moves to "=" after the total is shown');
ch.submit(); ok(ch.results.length===1&&ch.results[0].ok,'correct sum is accepted');
runQueue(ch,3000);
ch.qi++; ch.loadQ(); ch.skip(); ok(ch.results[1].skipped,'skip records a skipped question');
// help works on a fresh question
ch.qi++; ch.loadQ(); ch.help(); runQueue(ch,60000); ok(!ch.ab.demoing,'help demo finishes');
}
T.setOrient('landscape');
// generator: 5000 sets, answers in range, totals consistent
let bad=0; for(let n=0;n<5000;n++) T.PPLAN.map(T.makeQ).forEach(q=>{
  if(q.answer<0||q.answer>9999) bad++;
  if(q.type==='calc'&&q.terms.reduce((a,b)=>a+b,0)!==q.answer) bad++; });
ok(bad===0,'5000 challenge sets: all answers valid ('+bad+' bad)');

// ---------- play all 10 questions, answering every one (catches stale references) ----------
for(const orient of ['landscape','portrait']) for(const how of ['submit','skip']){
  T.setOrient(orient); const c=new T.Challenge(); c.create({}); let err=null;
  try{ for(let q=0;q<10;q++){ const Q=c.qs[c.qi]; c.ab.set(Q.answer,true);
       if(how==='submit') c.submit(); else c.skip(); runQueue(c,3000); if(q<9){c.qi++;c.loadQ();} } }
  catch(e){err=e.message+' (question '+(c.qi+1)+')';}
  ok(!err,'all 10 questions via '+how+' · '+orient+(err?' → '+err:''));
}
T.setOrient('landscape');
