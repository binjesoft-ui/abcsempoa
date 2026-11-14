// Minimal Phaser stand-in: runs scene code headlessly to catch runtime errors and check logic.
const fs=require('fs');
const html=fs.readFileSync(process.argv[2]||require('path').join(__dirname,'..','index.html'),'utf8');
let body=html.split('<script>\nfunction SEMPOA(){')[1].split('\n// wait for the engine')[0];
body=body.replace('fontsReady.then(()=>startGame());','globalThis.__T={setOrient:o=>{ORIENT=o;PORTRAIT=o==="portrait";GW=PORTRAIT?720:1280;GH=PORTRAIT?1280:720;},Boot,Home,Learn,Cert,Challenge,Result,Free,Abacus,makeQ,PPLAN,LESSONS,I18N,setLang:l=>{LANG=l}};');
body=body.replace(/\}\s*$/,''); // drop closing brace of SEMPOA

let queue=[];
function obj(extra={}){
  const o=Object.assign({x:0,y:0,width:100,height:30,alpha:1,visible:true,scale:1,input:{enabled:true},handlers:{},list:[]},extra);
  return new Proxy(o,{get(t,p){
    if(p in t) return t[p];
    if(p==='on') return (ev,fn)=>{(t.handlers[ev]=t.handlers[ev]||[]).push(fn);return prox(t)};
    if(p==='then') return undefined;
    return (...a)=>{ if(t.destroyed&&p!=='destroy') throw new Error('used a destroyed object: .'+String(p)+'()');
      if(p==='destroy'){t.destroyed=true;t.list.forEach(ch=>{try{ch.destroy()}catch(e){}});return;}
      if(p==='setY')t.y=a[0]; if(p==='setX')t.x=a[0]; if(p==='setPosition'){t.x=a[0];t.y=a[1];}
      if(p==='setAlpha')t.alpha=a[0]; if(p==='setVisible')t.visible=a[0]; if(p==='setText')t.text=a[0];
      if(p==='add'&&Array.isArray(a[0]))t.list.push(...a[0]); else if(p==='add')t.list.push(a[0]);
      if(p==='getValue') return 0;
      if(p==='createGeometryMask') return obj();
      return prox(t);} },
    set(t,p,v){t[p]=v;return true;}});
}
const proxMap=new WeakMap(); function prox(t){return t.__self||t;}
function mkObj(extra){const p=obj(extra);p.__self=p;return p;}
class Scene{
  constructor(key){this.key=key;this._time=0;
    const S=this;
    const factory=()=>new Proxy({},{get:(_,p)=>(...a)=>{
      if(p==='text'){const o=mkObj({x:a[0],y:a[1],text:a[2]});const lines=String(a[2]).split('\n').length;o.height=lines*30;return o;}
      if(p==='container'){return mkObj({x:a[0],y:a[1]});}
      return mkObj({x:a[0],y:a[1]});}});
    this.add=factory(); this.make=factory();
    this.tweens={add:(c)=>{ if(c&&c.targets&&!Array.isArray(c.targets)){ for(const k of ['x','y','alpha']) if(typeof c[k]==='number') c.targets[k]=c[k]; }
                   if(c&&c.onComplete) queue.push({at:S._time+(c.duration||0)+(c.delay||0),fn:c.onComplete}); return mkObj();},
                 addCounter:(c)=>{ if(c.onUpdate) c.onUpdate({getValue:()=>c.to}); return mkObj();},
                 killTweensOf:()=>{}};
    this.time={get now(){return S._time;},delayedCall:(ms,fn)=>{const ev={at:S._time+ms,fn,dead:false,remove(){this.dead=true;}};queue.push(ev);return ev;}};
    this.input={_h:{},on(ev,fn){(this._h[ev]=this._h[ev]||[]).push(fn)},off(ev,fn){this._h[ev]=(this._h[ev]||[]).filter(f=>f!==fn)}};
    this.events={once(){},on(){}};
    this.cameras={main:{setBackgroundColor(){return this},setZoom(){return this},centerOn(){return this},shake(){}}};
    this.textures={exists:()=>true,addImage(){},createCanvas:(k)=>{(S.canvases=S.canvases||[]).push(k);return mkObj({getContext:()=>mkObj()});}};
    this.sys={isActive:()=>true};
    this.scene={start:(k,d)=>{this.started=[k,d];},restart:(d)=>{this.restarted=d;}};
  }
}
function runQueue(scene,ms=60000){ // advance fake time, running timers in order
  const end=scene._time+ms; let n=0;
  while(n++<100000){ queue.sort((a,b)=>a.at-b.at); const ev=queue.find(e=>!e.dead&&e.at<=end); if(!ev) break;
    queue.splice(queue.indexOf(ev),1); scene._time=Math.max(scene._time,ev.at); ev.fn(); }
  scene._time=end; queue=queue.filter(e=>!e.dead);
}
global.Phaser={Scene,Display:{Color:{ValueToColor:()=>({darken:()=>({color:0})})}},AUTO:0,Scale:{FIT:0,CENTER_BOTH:0}};
global.window=global; global.document={fonts:null,getElementById:()=>null};
global.Image=class{set src(v){this.onload&&this.onload();}};
global.localStorage={getItem:()=>null,setItem:()=>{}};
new Function(body)();
module.exports={T:global.__T,runQueue,resetQueue:()=>{queue=[]}};
