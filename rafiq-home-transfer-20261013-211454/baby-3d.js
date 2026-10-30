import * as THREE from './vendor/three.module.js';
import {scrollPose} from './baby-scroll-motion.js';

// Procedural motion study, not the production Rafiq character.
// Two-segment limbs solve toward floor targets; stance contacts stay fixed
// in world space while the body advances. Swing contacts lift and return.
const host=document.getElementById('scene');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
host.append(renderer.domElement);
const scene=new THREE.Scene();
scene.background=new THREE.Color('#f2e9df');
scene.fog=new THREE.Fog('#f2e9df',9,18);
const camera=new THREE.PerspectiveCamera(34,1,.1,50);
const light=new THREE.HemisphereLight('#fffaf0','#9a8070',2.5);scene.add(light);
const sun=new THREE.DirectionalLight('#fff6e4',3);sun.position.set(-3,6,4);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;
sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;sun.shadow.radius=4;scene.add(sun);
function material(color,roughness=.65){return new THREE.MeshStandardMaterial({color,roughness});}
const skin=material('#f1b793',.5),blue=material('#76b9e9',.8),hairMat=material('#84502d',.58),white=material('#fffaf4',.3),iris=material('#6b3e19',.22),black=material('#170e09',.16),pink=material('#e48f83');
const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),material('#d3b78f',.85));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
// Subtle board seams give visible reference points for planted hands and feet.
const lineMaterial=new THREE.LineBasicMaterial({color:'#a68b6a',transparent:true,opacity:.3});
for(let x=-10;x<=10;x+=.5){const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,.002,-10),new THREE.Vector3(x,.002,10)]);scene.add(new THREE.Line(geo,lineMaterial));}
const wall=new THREE.Mesh(new THREE.PlaneGeometry(40,12),material('#ecdfd8'));wall.position.set(0,6,-5);wall.receiveShadow=true;scene.add(wall);
const baby=new THREE.Group();scene.add(baby);
const sphere=new THREE.SphereGeometry(1,32,24);
function ball(parent,mat,scale,pos=[0,0,0]){const mesh=new THREE.Mesh(sphere,mat);mesh.scale.set(...scale);mesh.position.set(...pos);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
const torso=ball(baby,blue,[.32,.4,.26]);
const bottom=ball(baby,blue,[.33,.26,.29]);
const head=new THREE.Group();baby.add(head);
// Fuller cheeks, larger brown eyes and swept chestnut hair echo the reference.
const face=ball(head,skin,[.49,.50,.425]);
ball(head,skin,[.28,.21,.16],[-.22,-.16,.25]);
ball(head,skin,[.28,.21,.16],[.22,-.16,.25]);
for(const side of [-1,1]){
 ball(head,skin,[.10,.14,.075],[side*.47,-.025,0]);
 ball(head,pink,[.047,.075,.015],[side*.49,-.025,.065]);
 ball(head,white,[.155,.185,.075],[side*.19,.035,.368]);
 ball(head,iris,[.115,.142,.045],[side*.19,.03,.428]);
 ball(head,black,[.074,.101,.023],[side*.19,.03,.466]);
 ball(head,white,[.032,.037,.013],[side*.19-.033,.086,.488]);
 ball(head,white,[.012,.014,.008],[side*.19+.04,-.03,.488]);
 const browCurve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(side*.10,.265,.363),new THREE.Vector3(side*.19,.32,.37),new THREE.Vector3(side*.29,.26,.33));
 const brow=new THREE.Mesh(new THREE.TubeGeometry(browCurve,16,.013,6,false),hairMat);head.add(brow);
}
ball(head,skin,[.085,.067,.09],[0,-.08,.442]);
ball(head,material('#63291d'),[.14,.09,.035],[0,-.245,.394]);
ball(head,pink,[.083,.032,.014],[0,-.285,.426]);
ball(head,white,[.063,.018,.012],[0,-.195,.427]);
// Individually curved locks replace the original stack of round hair blobs.
for(let i=0;i<28;i++){
 const x=-.37+i*.025;
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,.29,-.14),new THREE.Vector3(x*.82,.45,.03),new THREE.Vector3(x*.5+.11,.53,.08),new THREE.Vector3(.16+i*.002,.61+Math.sin(i*.1)*.035,.025)]);
 const lock=new THREE.Mesh(new THREE.TubeGeometry(curve,20,.014+(i%4)*.002,6,false),hairMat);lock.castShadow=true;head.add(lock);
}
function limb(radius){const group=new THREE.Group();baby.add(group);const a=ball(group,skin,[radius,radius,radius]),b=ball(group,skin,[radius*.9,radius*.9,radius*.9]);const first=new THREE.Mesh(sphere,skin);const second=new THREE.Mesh(sphere,skin);first.userData.radius=radius;second.userData.radius=radius*.95;for(const mesh of [first,second]){mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}const end=ball(group,skin,[radius*1.3,radius*.65,radius*1.6]);return{a,b,first,second,end};}
const arms=[limb(.105),limb(.105)],legs=[limb(.14),limb(.14)];
const sleeves=[ball(baby,blue,[.15,.19,.16]),ball(baby,blue,[.15,.19,.16])];
for(const hand of arms){for(let i=0;i<4;i++)ball(hand.end,skin,[.23,.7,.43],[-.65+i*.43,-.06,.78]);ball(hand.end,skin,[.3,.65,.4],[.95,0,.25]);}
const up=new THREE.Vector3(0,1,0);
function segment(mesh,a,b){mesh.position.copy(a).add(b).multiplyScalar(.5);const delta=b.clone().sub(a);mesh.scale.set(mesh.userData.radius,delta.length()*.5+mesh.userData.radius*.3,mesh.userData.radius);mesh.quaternion.setFromUnitVectors(up,delta.normalize());}
function solve(limb,start,end,l1,l2,bend){
 const delta=end.clone().sub(start),d=Math.min(l1+l2-.001,Math.max(.001,delta.length()));const direction=delta.normalize();
 const along=(l1*l1-l2*l2+d*d)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-along*along));
 const perpendicular=bend.clone().addScaledVector(direction,-bend.dot(direction)).normalize();
 const joint=start.clone().addScaledVector(direction,along).addScaledVector(perpendicular,height);
 limb.a.position.copy(start);limb.b.position.copy(joint);limb.end.position.copy(end);segment(limb.first,start,joint);segment(limb.second,joint,end);
}
const v=(x,y,z)=>new THREE.Vector3(x,y,z);
const lerp=(a,b,t)=>a.clone().lerp(b,t);
const smooth=t=>t*t*(3-2*t);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let blend=0,paused=false,sideView=false,time=0,previous=0,raf=0,visible=true;
let motionY=Math.max(0,window.scrollY),observedScrollY=window.scrollY,scrollRange=1;
let mouse={x:0,y:0},gaze={x:0,y:0};
const speed=.28,period=1.35,stride=speed*period;
function target(phase,x,z){
 const p=((phase%1)+1)%1;
 // During stance the local target moves backwards at precisely body speed.
 if(p<.65)return v(x,.065,z+stride*(.325-p));
 const t=(p-.65)/.35;return v(x,.065+Math.sin(t*Math.PI)*.16,z+stride*(-.325+.65*smooth(t)));
}
function pose(dt){
 const scrollState=scrollPose(motionY,scrollRange,reduced.matches);
 blend=scrollState.blend;time=scrollState.time;
 const phase=time/period;
 const travel=time*speed;
 floor.position.z=travel;wall.position.z=travel-5;
 // The camera follows along the floor; floor seams reveal actual translation.
 baby.position.z=travel;
 bottom.position.set(0,THREE.MathUtils.lerp(.36,.48,blend),-.22*blend);
 torso.position.set(0,THREE.MathUtils.lerp(.83,.62,blend),.08*blend);
 torso.rotation.x=blend*Math.PI*.38;
 const bob=Math.sin(phase*Math.PI*4)*.012*blend;
 torso.position.y+=bob;
 head.position.set(0,THREE.MathUtils.lerp(1.48,1.03,blend)+bob,.02+.48*blend);
 gaze.x+=(mouse.x-gaze.x)*(1-Math.exp(-dt*18));gaze.y+=(mouse.y-gaze.y)*(1-Math.exp(-dt*18));
 head.rotation.set(-gaze.y*.12,gaze.x*.30,-gaze.x*.035);
 for(let i=0;i<2;i++){
  const side=i===0?-1:1,offset=i*.5;
  const armStart=lerp(v(side*.27,.97,.02),v(side*.26,.69,.29),blend);
  sleeves[i].position.copy(armStart);
  const hand=lerp(v(side*.35,.16,.28),target(phase+offset,side*.28,.51),blend);
  solve(arms[i],armStart,hand,.43,.43,v(side*.4,0,-1));
  const hip=lerp(v(side*.21,.38,-.04),v(side*.22,.48,-.31),blend);
  const crawlFoot=target(phase+offset+.5,side*.24,-.70);crawlFoot.y=.10+(crawlFoot.y-.065)*.65;
  const foot=lerp(v(side*.45,.10,.45),crawlFoot,blend);
  const bend=lerp(v(side*.8,.2,-1),v(side*.2,-1,1),blend);
  solve(legs[i],hip,foot,.33,.35,bend);
 }
 const desiredCamera=sideView?v(3,1.6,travel+2.6):v(2,1.9,travel+4.4);
 camera.position.copy(desiredCamera);camera.lookAt(0,.82,travel+.1);
 sun.position.z=travel+4;sun.target.position.set(0,0,travel);sun.target.updateMatrixWorld();
}
function frame(now){raf=0;if(!visible||document.hidden)return;const dt=Math.min(.05,(now-(previous||now-16))/1000);previous=now;
 pose(dt);renderer.render(scene,camera);
 // Only settle head gaze. Limbs and travel do not advance from wall time.
 if(!reduced.matches&&Math.abs(mouse.x-gaze.x)+Math.abs(mouse.y-gaze.y)>.001)raf=requestAnimationFrame(frame);
}
function wake(){if(!raf&&!document.hidden&&visible){previous=0;raf=requestAnimationFrame(frame);}}
function setPaused(value){paused=value;const button=document.getElementById('pause');button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'متابعة مع السكرول':'تثبيت الوضعية';document.getElementById('crawl').setAttribute('aria-pressed',String(!paused));observedScrollY=window.scrollY;wake();}
document.getElementById('sit').onclick=()=>{motionY=0;observedScrollY=0;window.scrollTo({top:0,behavior:'instant'});wake();};
document.getElementById('crawl').onclick=()=>setPaused(false);
document.getElementById('pause').onclick=()=>setPaused(!paused);
document.getElementById('view').onclick=event=>{sideView=!sideView;event.currentTarget.setAttribute('aria-pressed',String(sideView));camera.position.copy(sideView?v(3,1.6,time*speed+2.6):v(2,1.9,time*speed+4.4));camera.lookAt(0,.82,time*speed+.1);wake();};
host.addEventListener('pointermove',event=>{const rect=host.getBoundingClientRect();mouse.x=THREE.MathUtils.clamp((event.clientX-rect.left)/rect.width*2-1,-1,1);mouse.y=THREE.MathUtils.clamp((event.clientY-rect.top)/rect.height*2-1,-1,1);wake();},{passive:true});
host.addEventListener('pointerleave',()=>{mouse={x:0,y:0};wake();});
function resize(){const progress=motionY/scrollRange;scrollRange=Math.max(1,document.getElementById('scroll-stage').offsetHeight-host.clientHeight);motionY=progress*scrollRange;camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight,false);wake();}
window.addEventListener('scroll',()=>{const y=window.scrollY;if(!paused)motionY=Math.min(scrollRange,Math.max(0,motionY+y-observedScrollY));observedScrollY=y;wake();},{passive:true});
new ResizeObserver(resize).observe(host);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;}else wake();}).observe(host);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});
reduced.addEventListener('change',wake);
camera.position.set(2,1.9,4.4);scrollRange=Math.max(1,document.getElementById('scroll-stage').offsetHeight-host.clientHeight);pose(.016);resize();
document.getElementById('status').textContent=reduced.matches?'تقليل الحركة مفعّل؛ الحبو معطّل.':'مرّر للأسفل ليحبو؛ توقف عن التمرير ليثبت. التمرير للأعلى يرجّع نفس الحركة.';
renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();paused=true;cancelAnimationFrame(raf);document.getElementById('error').hidden=false;});
