const http = require('http'); const fs = require('fs'); const path = require('path');
const server = http.createServer((req,res)=>{ let f = path.join(__dirname,'public', req.url==='/'?'index.html':req.url);
fs.readFile(f,(e,d)=>{ if(e){res.writeHead(404);res.end('not found');} else{res.end(d);} }); });
const io = require('socket.io')(server,{cors:{origin:"*"}});
let players={}; io.on('connection',s=>{ players[s.id]={x:100,y:100,it:false};
s.on('move',d=>{ let p=players[s.id]; p.x+=d.x; p.y+=d.y; io.emit('state',players);});
s.on('disconnect',()=>{delete players[s.id]; io.emit('state',players);});
});
server.listen(3000);
