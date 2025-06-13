let players = [];
let runners = [];
let positions = [];
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
    div.style.top = `${index * 80 + 20}px`;
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
  positions = new Array(totalPlayers).fill(0);
  speeds = new Array(totalPlayers).fill(1);
  isFinished = new Array(totalPlayers).fill(false);
  finishOrder = [];

  requestAnimationFrame(update);
}

function update() {
  const endX = 840;
  const trackWidth = 840;

  // 속도 랜덤 가감 (가속, 감속)
  players.forEach((_, i) => {
    if (!isFinished[i]) {
      speeds[i] += (Math.random() * 0.1 - 0.05);
      speeds[i] = Math.min(Math.max(speeds[i], 0.5), 2.5);
    }
  });

  // 충돌 판정 (플레이어 간 밀치기)
  players.forEach((_, i) => {
    players.forEach((_, j) => {
      if (i !== j && !isFinished[i] && !isFinished[j]) {
        if (Math.abs(positions[i] - positions[j]) < 50) {
          const push = (positions[i] < positions[j]) ? -1 : 1;
          positions[i] += push * 2;
          positions[j] -= push * 2;
        }
      }
    });
  });

  // 이동 계산
  players.forEach((_, i) => {
    if (!isFinished[i]) {
      positions[i] += speeds[i];
      if (positions[i] >= trackWidth) {
        positions[i] = trackWidth;
        isFinished[i] = true;
        finishOrder.push(players[i]);
      }
    }

    // 흔들림 표현 (추월감)
    const shake = Math.sin(positions[i] / 20) * 10;
    runners[i].style.left = `${positions[i]}px`;
    runners[i].style.top = `${i * 80 + 20 + shake}px`;
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
