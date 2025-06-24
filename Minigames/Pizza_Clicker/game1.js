function fortfahren() {
    localStorage.setItem("uic_task1done", "true");
    window.location.assign("/System/pause.html");
}
let clicks = 0;
let timer = 30;
if(localStorage.getItem("uic_status")!= "test"){
    timer = 99999999;
}
let intervalId = null;
let timerId = null;
let meter;
let clickCounter;
let pizzaImg;
let clickEffectContainer;
let timerElem;

function updateClickCounter() {
    clickCounter.textContent = `🍕 ${clicks}`;
}

function showClickEffect(x, y) {
    // Pizza-Emoji
    const effect = document.createElement("div");
    effect.className = "click-effect";
    effect.textContent = "🍕";
    effect.style.left = (x - pizzaImg.getBoundingClientRect().left - 20) + "px";
    effect.style.top = (y - pizzaImg.getBoundingClientRect().top - 20) + "px";
    clickEffectContainer.appendChild(effect);
    setTimeout(() => effect.remove(), 700);

    // Partikel
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement("div");
        particle.className = "pizza-particle";
        const angle = Math.random() * 2 * Math.PI;
        const dist = 60 + Math.random() * 30;
        particle.style.left = (x - pizzaImg.getBoundingClientRect().left - 9) + "px";
        particle.style.top = (y - pizzaImg.getBoundingClientRect().top - 9) + "px";
        particle.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        particle.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        clickEffectContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 700);
    }
}

function geklickt(e) {
    if (timer <= 0) return;
    clicks++;
    updateClickCounter();

    // Animation für Pizza
    pizzaImg.classList.remove("clicked");
    // Force reflow for restart animation
    void pizzaImg.offsetWidth;
    pizzaImg.classList.add("clicked");

    // Effekt am Klickpunkt (oder Mitte, falls kein Event)
    let x = e && e.clientX ? e.clientX : (pizzaImg.getBoundingClientRect().left + pizzaImg.width / 2);
    let y = e && e.clientY ? e.clientY : (pizzaImg.getBoundingClientRect().top + pizzaImg.height / 2);
    showClickEffect(x, y);
}

function startGame() {
    meter = document.querySelector("meter");
    clickCounter = document.getElementById("click-counter");
    pizzaImg = document.getElementById("pizza");
    clickEffectContainer = document.getElementById("click-effect-container");
    timerElem = document.getElementById("timer");

    meter.value = timer;
    meter.max = 30;
    updateClickCounter();

    pizzaImg.addEventListener("click", geklickt);

    // Rechtsklick auf Pizza deaktivieren
    pizzaImg.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        return false;
    });

    intervalId = setInterval(function() {
        meter.value = timer;
    }, 100);

    timerId = setInterval(function() {
        timer--;
        meter.value = timer;
        timerElem.textContent = timer;
        if (timer <= 0) {
            clearInterval(intervalId);
            clearInterval(timerId);
            pizzaImg.removeEventListener("click", geklickt);
            pizzaImg.style.filter = "grayscale(0.7) brightness(0.7)";
            spielBeenden();
        }
    }, 1000);
}

async function spielBeenden() {
    // Lobby und Spielername aus localStorage herholen
    const lobby = localStorage.getItem("uic_gamepin") || "1111";
    const username = localStorage.getItem("uic_username") || "Name";
    try {
        await fetch(`https://kk-backend.vercel.app/addPointsToPlayer?lobby=${lobby}&spieler=${username}&punkte=${clicks}`);
        setTimeout(() => {window.location.assign("/System/pause.html");}, 3000);
    } catch (e) {
        alert("Fehler beim Übertragen der Punkte!");
        setTimeout(() => {window.location.assign("/System/pause.html");}, 3000);
    }
}

// Spielstart nach Laden der Seite
if(localStorage.getItem("uic_status")!= "test"){
    window.onload = startGame;
}else{
    alert("Testoberfläche");
}
