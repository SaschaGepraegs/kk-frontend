const urlParams = new URLSearchParams(window.location.search);
const pin = urlParams.get('pin');
document.getElementById("pinAnzeige").textContent = `PIN: ${pin}`;

async function ladeSpieler() {
    try {
        const response = await fetch(`https://kk-backend.vercel.app/getAllPlayersOfLobby?lobby=${pin}`);
        const data = await response.json();
        const liste = document.getElementById("spielerListe");
        liste.innerHTML = "";
        if (Array.isArray(data)) {
            data.forEach(spieler => {
                const el = document.createElement("div");
                el.className = "spieler";
                el.textContent = spieler;
                liste.appendChild(el);
            });
        } else {
            liste.textContent = "Keine Spieler gefunden.";
        }
    } catch (err) {
        document.getElementById("spielerListe").textContent = "Fehler beim Laden.";
    }
}

async function pruefeSpielGestartet() {
    try {
        const response = await fetch(`https://kk-backend.vercel.app/gehtsLos?lobby=${pin}`);
        const spielGestartet = await response.json();
        if (spielGestartet) {
            document.getElementById("startButton").disabled = true;
            document.getElementById("startButton").textContent = "Spiel läuft bereits";
        }
    } catch (err) {}
}

// --- Popup-Logik für Spielauswahl ---
const startButton = document.getElementById("startButton");
const popupOverlay = document.getElementById("popupOverlay");
const gameGrid = document.getElementById("gameGrid");
const spielSetzenBtn = document.getElementById("spielSetzenBtn");
const auswahlStatus = document.getElementById("auswahlStatus");
const gameAuswahlBtn = document.getElementById("gameAuswahlBtn");

// Spiele-Daten (Name + Dummy-Logo)
const spiele = [
    { id: 1, name: "Pizza-Clicker", img: "https://dummyimage.com/64x64/ffb300/fff.png&text=Pizza" },
    { id: 2, name: "Schere Stein Papier", img: "https://dummyimage.com/64x64/90caf9/fff.png&text=SSP" },
    { id: 3, name: "Memory+", img: "https://dummyimage.com/64x64/ce93d8/fff.png&text=Memory+" },
    { id: 4, name: "Asteroids", img: "https://dummyimage.com/64x64/d95e0d/fff.png&text=Asteroids"},
    //{ id: 5, name: "Zitate zuordnen", img: "https://dummyimage.com/64x64/a5d6a7/fff.png&text=Zz" },
    //{ id: 6, name: "Game 6", img: "https://dummyimage.com/64x64/ffd54f/fff.png&text=6" },
    //{ id: 7, name: "Game 7", img: "https://dummyimage.com/64x64/4fc3f7/fff.png&text=7" },
    //{ id: 8, name: "Game 8", img: "https://dummyimage.com/64x64/ba68c8/fff.png&text=8" },
    //{ id: 9, name: "Game 9", img: "https://dummyimage.com/64x64/ffb74d/fff.png&text=9" },
    //{ id: 10, name: "Game 10", img: "https://dummyimage.com/64x64/81c784/fff.png&text=10" },
    //{ id: 11, name: "Game 11", img: "https://dummyimage.com/64x64/ffd54f/fff.png&text=11" },
    //{ id: 12, name: "Game 12", img: "https://dummyimage.com/64x64/4fc3f7/fff.png&text=12" },
    //{ id: 13, name: "Game 13", img: "https://dummyimage.com/64x64/ba68c8/fff.png&text=13" },
    //{ id: 14, name: "Game 14", img: "https://dummyimage.com/64x64/ffb74d/fff.png&text=14" },
    //{ id: 15, name: "Game 15", img: "https://dummyimage.com/64x64/81c784/fff.png&text=15" },
    //{ id: 16, name: "Game 16", img: "https://dummyimage.com/64x64/ffd54f/fff.png&text=16" },
    //{ id: 17, name: "Game 17", img: "https://dummyimage.com/64x64/4fc3f7/fff.png&text=17" },
    //{ id: 18, name: "Game 18", img: "https://dummyimage.com/64x64/ba68c8/fff.png&text=18" },
    //{ id: 19, name: "Game 19", img: "https://dummyimage.com/64x64/ffb74d/fff.png&text=19" },
    //{ id: 20, name: "Game 20", img: "https://dummyimage.com/64x64/81c784/fff.png&text=20" }
];

// Dynamisch Spielkarten erzeugen
let selectedGameId = null;
function renderGameGrid() {
    gameGrid.innerHTML = "";
    spiele.forEach(spiel => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.dataset.id = spiel.id;
        card.innerHTML = `<img src="${spiel.img}" alt="${spiel.name}"><span>${spiel.name}</span>`;
        card.onclick = () => {
            document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedGameId = spiel.id;
            spielSetzenBtn.disabled = false;
        };
        gameGrid.appendChild(card);
    });
}
renderGameGrid();

// Popup nur öffnen, wenn Button gedrückt wird
gameAuswahlBtn.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
    auswahlStatus.textContent = "";
    selectedGameId = null;
    spielSetzenBtn.disabled = true;
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
});

async function starteSpiel() {
    try {
        await fetch(`https://kk-backend.vercel.app/losGehts?lobby=${pin}`);
    } catch (e) {}
    startButton.style.display = "none";
}

spielSetzenBtn.addEventListener("click", async () => {
    if (!selectedGameId) return;
    try {
        const res = await fetch(`https://kk-backend.vercel.app/changeNaechstesSpiel?lobby=${pin}&spielid=${selectedGameId}`);
        if (res.ok) {
            auswahlStatus.textContent = "Spiel gesetzt!";
        } else {
            auswahlStatus.textContent = "Fehler beim Setzen des Spiels.";
        }
    } catch (e) {
        auswahlStatus.textContent = "Fehler beim Setzen des Spiels.";
    }
});

spielBeendenBtn.addEventListener("click", async () => {
    fetch("https://kk-backend.vercel.app/reset?lobby=" + pin);
    window.location.replace("../index.html");
    return;
});

startButton.addEventListener("click", starteSpiel);

ladeSpieler();
pruefeSpielGestartet();

setInterval(() => {
    ladeSpieler();
    pruefeSpielGestartet();
}, 1000);

// Popup schließen bei Klick auf Overlay (außerhalb des Menüs)
popupOverlay.addEventListener("mousedown", function(e) {
    if (e.target === popupOverlay) {
        popupOverlay.style.display = "none";
        selectedGameId = null;
        spielSetzenBtn.disabled = true;
        document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
    }
});

// Copy-Button Funktionalität für die PIN (Material Icon)
document.addEventListener("DOMContentLoaded", function() {
    const pinAnzeige = document.getElementById("pinAnzeige");
    const copyBtn = document.getElementById("copyPinBtn");
    const iconSpan = copyBtn.querySelector("span.material-symbols-outlined");
    function getPin() {
        const match = pinAnzeige.textContent.match(/\d+/);
        return match ? match[0] : "";
    }
    copyBtn.onclick = function() {
        const pin = getPin();
        if (pin) {
            navigator.clipboard.writeText(pin);
            iconSpan.textContent = "check";
            copyBtn.style.background = "var(--md3-primary-container)";
            setTimeout(() => {
                iconSpan.textContent = "content_copy";
                copyBtn.style.background = "none";
            }, 1200);
        }
    };
});

// PIN als Hauptüberschrift anzeigen
document.addEventListener("DOMContentLoaded", function() {
    const pinAnzeige = document.getElementById("pinAnzeige");
    const mainPinHeading = document.getElementById("mainPinHeading");
    const updateMainHeading = () => {
        const match = pinAnzeige.textContent.match(/\d+/);
        if (match) {
            mainPinHeading.textContent = match[0];
        }
    };
    updateMainHeading();
    const observer = new MutationObserver(updateMainHeading);
    observer.observe(pinAnzeige, { childList: true, characterData: true, subtree: true });
});