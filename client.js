const s=io();const c=document.getElementById('c');const x=c.getContext('2d');
let players={};s.on('state',p=>players=p);
document.addEventListener('keydown',e=>{let d={x:0,y:0}; if(e.key==='w')d.y=-5; if(e.key==='s')d.y=5;
if(e.key==='a')d.x=-5; if(e.key==='d')d.x=5; s.emit('move',d);});
function draw(){x.clearRect(0,0,600,400); for(let id in players){let p=players[id];x.fillRect(p.x,p.y,20,20);} requestAnimationFrame(draw);}
draw();
