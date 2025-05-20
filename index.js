localStorage.setItem("uic_status", "auswahl");
localStorage.setItem("uic_username", undefined);
localStorage.setItem("uic_gamepin", undefined);
localStorage.setItem("uic_task1done", undefined);
localStorage.setItem("uic_task2done", undefined);
localStorage.setItem("uic_task3done", undefined);
localStorage.setItem("uic_task4done", undefined);
localStorage.setItem("uic_task5done", undefined);
localStorage.setItem("uic_task6done", undefined);
localStorage.setItem("uic_task7done", undefined);

// Zeige Namensfeld erst nach erfolgreicher Lobbyprüfung
async function checkLobby() {
    const lobbycode = document.getElementById("lobbyeingabe").value;
    if (!lobbycode) {
        alert("Bitte gib zuerst einen Lobbycode ein.");
        return;
    }
    // Loader anzeigen
    document.getElementById("loaderOverlay").style.display = "flex";
    try {
        const antwort = await fetch('https://kk-backend.vercel.app/getOpenLobbyList');
        const data = await antwort.json();
        if (!JSON.stringify(data).includes(lobbycode)) {
            alert("Diese Lobby existiert nicht.");
            document.getElementById("loaderOverlay").style.display = "none";
            return;
        }
        // Lobby existiert, Umschalten auf Namenseingabe
        document.getElementById("lobbySection").style.display = "none";
        document.getElementById("nameSection").style.display = "block";
        localStorage.setItem("uic_gamepin", lobbycode);
        setTimeout(() => {
            document.getElementById("namenseingabe").focus();
        }, 100);
    } finally {
        // Loader ausblenden
        document.getElementById("loaderOverlay").style.display = "none";
    }
}

async function joinLobby() {
    const username = document.getElementById("namenseingabe").value;
    const lobbycode = localStorage.getItem("uic_gamepin");
    if (!username || username.trim() === "") {
        alert("Du musst einen Namen eingeben!");
        return;
    }
    if (username === "reset") {
        fetch("https://kk-backend.vercel.app/reset?lobby=" + lobbycode);
        alert("Reset durchgeführt.");
        return;
    }
    // Spieler prüfen
    const playerRes = await fetch('https://kk-backend.vercel.app/checkForPlayer', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "lobby": lobbycode,
            "username": username
        })
    });
    const playerData = await playerRes.json();
    if (playerData === true) {
        alert("Diesen Nutzernamen gibt es schon.");
        return;
    }
    // Status setzen und gehtsLos prüfen
    localStorage.setItem("uic_username", username);
    localStorage.setItem("uic_status", "lobby");
    gehtsLos();
}

async function gehtsLos() {
    var antwort3 = fetch('https://kk-backend.vercel.app/gehtsLos?lobby=' + localStorage.getItem("uic_gamepin"));
    let data = await (await antwort3).json();
    let endergebnis = JSON.stringify(data);

    if (endergebnis == "true") {
        alert('Das Spiel hat bereits gestartet! Wenn du es zurücksetzen willst, dann logge dich bitte als Spieler "reset" ein.');
    } else {
        window.location.assign("System/lobby.html");
    }
}