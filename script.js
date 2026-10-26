
/* ==========================================
   THOHEER (#JI) BIRTHDAY SETTINGS
   ========================================== */

const CONFIG = {
  friendName: "THOHEER (#JI)",
  birthdayMonth: 11,
  birthdayDay: 3
};

const getElement = id => document.getElementById(id);

getElement("friendName").textContent = CONFIG.friendName;
getElement("finalMessage").textContent =
  `HAPPY BIRTHDAY, ${CONFIG.friendName}!`;

document.title = `For ${CONFIG.friendName} | Birthday Surprise`;


/* ==========================================
   ANIMATED STARS
   ========================================== */

const starField = getElement("starField");

for (let i = 0; i < 90; i++) {
  const star = document.createElement("span");

  star.className = "star";
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;

  const size = Math.random() * 2 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  star.style.setProperty(
    "--duration",
    `${2 + Math.random() * 4}s`
  );

  star.style.animationDelay = `${Math.random() * 4}s`;

  starField.appendChild(star);
}


/* ==========================================
   PAGE NAVIGATION
   ========================================== */

const screens = Array.from(document.querySelectorAll(".screen"));
let currentPage = 0;

function showPage(pageIndex) {
  // Make sure the requested page exists.
  if (
    !Number.isInteger(pageIndex) ||
    pageIndex < 0 ||
    pageIndex >= screens.length
  ) {
    console.error("Page not found:", pageIndex + 1);
    return;
  }

  // Stop videos on the page we are leaving.
  screens[currentPage]
    .querySelectorAll("video")
    .forEach(video => video.pause());

  // Hide the old page and show the requested page.
  screens[currentPage].classList.remove("active");

  currentPage = pageIndex;

  screens[currentPage].classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// NEXT BUTTONS
document.querySelectorAll(".next-button[data-next]")
  .forEach(button => {
    button.addEventListener("click", () => {
      const nextPage = Number(button.dataset.next);

      showPage(nextPage);

      // Start music when the visitor begins the surprise.
      if (currentPage === 1) {
        startMusic();
      }

      // Celebrate again when the final celebration button is used.
      if (button.id === "celebrateButton") {
        celebrate();
      }
    });
  });

// BACK BUTTONS
document.querySelectorAll(".back-button[data-back]")
  .forEach(button => {
    button.addEventListener("click", () => {
      const previousPage = Number(button.dataset.back);
      showPage(previousPage);
    });
  });


/* ==========================================
   BACKGROUND MUSIC
   ========================================== */

const music = getElement("birthdayMusic");
const musicButton = getElement("musicButton");

async function startMusic() {
  try {
    await music.play();

    musicButton.textContent = "♫ Pause Music";
    musicButton.setAttribute("aria-pressed", "true");
  } catch (error) {
    console.warn("Music could not start:", error);

    musicButton.textContent = "♫ Play Music";
    musicButton.setAttribute("aria-pressed", "false");
  }
}

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    await startMusic();
  } else {
    music.pause();

    musicButton.textContent = "♫ Play Music";
    musicButton.setAttribute("aria-pressed", "false");
  }
});

music.addEventListener("error", () => {
  musicButton.textContent = "♫ Music file missing";
});


/* ==========================================
   BIRTHDAY COUNTDOWN
   ========================================== */

const daysElement = getElement("days");
const hoursElement = getElement("hours");
const minutesElement = getElement("minutes");
const secondsElement = getElement("seconds");
const countdownNote = getElement("countdownNote");

function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();

  let birthday = new Date(
    year,
    CONFIG.birthdayMonth - 1,
    CONFIG.birthdayDay,
    0, 0, 0
  );

  // If this year's birthday has passed, use next year.
  if (birthday <= now) {
    year++;

    birthday = new Date(
      year,
      CONFIG.birthdayMonth - 1,
      CONFIG.birthdayDay,
      0, 0, 0
    );
  }

  return birthday;
}

let nextBirthday = getNextBirthday();

function updateCountdown() {
  const now = new Date();

  if (now >= nextBirthday) {
    nextBirthday = getNextBirthday();
  }

  const difference = Math.max(
    0,
    nextBirthday.getTime() - now.getTime()
  );

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");

  countdownNote.textContent =
    `Next birthday: ${nextBirthday.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric"
    })}`;
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ==========================================
   CONFETTI CELEBRATION
   ========================================== */

const canvas = getElement("confetti");
const ctx = canvas.getContext("2d");

let pieces = [];
let animationFrame = null;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function celebrate() {
  pieces = [];

  const colors = [
    "#dfbd68",
    "#fff0b0",
    "#ffffff",
    "#bd8e2f"
  ];

  for (let i = 0; i < 180; i++) {
    pieces.push({
      x: Math.random() * window.innerWidth,
      y: -Math.random() * window.innerHeight,
      size: Math.random() * 7 + 3,
      speed: Math.random() * 3 + 2,
      drift: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      spin: Math.random() * 8 - 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }

  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  for (const piece of pieces) {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.rotation += piece.spin;

    ctx.save();

    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation * Math.PI / 180);
    ctx.fillStyle = piece.color;

    ctx.fillRect(
      -piece.size / 2,
      -piece.size / 2,
      piece.size,
      piece.size * 1.6
    );

    ctx.restore();
  }

  pieces = pieces.filter(
    piece => piece.y < window.innerHeight + 20
  );

  if (pieces.length > 0) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    animationFrame = null;
  }
}


/* ==========================================
   INTERACTIVE BIRTHDAY CAKE
   ========================================== */

const cakeButton = getElement("cakeButton");
const cakeMessage = getElement("cakeMessage");

let cakeBlown = false;

function toggleCake() {
  cakeBlown = !cakeBlown;

  cakeButton.classList.toggle("blown", cakeBlown);

  cakeButton.setAttribute(
    "aria-label",
    cakeBlown
      ? "Candles blown out"
      : "Blow out the birthday cake candles"
  );

  if (cakeBlown) {
    cakeMessage.textContent =
      `Wish made! Happy Birthday, ${CONFIG.friendName}! ✨`;

    celebrate();
  } else {
    cakeMessage.textContent =
      "The candles are back! Make another wish. 🎂";
  }
}

cakeButton.addEventListener("click", toggleCake);

cakeButton.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleCake();
  }
});


/* ==========================================
   END OF BIRTHDAY WEBSITE SCRIPT
   ========================================== */

console.log("Birthday website loaded successfully!");
console.log("Total pages:", screens.length);
