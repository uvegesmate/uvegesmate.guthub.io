const stage=document.getElementById("stage");
const ui=document.getElementById("ui");
const fullscreen=document.getElementById("fullscreen");
const fullscreenContent=document.getElementById("fullscreenContent");
const closeBtn=document.getElementById("closeBtn");

let topZ=1;

const groups=[
{name:"A",color:"#e13cfa",active:true},
{name:"B",color:"#b4fd00",active:true},
{name:"C",color:"#32fdc8",active:true},
{name:"D",color:"#f74600",active:true}
];

groups.forEach(group=>{
const btn=document.createElement("button");
btn.className="groupBtn";
btn.style.background=group.color;
ui.appendChild(btn);

btn.addEventListener("click",()=>{
group.active=!group.active;
btn.classList.toggle("off");
updateVisibility();
});
});

const projects=Array.from({length:12},(_,i)=>{

const group=groups[i%4];

return{
title:`Project ${i+1}`,
image:`https://picsum.photos/800/600?random=${i}`,
gallery:Array.from({length:8},(_,j)=>
`https://picsum.photos/800/600?random=${i}${j}`
),
details:`Long description for project ${i+1}`,
group:group.name,
color:group.color
};
});

const windows=[];
let activeDrag=null;
let offsetX=0;
let offsetY=0;

projects.forEach(project=>{

const el=document.createElement("div");
el.className="project";
el.style.borderColor=project.color;

el.innerHTML=`
<div class="media">
<img src="${project.image}">
</div>
<div class="meta" style="background:${project.color}">
${project.title}
</div>
`;

stage.appendChild(el);

const obj={
el,
x:Math.random()*innerWidth,
y:Math.random()*innerHeight,
vx:(Math.random()-0.5)*2,
vy:(Math.random()-0.5)*2,
dragging:false,
paused:false,
moved:false,
project
};

windows.push(obj);

function focus(){
topZ++;
el.style.zIndex=topZ;
}

el.addEventListener("pointerdown",(e)=>{
focus();
activeDrag=obj;
obj.dragging=true;
obj.paused=true;
obj.moved=false;
el.classList.add("active");

offsetX=e.clientX-obj.x;
offsetY=e.clientY-obj.y;
el.setPointerCapture(e.pointerId);
});

el.addEventListener("pointerup",()=>{
if(!obj.moved)openProject(project);
obj.dragging=false;
obj.paused=false;
el.classList.remove("active");
activeDrag=null;
});

el.addEventListener("mouseenter",()=>{
focus();
if(!obj.dragging){
obj.paused=true;
el.classList.add("active");
}
});

el.addEventListener("mouseleave",()=>{
if(!obj.dragging){
obj.paused=false;
el.classList.remove("active");
}
});
});

window.addEventListener("pointermove",(e)=>{
if(!activeDrag)return;

const dx=e.clientX-offsetX-activeDrag.x;
const dy=e.clientY-offsetY-activeDrag.y;

if(Math.abs(dx)>3||Math.abs(dy)>3)
activeDrag.moved=true;

activeDrag.x=e.clientX-offsetX;
activeDrag.y=e.clientY-offsetY;
activeDrag.vx=dx*0.2;
activeDrag.vy=dy*0.2;
});

function update(){
windows.forEach(w=>{

const rect=w.el.getBoundingClientRect();

if(!w.paused){
w.vx+=(Math.random()-0.5)*0.03;
w.vy+=(Math.random()-0.5)*0.03;

w.vx*=0.995;
w.vy*=0.995;

w.x+=w.vx;
w.y+=w.vy;

if(w.x<0){w.x=0;w.vx*=-1;}
if(w.y<0){w.y=0;w.vy*=-1;}
if(w.x+rect.width>innerWidth){
w.x=innerWidth-rect.width;
w.vx*=-1;
}
if(w.y+rect.height>innerHeight){
w.y=innerHeight-rect.height;
w.vy*=-1;
}
}

w.el.style.transform=
`translate(${w.x}px,${w.y}px)`;
});
requestAnimationFrame(update);
}
update();

function updateVisibility(){
windows.forEach(w=>{
const g=groups.find(x=>x.name===w.project.group);
w.el.style.display=g.active?"block":"none";
});
}

function openProject(project){

fullscreen.classList.remove("hidden");

let content=`
<div class="fullscreen-header">
<img src="${project.image}">
</div>
`;

project.gallery.forEach((img,i)=>{
content+=`
<div class="block">
<p>${project.details} section ${i+1}</p>
<img src="${img}">
</div>
`;
});

fullscreenContent.innerHTML=content;
}

closeBtn.addEventListener("click",()=>{
fullscreen.classList.add("hidden");
});
