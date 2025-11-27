const socket = io();
let myId = null;
let arena = { width: 1200, height: 700 };
const players = {};

const arenaEl = document.getElementById("arena");
const statusEl = document.getElementById("status");

// smoothing map for interpolation
const smoothPlayers = {};

socket.on("init", data => {
  myId = data.id;
  arena = data.arena;
  arenaEl.style.width = arena.width + "px";
  arenaEl.style.height = arena.height + "px";
});

socket.on("snapshot", data => {
  // update target positions
  Object.values(data.players).forEach(p => {
    if (!smoothPlayers[p.id]) smoothPlayers[p.id] = {...p};
    else {
      smoothPlayers[p.id].tx = p.x;
      smoothPlayers[p.id].ty = p.y;
      smoothPlayers[p.id].color = p.color;
      smoothPlayers[p.id].name = p.name;
      smoothPlayers[p.id].isIt = p.isIt;
    }
  });
});

function render() {
  const existing = [...arenaEl.children].filter(n => n.classList.contains("player"));
  for (const el of existing) if (!smoothPlayers[el.dataset.id]) el.remove();

  Object.values(smoothPlayers).forEach(p => {
    // interpolate towards target
    if (p.tx !== undefined) {
      p.x += (p.tx - p.x) * 0.2; // smoothing factor
      p.y += (p.ty - p.y) * 0.2;
    }

    let el = arenaEl.querySelector(`[data-id="${p.id}"]`);
    if (!el) {
      el = document.createElement("div");
      el.className = "player";
      el.dataset.id = p.id;
      arenaEl.appendChild(el);
    }

    el.style.left = p.x - 18 + "px";
    el.style.top = p.y - 18 + "px";
    el.style.background = p.color;
    el.textContent = p.name.slice(0, 2).toUpperCase();
    if (p.isIt) el.classList.add("it"); else el.classList.remove("it");
  });

  requestAnimationFrame(render);
}

render();

// input handling (same as before)
const input = { up: false, down: false, left: false, right: false };
function sendInput() { socket.emit("input", input); }

window.addEventListener("keydown", e => {
  if (e.key === "w" || e.key === "ArrowUp") input.up = true;
  if (e.key === "s" || e.key === "ArrowDown") input.down = true;
  if (e.key === "a" || e.key === "ArrowLeft") input.left = true;
  if (e.key === "d" || e.key === "ArrowRight") input.right = true;
  sendInput();
});

window.addEventListener("keyup", e => {
  if (e.key === "w" || e.key === "ArrowUp") input.up = false;
  if (e.key === "s" || e.key === "ArrowDown") input.down = false;
  if (e.key === "a" || e.key === "ArrowLeft") input.left = false;
  if (e.key === "d" || e.key === "ArrowRight") input.right = false;
  sendInput();
});
