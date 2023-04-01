const minField = document.getElementById("min");
const maxField = document.getElementById("max");
const price = 999;

const canvas = document.getElementById("slider");
const ct = canvas.getContext("2d");

let minPos = [15, 50];
let maxPos = [285, 50];
const rad = 8;

let dragged = undefined;

const lerp = (s, e, t) => {
  return (1 - t) * s + t * e;
};

const checkOverlap = ([posX, posY], [tarX, tarY, rad]) => {
  if (posX >= tarX - rad && posX <= tarX + rad) {
    if (posY >= tarY - rad && posY <= tarY + rad) {
      return true;
    }
  }
  return false;
};

const dragRange = (x, y) => {
  if (x < 290 && x > 10) {
    if (draggedSide === "max" && x > minPos[0] + 20) {
      dragged[0] = x;
      dragged[1] = limitY(y);
    }
    if (draggedSide === "min" && x < maxPos[0] - 20) {
      dragged[0] = x;
      dragged[1] = limitY(y);
    }
  }
};

const limitY = (y) => {
  if (y < 20) {
    return 20;
  }
  if (y > 80) {
    return 80;
  }
  return y;
};

const slide = (e) => {
  if (e !== undefined) {
    const { offsetX: x, offsetY: y } = e;
    if (dragged !== undefined) {
      dragRange(x, y);
    }
  }

  minField.innerText = `$${Math.floor((1000 * minPos[0]) / 300)}`;
  maxField.innerText = `$${Math.floor((1000 * maxPos[0]) / 300)}`;

  ct.clearRect(0, 0, 300, 100);
  drawLineLeft();
  drawLineRight();
  drawLineCenter();

  ct.strokeStyle = "#63a2ff";
  ct.lineWidth = 3;
  ct.fillStyle = "white";

  ct.beginPath();
  ct.moveTo(...maxPos);
  ct.arc(...maxPos, rad, 0, 2 * Math.PI);
  ct.moveTo(...minPos);
  ct.arc(...minPos, rad, 0, 2 * Math.PI);
  ct.stroke();

  ct.fill();
};

const drawLine = (start, control1, control2, end, color) => {
  ct.strokeStyle = color;
  ct.lineWidth = 3;

  ct.beginPath();
  ct.moveTo(start.x, start.y);
  ct.bezierCurveTo(
    control1.x,
    control1.y,
    control2.x,
    control2.y,
    end.x,
    end.y
  );
  ct.stroke();
};

const drawLineLeft = () => {
  drawLine(
    { x: 0, y: 50 },
    { x: minPos[0] / 3, y: 50 },
    { x: (2 * minPos[0]) / 3, y: minPos[1] },
    { x: minPos[0], y: minPos[1] },
    "gray"
  );
};

const drawLineRight = () => {
  const fromLeft = 300 - maxPos[0];
  drawLine(
    { x: 300, y: 50 },
    { x: 300 - fromLeft / 3, y: 50 },
    { x: 300 - (2 * fromLeft) / 3, y: maxPos[1] },
    { x: 300 - fromLeft, y: maxPos[1] },
    "gray"
  );
};

const drawLineCenter = () => {
  const fromMin = maxPos[0] - minPos[0];
  drawLine(
    { x: minPos[0], y: minPos[1] },
    { x: minPos[0] + fromMin / 3, y: minPos[1] },
    { x: minPos[0] + (2 * fromMin) / 3, y: maxPos[1] },
    { x: maxPos[0], y: maxPos[1] },
    "#63a2ff"
  );
};

const returnToCenter = (slider) => {
  const interval = setInterval(() => {
    if (slider[1] > 50) slider[1] = lerp(slider[1], 50, 0.15);
    if (slider[1] < 50) slider[1] = lerp(slider[1], 50, 0.15);
    if (slider[1] === 50) clearInterval(interval);
    slide();
  }, 1000 / 60);
};

canvas.addEventListener("mousemove", slide);
canvas.addEventListener("mousedown", (e) => {
  const { offsetX: x, offsetY: y } = e;
  if (checkOverlap([x, y], [...minPos, rad])) {
    dragged = minPos;
    draggedSide = "min";
  }
  if (checkOverlap([x, y], [...maxPos, rad])) {
    dragged = maxPos;
    draggedSide = "max";
  }
});
document.addEventListener("mouseup", (e) => {
  if (dragged[1] !== 50) returnToCenter(dragged);

  dragged = undefined;
  draggedSide = undefined;
});

slide();
