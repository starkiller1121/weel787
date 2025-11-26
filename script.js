const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

// 視覺輪盤設定（區塊大小）
const segments = [
  { label: "A 賞", angle: 20, color: "#EB3324" },
  { label: "B 賞", angle: 30, color: "#FF7F27" },
  { label: "C 賞", angle: 30, color: "#FFF200" },
  { label: "D 賞", angle: 60, color: "#22B14C" },
  { label: "E 賞", angle: 80, color: "#00A2E8" },
  { label: "F 賞", angle: 100, color: "#A349A4" },
  { label: "銘謝惠顧", angle: 40, color: "#808080" }
];

// 抽獎機率
const probabilities = [
  { label: "A 賞", weight: 0 },
  { label: "B 賞", weight: 2 },
  { label: "C 賞", weight: 4 },
  { label: "D 賞", weight: 6 },
  { label: "E 賞", weight: 8 },
  { label: "F 賞", weight: 60 },
  { label: "銘謝惠顧", weight: 20 }
];

function weightedRandom() {
  const total = probabilities.reduce((a, b) => a + b.weight, 0);
  let rnd = Math.random() * total;

  for (let p of probabilities) {
    if (rnd < p.weight) return p.label;
    rnd -= p.weight;
  }
}

function drawWheel() {
  let startAngle = 0;

  segments.forEach(seg => {
    const endAngle = startAngle + (seg.angle * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, startAngle, endAngle);
    ctx.fillStyle = seg.color;
    ctx.fill();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(startAngle + (endAngle - startAngle) / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(seg.label, 150, 10);
    ctx.restore();

    startAngle = endAngle;
  });
}

drawWheel();

let currentRotation = 0;

spinBtn.onclick = () => {
  const winner = weightedRandom();

  let start = 0;
  let targetAngle = 0;
  segments.forEach(seg => {
    const end = start + seg.angle;
    if (seg.label === winner) {
      targetAngle = start + seg.angle / 2;
    }
    start = end;
  });

  const finalRotation = 360 * 5 - targetAngle;

  const duration = 3000;
  const startTime = performance.now();

  function animate(t) {
    const progress = Math.min((t - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    currentRotation = finalRotation * ease;
    ctx.clearRect(0, 0, 400, 400);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(currentRotation * Math.PI / 180);
    ctx.translate(-200, -200);
    drawWheel();
    ctx.restore();

    if (progress < 1) requestAnimationFrame(animate);
    else alert("抽中：" + winner);
  }

  requestAnimationFrame(animate);
};