const reactionButton = document.getElementById("reactionButton");
const message = document.getElementById("message");
const result = document.getElementById("result");

let startTime;
let greenTime;

const delay = 5000; // 5 seconds after page load

// Set a synchronized start time
const gameStart = Date.now() + delay;

message.textContent = "Game starts in 5 seconds...";
reactionButton.disabled = true;
reactionButton.textContent = "Wait...";

const checkTimer = setInterval(() => {
  const now = Date.now();

  if (now >= gameStart) {
    clearInterval(checkTimer);
    reactionButton.disabled = false;
    reactionButton.classList.add("active");
    reactionButton.textContent = "Click!";
    message.textContent = "Click now!";
    greenTime = Date.now();
  }
}, 10);

reactionButton.addEventListener("click", () => {
  if (!reactionButton.classList.contains("active")) {
    message.textContent = "Too soon!";
    reactionButton.classList.add("tooSoon");
    reactionButton.textContent = "Too Soon!";
    reactionButton.disabled = true;
    return;
  }

  const reaction = Date.now() - greenTime;
  result.textContent = `Your reaction time: ${reaction} ms`;
  reactionButton.disabled = true;
  reactionButton.classList.remove("active");
  message.textContent = "Refresh the page to try again.";
});