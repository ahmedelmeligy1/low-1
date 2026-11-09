(function(){
  document.getElementById('yr').textContent=new Date().getFullYear();
  document.getElementById('form').addEventListener('submit',function(e){
    e.preventDefault();
    var v=document.getElementById('who').value.trim();if(!v)return;
    var text=encodeURIComponent('مرحبًا، أرغب في حجز استشارة قانونية. بياناتي: '+v);
    document.getElementById('msg').textContent='تم استلام طلبك، سنتواصل معك قريبًا.';
    window.open('https://wa.me/201000000000?text='+text,'_blank');
  });
})();

(function(){
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
function $(s,c){return [].slice.call((c||document).querySelectorAll(s))}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

/* loader */
addEventListener('load',function(){setTimeout(function(){document.getElementById('loader').classList.add('hide')},600)});

/* reveal on scroll (staggered) */
$('.rv').forEach(function(el){
  var sib=[].filter.call(el.parentElement.children,function(x){return x.classList.contains('rv')});
  el.style.setProperty('--d',(Math.min(sib.indexOf(el),8)*.08)+'s');
});
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){var el=e.target;el.classList.add('in');setTimeout(function(){el.classList.add('done')},1600);io.unobserve(el)}
  })},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  $('.rv').forEach(function(el){io.observe(el)});
}else{$('.rv').forEach(function(el){el.classList.add('in')})}

/* counters */
function count(el){
  var to=+el.dataset.to,suf=el.dataset.suf||'',t0=performance.now(),d=1800;
  (function f(t){var k=clamp((t-t0)/d,0,1),e=1-Math.pow(1-k,3);
    el.textContent=Math.round(to*e).toLocaleString('ar-EG')+suf;if(k<1)requestAnimationFrame(f)})(t0);
}
if(window.gsap&&window.ScrollTrigger){/* counters handled by GSAP */}else if('IntersectionObserver' in window){
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target)}})},{threshold:.6});
  $('.stat b').forEach(function(b){co.observe(b)});
}else{$('.stat b').forEach(count)}

/* scroll: progress bar, header, parallax, steps, active nav */
var hdr=document.querySelector('header'),pg=document.getElementById('pg'),heroImg=document.querySelector('.hero-img'),
    aboutImg=document.querySelector('.about-img'),steps=document.getElementById('steps'),
    navA=$('nav a'),secs=['about','why','services','book'].map(function(id){return document.getElementById(id)});
var tick=false;
function onScroll(){
  var y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
  pg.style.transform='scaleX('+(max>0?y/max:0)+')';
  hdr.classList.toggle('sc',y>30);
  if(!rm){
    heroImg.style.setProperty('--py',clamp(y*.14,0,110)+'px');
    var r=aboutImg.parentElement.getBoundingClientRect();
    aboutImg.style.setProperty('--py2',clamp((r.top-innerHeight/2)*-.08,-40,40)+'px');
  }
  var sr=steps.getBoundingClientRect(),p=clamp((innerHeight*.85-sr.top)/(innerHeight*.45),0,1);
  var on=0;
  $('.step',steps).forEach(function(s,i){var a=p>=i/3-.01;s.classList.toggle('on',a);if(a)on=i+1});
  steps.style.setProperty('--p',Math.max(on-1,0)/3);
  var cur=null;secs.forEach(function(s){if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=s.id});
  navA.forEach(function(a){a.classList.toggle('on',cur&&a.getAttribute('href')==='#'+cur)});
  tick=false;
}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

/* hero mouse 3D tilt */
var hero=document.querySelector('.hero'),tx=0,ty=0,cx=0,cy=0;
if(!rm&&matchMedia('(hover:hover)').matches){
  hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();
    tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5});
  hero.addEventListener('pointerleave',function(){tx=ty=0});
  (function loop(){cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;
    heroImg.style.setProperty('--ry',(cx*10)+'deg');heroImg.style.setProperty('--rx',(-cy*7)+'deg');requestAnimationFrame(loop)})();
}

/* card tilt + glare */
$('.tilt').forEach(function(el){
  el.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch'||rm)return;
    var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    el.style.setProperty('--ry',((px-.5)*16)+'deg');el.style.setProperty('--rx',((.5-py)*16)+'deg');
    el.style.setProperty('--mx',(px*100)+'%');el.style.setProperty('--my',(py*100)+'%');
  });
  el.addEventListener('pointerleave',function(){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
});

/* magnetic buttons */
if(!rm)$('.btn:not(.ghost)').forEach(function(b){
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();
    b.style.translate=((e.clientX-r.left-r.width/2)*.18)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
  b.addEventListener('pointerleave',function(){b.style.translate='0 0'});
});

/* floating gold dust */
var cv=document.getElementById('fx');
if(cv&&!rm){
  var g=cv.getContext('2d'),W,H,P=[];
  function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener('resize',rs);
  for(var i=0;i<(innerWidth<700?25:55);i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.4,v:Math.random()*.3+.08,a:Math.random()*.5+.2,p:Math.random()*6});
  (function dust(t){
    g.clearRect(0,0,W,H);t*=.001;
    P.forEach(function(q){
      q.y-=q.v;q.x+=Math.sin(t+q.p)*.25;if(q.y<-6){q.y=H+6;q.x=Math.random()*W}
      g.beginPath();g.arc(q.x,q.y,q.r,0,6.283);
      g.fillStyle='rgba(230,201,138,'+(q.a*(.6+.4*Math.sin(t*2+q.p)))+')';g.shadowColor='#c9a45c';g.shadowBlur=8;g.fill();
    });requestAnimationFrame(dust);
  })(0);
}

/* ===== 3D golden scales (three.js) ===== */
var box=document.getElementById('scale3d');
if(box&&window.THREE){
  var W3=box.clientWidth,H3=box.clientHeight;
  var R=new THREE.WebGLRenderer({antialias:true,alpha:true});
  R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(W3,H3);box.insertBefore(R.domElement,box.firstChild);
  var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(34,W3/H3,.1,100);C.position.set(0,.6,12.5);C.lookAt(0,.2,0);
  var gold=new THREE.MeshStandardMaterial({color:0xd4af6a,metalness:.75,roughness:.3,side:THREE.DoubleSide});
  var dark=new THREE.MeshStandardMaterial({color:0x8a6a33,metalness:.8,roughness:.35});
  S.add(new THREE.AmbientLight(0xffffff,.55));
  var L1=new THREE.DirectionalLight(0xfff0cf,1.3);L1.position.set(4,6,6);S.add(L1);
  var L2=new THREE.PointLight(0xc9a45c,1.6,30);L2.position.set(-5,2,4);S.add(L2);
  var L3=new THREE.PointLight(0x5aa0ff,.7,30);L3.position.set(5,-2,-4);S.add(L3);
  var grp=new THREE.Group();S.add(grp);
  function mesh(geo,m,x,y,z,p){var o=new THREE.Mesh(geo,m||gold);o.position.set(x,y,z||0);(p||grp).add(o);return o}
  mesh(new THREE.CylinderGeometry(1.7,2,.35,64),dark,0,-3.2);
  mesh(new THREE.CylinderGeometry(1.2,1.5,.3,64),gold,0,-2.9);
  mesh(new THREE.CylinderGeometry(.14,.24,5.4,32),gold,0,-.2);
  mesh(new THREE.TorusGeometry(.3,.07,16,40),gold,0,-1.6).rotation.x=Math.PI/2;
  mesh(new THREE.SphereGeometry(.34,32,32),gold,0,2.6);
  var beam=new THREE.Group();beam.position.set(0,2.35,0);grp.add(beam);
  mesh(new THREE.BoxGeometry(5.2,.16,.2),gold,0,0,0,beam);
  [-1,1].forEach(function(s){
    var end=new THREE.Group();end.position.set(s*2.6,0,0);beam.add(end);
    mesh(new THREE.SphereGeometry(.17,24,24),gold,0,0,0,end);
    var pts=[[-.9,-2.4],[.9,-2.4],[0,-2.4]];
    [[-.85,0],[.85,0],[0,.85],[0,-.85]].forEach(function(p){
      var geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0),new THREE.Vector3(p[0],-2.3,p[1])]);
      end.add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xe6c98a})));
    });
    mesh(new THREE.SphereGeometry(1,48,24,0,Math.PI*2,Math.PI/2,Math.PI/2),gold,0,-2.3,0,end).scale.set(.95,.5,.95);
    end.userData.s=s;
  });
  var spin=0,drag=false,lx=0,vel=0,mx=0,my=0,vis=true,tm=0;
  box.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX;box.setPointerCapture(e.pointerId)});
  box.addEventListener('pointerup',function(){drag=false});
  box.addEventListener('pointermove',function(e){
    var r=box.getBoundingClientRect();my=(e.clientY-r.top)/r.height-.5;
    if(drag){vel=(e.clientX-lx)*.012;spin+=vel;lx=e.clientX}
  });
  new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(box);
  addEventListener('resize',function(){var w=box.clientWidth,h=box.clientHeight;R.setSize(w,h);C.aspect=w/h;C.updateProjectionMatrix()});
  (function anim(){
    requestAnimationFrame(anim);if(!vis)return;
    tm+=.016;if(!drag){vel*=.95;spin+=vel+(rm?0:.006)}
    grp.rotation.y=spin+(window.__sx||0);grp.rotation.x+=(my*.35-grp.rotation.x)*.06;grp.position.y=Math.sin(tm*1.2)*.12;
    beam.rotation.z=Math.sin(tm*.9)*.07;
    beam.children.forEach(function(c){if(c.userData&&c.userData.s)c.rotation.z=-beam.rotation.z});
    R.render(S,C);
  })();
}
})();

(function(){
if(!window.gsap||!window.ScrollTrigger)return;
gsap.registerPlugin(ScrollTrigger);
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
var fmt=function(v,suf){return Math.round(v).toLocaleString('ar-EG')+suf};
var nums=gsap.utils.toArray('.stat b');

if(rm){nums.forEach(function(b){b.textContent=fmt(+b.dataset.to,b.dataset.suf||'')});return}

/* ---------- quick tiles: staggered rise ---------- */
gsap.set('.tiles .tile',{'--gy':'46px',opacity:0,'--gsc':.94});
gsap.to('.tiles .tile',{'--gy':'0px',opacity:1,'--gsc':1,duration:.9,ease:'power3.out',stagger:{each:.12,from:'start'},
  scrollTrigger:{trigger:'.tiles',start:'top 90%',once:true}});

/* ---------- trust section: choreographed entrance ---------- */
var head=['.stage .eyebrow','.stage h2','.stage p'];
gsap.set(head,{'--gy':'30px',opacity:0});
gsap.set('#scale3d',{opacity:0,'--gsc':.82});
gsap.set('.side-r .stat',{'--gx':'90px','--gy':'0px',opacity:0});
gsap.set('.side-l .stat',{'--gx':'-90px','--gy':'0px',opacity:0});

var tl=gsap.timeline({defaults:{ease:'power3.out'},scrollTrigger:{trigger:'#stats',start:'top 72%',once:true}});
tl.to(head,{'--gy':'0px',opacity:1,duration:.8,stagger:.12})
  .to('#scale3d',{opacity:1,'--gsc':1,duration:1.3,ease:'expo.out'},'-=.5')
  .to('.side-r .stat',{'--gx':'0px',opacity:1,duration:1,stagger:.18},'-=.9')
  .to('.side-l .stat',{'--gx':'0px',opacity:1,duration:1,stagger:.18},'<');

/* count-up synced to the cards landing */
nums.forEach(function(b,i){
  var o={v:0},to=+b.dataset.to,suf=b.dataset.suf||'';
  tl.to(o,{v:to,duration:2.2,ease:'power2.out',onUpdate:function(){b.textContent=fmt(o.v,suf)}},1.0+(i%2)*.18);
});

/* icons: gentle idle float, offset per card */
gsap.to('.stat .s-ico',{y:-5,duration:1.8,ease:'sine.inOut',yoyo:true,repeat:-1,stagger:{each:.35,from:'random'}});

/* scale rotates slowly as the section scrolls through the viewport */
var sp={v:0};
gsap.to(sp,{v:Math.PI*1.3,ease:'none',onUpdate:function(){window.__sx=sp.v},
  scrollTrigger:{trigger:'#stats',start:'top bottom',end:'bottom top',scrub:1}});

/* soft parallax: side cards drift at slightly different speeds */
gsap.to('.side-r',{y:-18,ease:'none',scrollTrigger:{trigger:'#stats',start:'top bottom',end:'bottom top',scrub:1.2}});
gsap.to('.side-l',{y:18,ease:'none',scrollTrigger:{trigger:'#stats',start:'top bottom',end:'bottom top',scrub:1.2}});

addEventListener('load',function(){ScrollTrigger.refresh()});
})();
