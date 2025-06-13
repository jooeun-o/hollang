let players = [];
let runners = [];
let positionsY = [];
let positionsX = [];
let speeds = [];
let finishOrder = [];
let isFinished = [];

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
    div.style.left = `170px`; // 중앙으로 고정
    div.innerText = player.name.slice(0, 3);
    div.style.backgroundColor = (index % 2 === 0) ? '#ff6f61' : '#4fc3f7';
    track.appendChild(div);
    runners[index] = div;
  });
}

function startGame() {
  if (players.length < 2) {
    alert("최소 2명 이상 등록해주세요!");
    return;
  }

  document.getElementById("winner").innerText = "";
  renderPlayers();

  const totalPlayers = players.length;
  positionsY = new Array(totalPlayers).fill(0);
  positionsX = new Array(totalPlayers).fill(170);
  speeds = new Array(totalPlayers).fill(1);
  isFinished = new Array(totalPlayers).fill(false);
  finishOrder = [];

  requestAnimationFrame(update);
}

function update() {
  const trackHeight = 840;

  // 속도 변화
  players.forEach((_, i) => {
    if (!isFinished[i]) {
      speeds[i] += (Math.random() * 0.1 - 0.05);
      speeds[i] = Math.min(Math.max(speeds[i], 0.5), 2.5);
    }
  });

  // 밀침 판정 (좌우 충돌)
  players.forEach((_, i) => {
    players.forEach((_, j) => {
      if (i !== j && !isFinished[i] && !isFinished[j]) {
        const dx = positionsX[i] - positionsX[j];
        const dy = positionsY[i] - positionsY[j];
        if (Math.abs(dy) < 50 && Math.abs(dx) < 50) {
          const push = (dx < 0) ? -1 : 1;
          positionsX[i] += push * 2;
          positionsX[j] -= push * 2;
        }
      }
    });
  });

  // 이동 및 종료판정
  players.forEach((_, i) => {
    if (!isFinished[i]) {
      positionsY[i] += speeds[i];
      if (positionsY[i] >= trackHeight) {
        positionsY[i] = trackHeight;
        isFinished[i] = true;
        finishOrder.push(players[i]);
      }
    }

    runners[i].style.top = `${positionsY[i]}px`;
    runners[i].style.left = `${positionsX[i]}px`;
  });

  if (finishOrder.length < players.length) {
    requestAnimationFrame(update);
  } else {
    checkWinner();
  }
}

function checkWinner() {
  const targetRank = parseInt(document.getElementById("winnerRank").value);
  const winnerPlayer = finishOrder[targetRank - 1];
  if (winnerPlayer) {
    document.getElementById("winner").innerText = `🎯 ${targetRank}등 당첨: ${winnerPlayer.name} 🎉`;
    fireConfetti();
  } else {
    document.getElementById("winner").innerText = `⚠ 참가자가 부족합니다`;
  }
}

function fireConfetti() {
  confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
}
