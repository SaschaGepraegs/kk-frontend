const canvas = document.getElementById("canvas");
const Werkzeuge = document.getElementById("Werkzeuge");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

function resizeCanvas() {
    canvas.width = window.innerWidth - Werkzeuge.offsetWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);


let isPainting = false;
let lastlineWidth = 5;
let startX = 0;
let startY = 0;

Werkzeuge.addEventListener("click", (e) => {
    if (e.target.id === "Loeschen") {
        ctx.save(); // Aktuellen Zustand speichern
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.target.id === "Zuruecksetzen") {
        ctx.restore();
    }
});

Werkzeuge.addEventListener("change", (e) => {
    if (e.target.id === "Stift") {
        ctx.strokeStyle = e.target.value;
    } else if (e.target.id === "Dicke") {
        lastlineWidth = e.target.value;
    }
});

const draw = (e) => {
    if (!isPainting) return;

    ctx.lineWidth = lastlineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startX = x;
    startY = y;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.stroke();
    ctx.lineTo(x, y);

};

canvas.addEventListener("mousedown", (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;

});

canvas.addEventListener("mouseup", (e) => {
    isPainting = false;
    ctx.beginPath();
    ctx.stroke();
});

canvas.addEventListener("mousemove", draw);









let timer;


function reset(){
    timer = 60; // Timer zurücksetzen
    if(localStorage.getItem("uic_status")== "test"){ //Testoberfläche
        timer = 99999999;
    }
}



// Funktion für den Timer
    const timerDuration = 60; // Sekunden
    let timeLeft = timerDuration;
    const timerBar = document.getElementById("timerBar");
    const timerText = document.getElementById("timerText");

    function updateTimerUI() {
        timerText.textContent = `Zeit: ${timeLeft}s`;
        timerBar.style.width = `${(timeLeft / timerDuration) * 100}%`;
    }

    updateTimerUI();

    const timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            window.location.href = "/System/pause.html";
        }
    }, 1000);



//Funktion, die nach Ende des Spiels aufgerufen wird
async function spielBeenden() {
    if (spielBeendet) return; // NEU: Doppelte Ausführung verhindern
    spielBeendet = true; // NEU: Flag setzen
    clearInterval(timerInterval); // NEU: Timer sicher stoppen
    // Lobby und Spielername aus localStorage holen
    const lobby = localStorage.getItem("uic_gamepin") || "1111";
    const player = localStorage.getItem("uic_name") || "Name";
    try {
        const dataURL = canvas.toDataURL("image/png");
        console.log("Daten-URL generiert:", dataURL);
    } catch (e) {
        alert("Fehler beim Übertragen der Punkte!");
        setTimeout(() => {window.location.replace("/System/pause.html");}, 3000); // Nach 3 Sekunden auf die Pause-Seite weiterleiten
    }
}


async function LobbyStatus() {
    let lobby = localStorage.getItem("uic_gamepin");
    if (!lobby) return "off";
    lobby = String(lobby);
    try {
        const response = await fetch(`https://kk-backend.vercel.app/getOpenLobbyList`);
        const data = await response.json();
        if (Array.isArray(data) && data.map(String).map(s => s.trim()).includes(lobby)) {
            console.log("Lobby ist offen");
            lobbystatusvar = "on";
            return "on";
        } else {
            console.log("Lobby ist geschlossen oder nicht gefunden");
            lobbystatusvar = "off";
            return "off";
        }
    } catch {
        console.log("Lobby ist geschlossen oder nicht gefunden");
        return "off";
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    const lobby = localStorage.getItem("uic_gamepin");
    const spieler = localStorage.getItem("uic_username");

    // Vorschlag absenden
    const vorschlagButton = document.getElementById("vorschlagAbsenden");
    const vorschlagInput = document.getElementById("vorschlag");
    const statusText = document.getElementById("vorschlagStatus");

    vorschlagButton.addEventListener("click", async () => {
        const vorschlag = vorschlagInput.value.trim();
        if (vorschlag.length === 0) {
            statusText.textContent = "Bitte gib einen Vorschlag ein.";
            statusText.style.color = "red";
            return;
        }

        // ➤ SENDEN an Server
        const res = await fetch(..., {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lobby: lobby,
                spieler: spieler,
                thema: vorschlag
            })
        });

        if (res.ok) {
            statusText.textContent = "Vorschlag gesendet! Warte auf Auswahl…";
            statusText.style.color = "lightgreen";
            vorschlagInput.disabled = true;
            vorschlagButton.disabled = true;

            // ➤ WARTE auf Server-Auswahl (Polling oder WS)
            warteAufThema(); // Funktion weiter unten
        } else {
            statusText.textContent = "Fehler beim Senden!";
            statusText.style.color = "red";
        }
    });

    // Thema vom Server abrufen (POLLING ALLE 3 SEKUNDEN)

async function warteAufThema() {
    const themaAnzeige = document.getElementById("anzeigeThema");

    const checkInterval = setInterval(async () => {
        const res = await fetch(``);
        const data = await res.json();

        if (data.thema) {
            clearInterval(checkInterval);

            // Thema anzeigen
            document.getElementById("themenEingabeFenster").style.display = "none";
            themaAnzeige.textContent = `Gezeichnet wird: ${data.thema}`;
            themaAnzeige.style.display = "block";

            // Thema kurz anzeigen lassen, dann Timer starten
            setTimeout(() => {
                themaAnzeige.style.display = "none";
                startTimer(); // <--- Automatischer Spielstart
            }, 3000); // Thema 3 Sekunden anzeigen
        }
    }, 3000); // alle 3 Sekunden prüfen
}

    // Beispiel-Timer
    function startTimer() {
        let zeit = 60;
        const timerEl = document.getElementById("timer");
        const interval = setInterval(() => {
            timerEl.textContent = `${zeit < 10 ? "0" : ""}${zeit}`;
            if (zeit <= 0) {
                clearInterval(interval);
                alert("Zeit vorbei!");
            }
            zeit--;
        }, 1000);
    }
});