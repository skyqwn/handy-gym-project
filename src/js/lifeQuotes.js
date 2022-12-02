const quotesDiv = document.getElementById("div");
const span = document.querySelector("#quotesDiv span");

const quotes = [
  "운동은 최고의 재테크입니다 행복한 미래를 위한 저축입니다",
  "自勝者强 자승자강, 자신과 싸워 이기는 자가 강한 자다",
  "NO PAIN NO GAIN",
  "포기하지 않는 자를 이기는 것은 너무 어렵다",
  "어려운 전투일수록 그 승리는 달콤하다",
  "최선을 다하는 자는 후회하지 않는 죄다",
  "끝날 때까지 끝난 게 아니다",
  "운동은 끝나고 먹는것까지가 운동이다",
  "운동할 떄 힘이 든 것은 몸이 아니라 마음",
  "운동의 고통은 통증일 뿐, 힘든 것이 아니다",
];

const randomQuotes = quotes[Math.floor(Math.random() * quotes.length)];

span.innerText = `" ${randomQuotes}"`;
