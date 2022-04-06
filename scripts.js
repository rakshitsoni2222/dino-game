function Dunner() {}

Dunner.prototype.dino = document.getElementById("dino");
Dunner.prototype.cactus = document.getElementById("cactus");
Dunner.prototype.start = false;
Dunner.prototype.objNumber = 0;
Dunner.prototype.score = 0;
Dunner.prototype.interval = "";
Dunner.prototype.speed = 30;
Dunner.prototype.upComingObjects = [];
Dunner.prototype.speedArray = [30, 35, 40, 45, 50, 60];
Dunner.prototype.widthArray = [10, 20, 30, 40, 50];
Dunner.prototype.heightArray = [10, 20, 30, 40, 50, 60];
Dunner.prototype.rightArray = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200,
];

Dunner.prototype.jump = function () {
  if (this.dino.classList.contains("jump") === false) {
    this.dino.classList.add("jump");
    setTimeout(() => {
      this.dino.classList.remove("jump");
    }, 500);
  }
};

Dunner.prototype.setObjects = function (upComingObjects) {
  this.cactus.style.width = upComingObjects[this.objNumber].width + "px";
  this.cactus.style.height = upComingObjects[this.objNumber].height + "px";
  this.cactus.style.right = upComingObjects[this.objNumber].right + "px";
};

Dunner.prototype.animateObj = function () {
  const elem = document.getElementById("cactus");
  let pos = this.upComingObjects[this.objNumber].right;
  let id = setInterval(frame, Math.floor(1000 / Dunner.prototype.speed));
  function frame() {
    pos = pos + 20;
    if (pos > 1050) {
      clearInterval(id);
      Dunner.prototype.objNumber = Dunner.prototype.objNumber + 1;
      if (Dunner.prototype.objNumber % 9 === 0) {
        Dunner.prototype.speedIncrease();
      }
      Dunner.prototype.runRepeaters();
    }
    elem.style.right = pos + "px";
    Dunner.prototype.checkGameOver();
  }
};

Dunner.prototype.speedIncrease = function (speed) {
  this.speed =
    this.speedArray[Math.floor(Math.random() * this.speedArray.length)];
};

Dunner.prototype.gameStart = async function () {
  this.start = true;
  startText.style.display = "none";
  this.dino.src = "giphy.gif";
  await this.pushObjects();
  this.startScoreInterval();
  setInterval(() => {
    this.pushObjects();
  }, 100);
  this.setObjects(this.upComingObjects);
  this.animateObj();
};

Dunner.prototype.makeObject = async function () {
  let width = await this.widthArray[
    Math.floor(Math.random() * this.widthArray.length)
  ];
  let height = await this.heightArray[
    Math.floor(Math.random() * this.heightArray.length)
  ];
  let right = await this.rightArray[
    Math.floor(Math.random() * this.rightArray.length)
  ];
  return {
    width,
    height,
    right: -right,
  };
};

Dunner.prototype.pushObjects = async function () {
  const object = await this.makeObject();
  this.upComingObjects.push(object);
};

Dunner.prototype.runRepeaters = function () {
  this.setObjects(this.upComingObjects);
  this.animateObj();
};

Dunner.prototype.checkGameOver = async function () {
  if (this.checkCollide(this.dino, this.cactus) === true) {
    await this.savePreviousScore();
    window.location.reload();
  }
};

Dunner.prototype.gameOver = function () {
  this.cactus.classList.add("gameOver");
};

Dunner.prototype.checkCollide = function (a, b) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height < bRect.top ||
    aRect.top > bRect.top + bRect.height ||
    aRect.left + aRect.width < bRect.left ||
    aRect.left > bRect.left + bRect.width
  );
};

Dunner.prototype.startScoreInterval = function () {
  this.interval = setInterval(() => {
    document.getElementById("scoreUpdate").innerText = this.score;
    this.score += 1;
  }, 1000 / this.speed);
};

Dunner.prototype.savePreviousScore = async function () {
  await localStorage.setItem(
    "previousScore",
    document.getElementById("scoreUpdate").innerText
  );
};

const startText = document.getElementsByTagName("h1")[0];
const previousScore = localStorage.getItem("previousScore");
document.getElementById("previousScoreUpdate").innerText = previousScore;

const dinoD = new Dunner();
document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    if (dinoD.start === false) {
      dinoD.start = true;
      startText.style.display = "none";
      dinoD.gameStart();
    } else {
      dinoD.jump();
    }
  }
});
