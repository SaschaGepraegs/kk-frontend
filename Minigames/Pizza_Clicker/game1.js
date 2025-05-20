function fortfahren() {
    localStorage.setItem("uic_task1done", "true");
    window.location.assign("/System/pause.html");
}
var clicks = 0;
var timer = 30;
var intervalId = null;
var timerId = null;
var meter = document.querySelector("meter");
meter.value = clicks;
meter.max = 100; // Optional: max kann beliebig sein, dient nur der Anzeige

function geklickt() {
    clicks++;
    meter.value = clicks;
}

function startGame() {
    intervalId = setInterval(function() {
        // Optional: Meter kann für Klicks genutzt werden
        meter.value = clicks;
    }, 100);

    timerId = setInterval(function() {
        timer--;
        if (timer <= 0) {
            clearInterval(intervalId);
            clearInterval(timerId);
            spielBeenden();
        }
    }, 1000);
}

async function spielBeenden() {
    // Lobby und Spielername aus localStorage holen
    const lobby = localStorage.getItem("uic_gamepin") || "1111";
    const player = localStorage.getItem("uic_name") || "Name";
    try {
        await fetch(`https://kk-backend.vercel.app/addPointsToPlayer?lobby=${localStorage.getItem("uic_gamepin")}&player=${localStorage.getItem("uic_username")}&points=${clicks}`,);
        window.location.assign("/System/pause.html");
    } catch (e) {
        alert("Fehler beim Übertragen der Punkte!");
        window.location.assign("/System/pause.html");
    }
}

// Spielstart nach Laden der Seite
window.onload = startGame;