let players = [];
let runners = [];

document.getElementById("addBtn").addEventListener("click", addPlayer);
document.getElementById("startBtn").addEventListener("click", startGame);

function addPlayer() {
  const name = document.getElementById("nameInput").value.trim();
  if (name) {
    players.push({ name: name });
    document.getElementById("nameInput").value = "";
    renderPlayers();
  }
}

function renderPlayers() {
  const track = document.getElementById("track");
  track.innerHTML = "";

  players.forEach((player, index) => {
    const div = document.createElement("div");
    div.className = "runner";
    div.style.top = `${index * 70 + 20}px`;
    div.innerText = player.name[0];
    track.appendChild(div);
    runners[index] = div;
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  if (players.length < 2) {
    alert("최소 2명 이상 등록해주세요!");
    return;
  }

  document.getElementById("winner").innerText = "";
  renderPlayers();

  const shuffled = shuffle([...players]);

  shuffled.forEach((player, i) => {
    const runner = runners[players.findIndex(p => p.name === player.name)];
    const delay = 1000 + i * 1500 + Math.random() * 1000;
    const duration = delay;

    const startTime = performance.now();
    const startX = 0;
    const endX = 740;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const randomWiggle = (Math.random() * 3 - 1.5);
      const position = startX + (endX * progress) + randomWiggle;

      runner.style.left = `${Math.min(position, endX)}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (!document.getElementById("winner").innerText) {
          document.getElementById("winner").innerText = `🏆 승자는 ${player.name} 입니다!`;
          fireConfetti();
        }
      }
    }

    requestAnimationFrame(animate);
  });
}

function fireConfetti() {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
  });
}
