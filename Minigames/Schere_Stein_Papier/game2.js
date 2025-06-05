function fortfahren() {
    localStorage.setItem("uic_task1done", "true");
    window.location.assign("/System/pause.html");
}
let AnzahlGewonnen = 0;
let timer = 20;
let intervalId = null;
let timerId = null;
let meter;
let punkteDiv;

window.onload = function() {
    meter = document.querySelector("meter");
    meter.value = timer;
    meter.max = 20;
    punkteDiv = document.createElement("div");
    punkteDiv.id = "punkteDiv";
    punkteDiv.textContent = "Punkte: 0";
    document.body.appendChild(punkteDiv);

    document.getElementById("timer").textContent = timer;

    intervalId = setInterval(function() {
        meter.value = timer;
    }, 100);

    timerId = setInterval(function() {
        timer--;
        meter.value = timer;
        document.getElementById("timer").textContent = timer;
        if (timer <= 0) {
            clearInterval(intervalId);
            clearInterval(timerId);
            disableButtons();
            spielBeenden();
        }
    }, 1000);

    document.getElementById("btn_t1").addEventListener("click", function() {
        handleButtonClick(this, Schere);
    });
    document.getElementById("btn_t2").addEventListener("click", function() {
        handleButtonClick(this, Stein);
    });
    document.getElementById("btn_t3").addEventListener("click", function() {
        handleButtonClick(this, Papier);
    });

    MachAufAnfangJetztAlter();
};

function handleButtonClick(button, callback) {
    callback();
    button.disabled = true;
    setTimeout(function () {
        button.disabled = false;
    }, 2000);
}

function disableButtons() {
    document.getElementById("btn_t1").disabled = true;
    document.getElementById("btn_t2").disabled = true;
    document.getElementById("btn_t3").disabled = true;
}

function Schere() {
    MachAufAnfangJetztAlter();
    let x = Math.floor(Math.random() * 3) + 1;
    // 1 = Stein, 2 = Schere, 3 = Papier
    if (x === 1) { // Gegner: Stein
        show("Schere", "Stein1");
    } else if (x === 2) { // Gegner: Schere
        show("Schere", "Schere1");
        AnzahlGewonnen++;
    } else if (x === 3) { // Gegner: Papier
        show("Schere", "Papier1");
    }
    updatePunkte();
}

function Papier() {
    MachAufAnfangJetztAlter();
    let x = Math.floor(Math.random() * 3) + 1;
    // 1 = Stein, 2 = Schere, 3 = Papier
    if (x === 1) { // Gegner: Stein
        show("Papier", "Stein1");
        AnzahlGewonnen++;
    } else if (x === 2) { // Gegner: Schere
        show("Papier", "Schere1");
    } else if (x === 3) { // Gegner: Papier
        show("Papier", "Papier1");
    }
    updatePunkte();
}

function Stein() {
    MachAufAnfangJetztAlter();
    let x = Math.floor(Math.random() * 3) + 1;
    // 1 = Stein, 2 = Schere, 3 = Papier
    if (x === 1) { // Gegner: Stein
        show("Stein", "Stein1");
    } else if (x === 2) { // Gegner: Schere
        show("Stein", "Schere1");
        AnzahlGewonnen++;
    } else if (x === 3) { // Gegner: Papier
        show("Stein", "Papier1");
    }
    updatePunkte();
}

function show(eigen, gegner) {
    // Blende alle aus
    MachAufAnfangJetztAlter();
    document.getElementById(eigen).style.visibility = "visible";
    document.getElementById(gegner).style.visibility = "visible";
}

function MachAufAnfangJetztAlter() {
    // Setze alle Bilder zurück
    ["Stein", "Stein1", "Schere", "Schere1", "Papier", "Papier1"].forEach(id => {
        document.getElementById(id).style.visibility = "hidden";
    });
}

function updatePunkte() {
    if (punkteDiv) {
        punkteDiv.textContent = "Punkte: " + AnzahlGewonnen;
    }
}

async function spielBeenden() {
    // Lobby und Spielername aus localStorage holen
    const lobby = localStorage.getItem("uic_gamepin") || "1111";
    const username = localStorage.getItem("uic_username") || "Name";
    try {
        await fetch(`https://kk-backend.vercel.app/addPointsToPlayer?lobby=${lobby}&spieler=${username}&punkte=${AnzahlGewonnen * 60}`);
        setTimeout(() => {window.location.assign("/System/pause.html");}, 3000);
    } catch (e) {
        alert("Fehler beim Übertragen der Punkte!");
        setTimeout(() => {window.location.assign("/System/pause.html");}, 3000);
    }
}




