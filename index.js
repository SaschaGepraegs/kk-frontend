localStorage.setItem("uic_username", undefined);
localStorage.setItem("uic_gamepin", undefined);
localStorage.setItem("uic_gamequeue_index", 0);
localStorage.setItem("uic_status", undefined)

// Wenn Seite geladen wird, dann springt der Cursor ins Eingabefeld für den Lobbycode.
window.onload = function() {
    setTimeout(() => {
            document.getElementById("lobbyeingabe").focus();
        }, 100);
    }

// Hilfsfunktion: Alle Buttons und Inputs deaktivieren
function disableAllInputs(disabled = true) {
    document.querySelectorAll('button, input').forEach(el => {
        el.disabled = disabled;
    });
}

// Funktion für Link-Kopieren-Button
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search); // Liest die PIN aus der URL (?pin=...)
    const pin = urlParams.get('pin');
    if (pin) {
        const lobbyInput = document.getElementById('lobbyeingabe'); // und trägt sie automatisch ins Eingabefeld ein, falls vorhanden.
        if (lobbyInput) {
            lobbyInput.value = pin;
            checkLobby(); // und springt direkt zur Namenseingabe, wenn die Lobby existiert.
        }
    }
});

// Enter-Taste für Lobbycode und Name
document.addEventListener('DOMContentLoaded', () => {
    const lobbyInput = document.getElementById('lobbyeingabe');
    const lobbyBtn = document.getElementById('Button1');
    const nameInput = document.getElementById('namenseingabe');
    const nameBtn = document.getElementById('Button2');
    const hostBtn = document.getElementById('Button3');

    if (lobbyInput) {
        lobbyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                lobbyBtn.click();
            }
        });
    }
    if (nameInput) {
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                nameBtn.click();
            }
        });
    }
    if (hostBtn) {
        hostBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                hostBtn.click();
            }
        });
    }
});

function showLoader(show = true) {
    const overlay = document.getElementById("loaderOverlay");
    if (show) {
        overlay.classList.add("active");
    } else {
        overlay.classList.remove("active");
    }
}

// Zeige Namensfeld erst nach erfolgreicher Lobbyprüfung
async function checkLobby() {
    disableAllInputs(true);
    showLoader(true);
    const lobbycode = document.getElementById("lobbyeingabe").value;
    if (!lobbycode && lobbycode!="test") {
        alert("Bitte gib zuerst einen Lobbycode ein.");
        showLoader(false);
        disableAllInputs(false);
        return;
    }else 
    if (lobbycode == "test"){
        var eingabeTest = window.prompt("Wähle ein Spiel aus");
        switch(eingabeTest){
            case "1":{
            window.localStorage.setItem("uic_status", "test")
            window.location.assign("./Minigames/Pizza_Clicker/game1.html")
            }
            break;
            case "2":{
            window.localStorage.setItem("uic_status", "test")
            window.location.assign("./Minigames/Memory+/pt_memory.html")
            }
            break;
            case "3":{
            window.localStorage.setItem("uic_status", "test")
            window.location.assign("./Minigames/Schere_Stein_Papier/game2.html")
            }
        }
        showLoader(false);
        disableAllInputs(false);
        return;
    }
    try {
        // Neuer Sammel-Endpoint für Lobbydaten
        const antwort = await fetch('https://kk-backend.vercel.app/lobbyInfo?lobby=' + lobbycode);
        const data = await antwort.json();
        if (!data.players || !Array.isArray(data.players) || data.players.length === 0) {
            alert("Diese Lobby existiert nicht.");
            showLoader(false);
            disableAllInputs(false);
            return;
        }
        // Lobby existiert, Umschalten auf Namenseingabe
        document.getElementById("lobbySection").style.display = "none";
        document.getElementById("nameSection").style.display = "flex";
        localStorage.setItem("uic_gamepin", lobbycode);
        setTimeout(() => {
            document.getElementById("namenseingabe").focus();
        }, 100);
    } finally {
        showLoader(false);
        disableAllInputs(false);
    }
}

async function joinLobby() {
    disableAllInputs(true);
    showLoader(true);
    const username = document.getElementById("namenseingabe").value;
    const lobbycode = localStorage.getItem("uic_gamepin");
    if (!username || username.trim() === "") {
        alert("Du musst einen Namen eingeben!");
        showLoader(false);
        disableAllInputs(false);
        return;
    }
    if (username === "reset") {
        fetch("https://kk-backend.vercel.app/reset?lobby=" + lobbycode);
        alert("Reset durchgeführt.");
        showLoader(false);
        disableAllInputs(false);
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
        showLoader(false);
        disableAllInputs(false);
        return;
    }
    // Status setzen und gehtsLos prüfen
    localStorage.setItem("uic_username", username);
    localStorage.setItem("uic_status", "lobby");
    gehtsLos();
}

async function gehtsLos() {
    // Neuer Sammel-Endpoint für Lobbydaten
    var antwort3 = fetch('https://kk-backend.vercel.app/lobbyInfo?lobby=' + localStorage.getItem("uic_gamepin"));
    let data = await (await antwort3).json();

    if (data.gehtslos === true) {
        alert('Das Spiel hat bereits gestartet! Wenn du es zurücksetzen willst, dann logge dich bitte als Spieler "reset" ein.');
        showLoader(false);
        disableAllInputs(false);
    } else {
        window.location.assign("System/lobby.html");
    }
}

async function LobbyHosten() {
    disableAllInputs(true);
    document.getElementById("Button3").innerHTML = "Erstelle Lobby...";
    document.getElementById("Button3").disabled = true;
    showLoader(true);
    const pin = Math.floor(1000 + Math.random() * 9000);
    const response = await fetch('https://kk-backend.vercel.app/registerLobby?gamepin=' + pin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            gamepin: pin
        })
    });

    if (response.ok) {
        window.location.href = `./Mainscreen/mainscreen.html?pin=${pin}`;
    } else {
        alert("Fehler beim Erstellen der Lobby.");
        showLoader(false);
        disableAllInputs(false);
        document.getElementById("Button3").innerHTML = "Lobby Hosten";
        document.getElementById("Button3").disabled = false;
    }
}

// Darkmode Toggle
document.addEventListener("DOMContentLoaded", function() {
    const body = document.getElementById("bodyRoot");
    const toggle = document.getElementById("darkModeToggle");
    const icon = document.getElementById("darkModeIcon");
    const darkClass = "md3-dark";
    function setMode(dark) {
        if (dark) {
            body.classList.add(darkClass);
            icon.textContent = "light_mode";
            localStorage.setItem("md3_darkmode", "1");
        } else {
            body.classList.remove(darkClass);
            icon.textContent = "dark_mode";
            localStorage.setItem("md3_darkmode", "0");
        }
    }
    // Initial
    setMode(localStorage.getItem("md3_darkmode") === "1");
    toggle.onclick = () => setMode(!body.classList.contains(darkClass));
});