let players = [];
let runners = [];
let finishOrder = [];
let obstacles = [];

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
    div.style.top = `${index * 80 + 20}px`;

    // 이미지 우선, 없으면 기본 원형 표시
    const img = document.createElement("img");
    const imgNum = index % 2 === 0 ? 1 : 2;
    img.src = `assets/runner${imgNum}.png`;

    img.onerror = () => {
      // 이미지 못 불러오면 기본 원형 색상 적용
      div.innerHTML = player.name[0];
      div.style.backgroundColor = (index % 2 === 0) ? '#ff6f61' : '#4fc3f7';
      div.style.color = 'white';
      div.style.fontWeight = 'bold';
      div.style.fontSize = '20px';
      div.style.textAlign = 'center';
      div.style.lineHeight = '60px';
    };

    div.appendChild(img);
    track.appendChild(div);
    runners[index] = div;
  });
}

function spawnObstacles() {
  obstacles = [];
  const track = document.getElementById("track");
  for (let i = 0; i < 5; i++) {
    const x = 150 + Math.random() * 600;
    const y = 20 + i * 70;
    const obs = document.createElement("div");
    obs.className = "obstacle";
    obs.style.left = `${x}px`;
    obs.style.top = `${y}px`;
    
    const img = document.createElement("img");
    img.src = "assets/obstacle.png";
    img.onerror = () => {
      obs.style.backgroundColor = '#333';
      obs.style.borderRadius = '50%';
    };
    img.style.width = '100%';
    img.style.height = '100%';
    obs.appendChild(img);
    
    track.appendChild(obs);
    obstacles.push({ x, y });
  }
}

function startGame() {
  if (players.length < 2) {
    alert("최소 2명 이상 등록해주세요!");
    return;
  }

  document.getElementById("winner").innerText = "";
  renderPlayers();
  spawnObstacles();
  finishOrder = [];

  const shuffled = shuffle([...players]);

  shuffled.forEach((player, i) => {
    const runner = runners[players.findIndex(p => p.name === player.name)];
    const delay = 8000 + i * 1000 + Math.random() * 3000;
    const duration = delay;

    const startTime = performance.now();
    const startX = 0;
    const endX = 840;
    const laneY = parseInt(runner.style.top);

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / duration, 1);
      let position = startX + (endX * progress);

      obstacles.forEach(obs => {
        if (Math.abs(position - obs.x) < 20 && Math.abs(laneY - obs.y) < 30) {
          position -= 1;
        }
      });

      const shake = Math.sin(position / 20) * 10;
      runner.style.top = `${laneY + shake}px`;
      runner.style.left = `${Math.min(position, endX)}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        finishOrder.push(player);
        checkWinner();
      }
    }

    requestAnimationFrame(animate);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function checkWinner() {
  const targetRank = parseInt(document.getElementById("winnerRank").value);
  if (finishOrder.length === players.length) {
    const winnerPlayer = finishOrder[targetRank - 1];
    if (winnerPlayer) {
      document.getElementById("winner").innerText = `🎯 ${targetRank}등 당첨: ${winnerPlayer.name} 🎉`;
      fireConfetti();
    } else {
      document.getElementById("winner").innerText = `⚠ 참가자가 부족합니다`;
    }
  }
}

function fireConfetti() {
  confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
}
