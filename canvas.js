const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
context.strokeStyle = "black";

const bugImage = new Image();
bugImage.src = "./Assets/Bug.png";

const crowImage = new Image();
crowImage.src = "./Assets/crow.png";

const obstacleAudio = new Audio("./Assets/obstcale.wav");

let gameStart = false;
let speed = 2;
let previous;

function drawWires() {
  const initial = 0;
  let wireCount = 0;
  let i = 0;
  while (wireCount < 4) {
    const x = i + 150;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
    i = i + 150;
    wireCount++;
  }
}

const radius = 30;
let circleX = 150;
let circleY = canvas.height - radius - 100;

function drawBug(x, y) {
  context.drawImage(bugImage, x - radius, y - radius, radius * 2, radius * 2);
}

drawBug(circleX, circleY);
let startTime;
let stopwatchInterval;

function startTimer() {
  startTime = Date.now();
  stopwatchInterval = setInterval(updateScore, 10);
}

function stopTimer() {
  clearInterval(stopwatchInterval);
}

function updateScore() {
  const timeDifference = Date.now() - startTime;
  const hours = Math.floor(timeDifference / (60 * 60 * 1000));
  const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);
  const milliseconds = Math.floor((timeDifference % 1000) / 10);

  // Increasing Level
  if (
    seconds !== 0 &&
    seconds % 10 === 0 &&
    speed < 15 &&
    seconds !== previous
  ) {
    speed += 1;
    previous = seconds;
  }

  // Format the time as 00:00:00:00
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(
    milliseconds
  ).padStart(2, "0")}`;

  document.getElementById("timer").innerHTML = formattedTime;
}

document.onkeydown = function (event) {
  switch (event.keyCode) {
    case 32:
      gameStart = true;
      obstacleAudio.play();
      startTimer();
      break;

    case 37:
      context.clearRect(
        circleX - radius - 1,
        circleY - radius - 1,
        radius * 2 + 2,
        radius * 2 + 2
      );
      drawWires();

      circleX -= 150;
      if (circleX < 151) {
        circleX = 150;
      }
      drawBug(circleX, circleY);
      drawWires();
      break;
    case 38:
      break;
    case 39:
      // Clear the previous circle position
      if (gameStart) {
        context.clearRect(
          circleX - radius - 1,
          circleY - radius - 1,
          radius * 2 + 2,
          radius * 2 + 2
        );
        drawWires();

        circleX += 150;
        if (circleX > canvas.width - radius) {
          circleX = circleX - 150;
        }
        drawBug(circleX, circleY);
        drawWires();
      }
      break;
  }
};
drawWires();

let rectangles = [];

function createRectangle() {
  if (gameStart) {
    const randomNumber = Math.random();
    //high probability for one crow occurence
    if (randomNumber < 0.5) {
      const x = 150 + Math.floor(Math.random() * 4) * 150 - 30;
      const imageRectangle = createImageRectangle(x);
      rectangles.push(imageRectangle);
    }
    //lower for two
    else if (randomNumber < 0.8) {
      for (let i = 0; i < 2; i++) {
        const x = 150 + Math.floor(Math.random() * 4) * 150 - 30;
        const imageRectangle = createImageRectangle(x);
        rectangles.push(imageRectangle);
      }
    }
    //lowest for three
    else {
      for (let i = 0; i < 3; i++) {
        const x = 150 + Math.floor(Math.random() * 4) * 150 - 30;
        const imageRectangle = createImageRectangle(x);
        rectangles.push(imageRectangle);
      }
    }
  }
}

function createImageRectangle(x) {
  return { x, y: 0, width: 60, height: 45, image: crowImage };
}

function drawRectangles() {
  rectangles.forEach((rectangle) => {
    context.fillStyle = rectangle.color;
    context.fillRect(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height
    );
  });
}

function animateRectangles() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  rectangles.forEach((rectangle) => {
    rectangle.y += speed;
    // Check for collision with bug
    if (
      circleX < rectangle.x + rectangle.width &&
      circleX + radius > rectangle.x &&
      circleY < rectangle.y + rectangle.height &&
      circleY + radius > rectangle.y
    ) {
      // Handle collision
      obstacleAudio.play();
      gameStart = false;
      stopTimer();

      const gameOverDiv = document.createElement("div");
      gameOverDiv.innerText = "Game Over! Click to restart.";
      gameOverDiv.style.fontSize = "18px";
      gameOverDiv.style.position = "absolute";
      gameOverDiv.style.top = "45%";
      gameOverDiv.style.left = "57%";
      gameOverDiv.style.width = "200px";
      gameOverDiv.style.height = "85px";
      gameOverDiv.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.3)";
      gameOverDiv.style.backgroundColor = "rgba(230, 230, 250, 0.3)";
      gameOverDiv.style.lineHeight = "30px";
      gameOverDiv.style.padding = "30px";
      gameOverDiv.style.borderRadius = "10px";
      gameOverDiv.style.cursor = "pointer";

      gameOverDiv.addEventListener("click", () => {
        location.reload();
      });

      // Append the div to the document
      document.body.appendChild(gameOverDiv);
    }

    context.drawImage(
      rectangle.image,
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height
    );
  });

  drawWires();
  drawBug(circleX, circleY);
}

function animate() {
  if (gameStart) {
    animateRectangles();
  }
  drawWires();
  drawBug(circleX, circleY);

  requestAnimationFrame(animate);
}

setInterval(createRectangle, 3000);

animate();
