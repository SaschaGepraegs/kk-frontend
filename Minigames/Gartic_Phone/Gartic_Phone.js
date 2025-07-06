const canvas = document.getElementById("canvas");
const Werkzeuge = document.getElementById("Werkzeuge");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;


let isPainting = false;
let lastlineWidth = 5;
let startX = 0;
let startY = 0;

Werkzeuge.addEventListener("click", (e) => {
    if (e.target.id === "Loeschen") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.target.id === "Zuruecksetzen") {
        ctx.restore();
    }
});

Werkzeuge.addEventListener("change", (e) => {
    if (e.target.id === "Stift") {
        ctx.strokeStyle = e.target.value;
    } else if (e.target.id === "Dicke") {
        lineWidth = e.target.value;
    }
});

const draw = (e) => {
    if (!isPainting) return;

    ctx.lineWidth = lastlineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();

    startX = e.clientX - canvasOffsetX;
    startY = e.clientY - canvasOffsetY;
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
    timer = 25; // Timer zurücksetzen
    if(localStorage.getItem("uic_status")== "test"){ //Testoberfläche
        timer = 99999999;
    }
}



// Funktion für den Timer
function Timer(){
    timerInterval = setInterval(function(){ // NEU: Intervall-ID speichern
        if(timer > 0){
            timer--;
            document.getElementById("timer").innerHTML = "00:" +(timer < 10? "0" : "") + timer;
        }else{
            clearInterval(timerInterval); // NEU: Intervall korrekt stoppen
            spielBeenden();
            document.getElementById("timer").innerHTML = "Zeit abgelaufen";
        }
    }, 1000);
}


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