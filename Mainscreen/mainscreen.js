const urlParams = new URLSearchParams(window.location.search);
const pin = urlParams.get('pin');
document.getElementById("pinAnzeige").textContent = pin;
let selectedGameIds = []
const runden = document.getElementById("runden");

// Spiele-Daten (Name + Dummy-Logo)
const spiele = [
    { id: 1, name: "Pizza-Clicker", img: "https://dummyimage.com/64x64/ffb300/fff.png&text=Pizza" },
    { id: 2, name: "Schere Stein Papier", img: "https://dummyimage.com/64x64/90caf9/fff.png&text=SSP" },
    { id: 3, name: "Memory+", img: "https://dummyimage.com/64x64/ce93d8/fff.png&text=Memory+" },
    { id: 4, name: "Asteroids", img: "https://dummyimage.com/64x64/d95e0d/fff.png&text=Asteroids"},
    { id: 5, name: "Imposter", img: "https://dummyimage.com/64x64/1976d2/fff.png&text=Imposter" },
    { id: 6, name: "Double or Nothing", img: "https://dummyimage.com/64x64/ffd54f/fff.png&text=DON" },
    { id: 7, name: "Gartic Phone V1", img: "https://dummyimage.com/64x64/4fc3f7/fff.png&text=Gartic Phone" },
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

// --- Popup-Logik für Spielauswahl ---
// Hier werden sämtliche Buttons und Popups definiert
const startBtn = document.getElementById("startBtn"); // startet das Spiel
const spielBeendenBtn = document.getElementById("spielBeendenBtn");  // beendet das Spiel
const resetBtn = document.getElementById("resetBtn"); // Button zum Zurücksetzen der Spielauswahl
const modusWählenBtn = document.getElementById("modusWählenBtn"); // Button zum Wählen des Spielmodus (Rundenanzahl und Modus)
const popupOverlayRunden = document.getElementById("popupOverlayRunden"); // Popup für Rundenanzahl-Auswahl
const popupOverlayModus = document.getElementById("popupOverlayModus"); // Popup für Modus-Auswahl (Auswahl oder Zufall)
const popupOverlayAuswahl = document.getElementById("popupOverlayAuswahl"); // Popup für den Auswahlmodus
const popupOverlayZufall = document.getElementById("popupOverlayZufall"); // Popup für den Zufallsmodus
const gameGrid = document.getElementById("gameGrid"); // Grid für die Anzeige der Spiele-Auswahl
const spieleSetzenBtn = document.getElementById("spieleSetzenBtn"); // Button zum Auswählen der Spiele (im Auswahlmodus)
const zufallSetzenBtn = document.getElementById("zufallSetzenBtn"); // Button zum Auswählen der Spiele (im Zufallsmodus)
const auswahlStatus = document.getElementById("auswahlStatus"); // Statusanzeige für die Spiele-Auswahl (im Auswahlmodus)
const zufallStatus = document.getElementById("zufallStatus"); // Statusanzeige für die Spiele-Auswahl (im Zufallsmodus)
const weiterBtn = document.getElementById("weiterBtn"); // Weiter-Button im Popup Runden (nach der Rundenanzahl-Auswahl gelangt man zur Modus-Auswahl)
const spieleAuswählenModusBtn = document.getElementById("spieleAuswählenModusBtn"); // Button zum Auswahlmodus
const zufälligModusBtn = document.getElementById("zufälligModusBtn"); // Button zum Zufallsmodus
const zurückBtn1 = document.getElementById("zurückBtn1"); // Zurück-Button im Popup Runden
const zurückBtn2 = document.getElementById("zurückBtn2"); // Zurück-Button im Popup Modus
const zurückBtn3 = document.getElementById("zurückBtn3"); // Zurück-Button im Popup Auswahlmodus
const zurückBtn4 = document.getElementById("zurückBtn4"); // Zurück-Button im Popup Zufallsmodus

// Start-Button
startBtn.addEventListener("click", () => {
starteSpiel();
});

// Spiel-Beenden-Button
spielBeendenBtn.addEventListener("click", async () => {
    fetch("https://kk-backend.vercel.app/reset?lobby=" + pin); // Reset-Endpoint aufrufen
    window.location.replace("../index.html"); // Zurück zur Startseite
    return;
});

// Reset-Button (Zurücksetzen der Spielauswahl)
resetBtn.addEventListener("click", () => {
    fetch(`https://kk-backend.vercel.app/changeNaechstesSpiel?lobby=${pin}&spielid[]=false`); // Leert die Spielauswahl
    resetBtn.style.display = "none"; // Reset-Button ausblenden
    modusWählenBtn.style.display = "flex"; // Modus-Wählen-Button anzeigen
    ladeWarteschlange(); // Warteschlange neu laden
});

// Popup-Overlays nur öffnen bzw. schließen, wenn der entsprechende Button gedrückt wird
// Runden
modusWählenBtn.addEventListener("click", () => {
    popupOverlayRunden.style.display = "flex";
});

// Modus
weiterBtn.addEventListener("click", () => {
        popupOverlayRunden.style.display = "none";
        popupOverlayModus.style.display = "flex";
});

// Auswahlmodus
spieleAuswählenModusBtn.addEventListener("click", () => {
    popupOverlayModus.style.display = "none";
    popupOverlayAuswahl.style.display = "flex";
    auswahlStatus.textContent = "";
    selectedGameIds = [];
    spieleSetzenBtn.disabled = true;
    renderGameGrid();
});

// Zufallsmodus
zufälligModusBtn.addEventListener("click", async () => {
    popupOverlayModus.style.display = "none";
    popupOverlayZufall.style.display = "flex";
    zufallStatus.textContent = "";
    selectedGameIds = [];
});

// Spiele-Setzen-Button
spieleSetzenBtn.addEventListener("click", async () => {
    if (!selectedGameIds.length) return;
    const params = selectedGameIds.map(id => `spielid[]=${id}`).join("&");
    try {
        const res = await fetch(`https://kk-backend.vercel.app/changeNaechstesSpiel?lobby=${pin}&${params}`); // Spiele-Setzen-Endpoint aufrufen
        if (res.ok) { // Wenn die Anfrage erfolgreich war
            auswahlStatus.textContent = "Spiele ausgesucht!"; // Meldung anzeigen
            popupOverlayAuswahl.style.display = "none"; // Auswahl-Popup schließen
            modusWählenBtn.style.display = "none"; // Modus-Wählen-Button ausblenden
            resetBtn.style.display = "flex"; // Reset-Button anzeigen
            startBtn.style.display = "flex"; // Start-Button anzeigen
            ladeWarteschlange(); // Warteschlange neu laden
        } else {
            auswahlStatus.textContent = "Fehler beim Setzen des Spiels."; // Fehlermeldung anzeigen
        }
    } catch (e) {
        auswahlStatus.textContent = "Fehler beim Setzen des Spiels."; // Fehlermeldung anzeigen
    }
});

// Zufallsmodus-Setzen-Button
zufallSetzenBtn.addEventListener("click", async () => {
    const zufallszahlen = getZufallszahlen();
    for (let i = 0; i < zufallszahlen.length; i++) {
        selectedGameIds.push(zufallszahlen[i]); // HIER wird das Spiel hinzugefügt
    }
    if(!selectedGameIds.length) return;
    const params = selectedGameIds.map(id => `spielid[]=${id}`).join("&");
    try {
        const res = await fetch(`https://kk-backend.vercel.app/changeNaechstesSpiel?lobby=${pin}&${params}`); // Zufallsmodus-Setzen-Endpoint aufrufen
        if (res.ok) { // Wenn die Anfrage erfolgreich war
            zufallStatus.textContent = "Spiele zufällig ausgewählt!"; // Meldung anzeigen
            popupOverlayZufall.style.display = "none"; // Zufalls-Popup schließen
            modusWählenBtn.style.display = "none"; // Modus-Wählen-Button ausblenden
            resetBtn.style.display = "flex"; // Reset-Button anzeigen
            startBtn.style.display = "flex"; // Start-Button anzeigen
            ladeWarteschlange(); // Warteschlange neu laden
        } else {
            zufallStatus.textContent = "Fehler beim zufälligen Auswählen der Spiele."; // Fehlermeldung anzeigen
        }
    } catch (e) {
        zufallStatus.textContent = "Fehler beim zufälligen Auswählen der Spiele."; // Fehlermeldung anzeigen
    }
});

// Zurück-Buttons
// Diese Buttons schließen die jeweiligen Popups und öffnen das vorherige Popup wieder
// Zurück zum Mainscreen
zurückBtn1.addEventListener("click", () => {
    popupOverlayRunden.style.display = "none";
});

//Zurück zu Runden
zurückBtn2.addEventListener("click", () => {
    popupOverlayModus.style.display = "none";
    popupOverlayRunden.style.display = "flex";
});

// Zurück zu Modus
zurückBtn3.addEventListener("click", () => {
    popupOverlayAuswahl.style.display = "none";
    popupOverlayModus.style.display = "flex";
});

// Zurück zu Modus)
zurückBtn4.addEventListener("click", () => { 
    popupOverlayZufall.style.display = "none";
    popupOverlayModus.style.display = "flex";
});

// Funktion um die Spieler in der Lobby anzuzeigen
async function ladeSpieler() {
    try {
        // Neuer Sammel-Endpoint für Lobbydaten
        const response = await fetch(`https://kk-backend.vercel.app/lobbyInfo?lobby=${pin}`);
        const data = await response.json();
        const liste = document.getElementById("spielerListe");
        liste.innerHTML = "";
        if (Array.isArray(data.players)) {
            data.players.forEach(spieler => {
                const el = document.createElement("div");
                el.className = "spieler";
                el.style.display = "flex";
                el.style.alignItems = "center";
                el.style.justifyContent = "space-between";
                el.style.gap = "0.5em";
                el.textContent = spieler;
                // Entfernen-Button (X)
                const removeBtn = document.createElement("button");
                removeBtn.title = "Spieler entfernen";
                removeBtn.style.background = "none";
                removeBtn.style.border = "none";
                removeBtn.style.color = "#b3261e";
                removeBtn.style.fontSize = "1.2em";
                removeBtn.style.cursor = "pointer";
                removeBtn.style.marginLeft = "0.5em";
                removeBtn.style.display = "flex";
                removeBtn.style.alignItems = "center";
                removeBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:1.2em;">close</span>';
                removeBtn.onclick = async (e) => {
                    e.stopPropagation();
                    if (confirm(`Soll "${spieler}" wirklich entfernt werden?`)) {
                        await fetch(`https://kk-backend.vercel.app/removePlayer?lobby=${pin}&spieler=${encodeURIComponent(spieler)}`);
                        ladeSpieler();
                    }
                };
                el.appendChild(removeBtn);
                liste.appendChild(el);
            });
        } else {
            liste.textContent = "Keine Spieler gefunden.";
        }
    } catch (err) {
        document.getElementById("spielerListe").textContent = "Fehler beim Laden.";
    }
}

// Warteschlange anzeigen
async function ladeWarteschlange() {
    try {
        const response = await fetch(`https://kk-backend.vercel.app/naechstesSpiel?lobby=${pin}`);
        const queue = await response.json();
        const content = document.getElementById("warteschlangeContent");
        if (Array.isArray(queue) && queue.length > 0) {
            // Mapping für Namen (optional)
            const spieleNamen = {
                1: "Pizza-Clicker",
                2: "Schere Stein Papier",
                3: "Memory+",
                4: "Asteroids",
                5: "Imposter",
                6: "Double or Nothing",
                7: "Gartic Phone V1",
            };
            content.innerHTML = queue.map((id, idx) =>
                `<span style="display:inline-block;margin:0 8px;padding:4px 10px;border-radius:8px;background:#333;font-weight:${idx===0?'bold':'normal'};color:${idx===0?'#ff6ec4':'#fff'};">
                    ${spieleNamen[id] || 'Spiel ' + id}
                </span>`
            ).join('');
        } else {
            content.textContent = "Keine Spiele ausgewählt.";
        }
    } catch (e) {
        document.getElementById("warteschlangeContent").textContent = "Fehler beim Laden der Spielauswahl.";
    }
}

// Funktion zur Überprüfung des Spielstatus
async function pruefeSpielGestartet() {
    try {
        // Neuer Sammel-Endpoint für Lobbydaten
        const response = await fetch(`https://kk-backend.vercel.app/lobbyInfo?lobby=${pin}`);
        const data = await response.json();
        if (data.gehtslos) {
            document.getElementById("startBtn").disabled = true;
            document.getElementById("startBtn").textContent = "Spiel läuft bereits";
        }
    } catch (err) {}
}

// Dynamisch Spielkarten erzeugen
function renderGameGrid() {
    gameGrid.innerHTML = "";
    spiele.forEach(spiel => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.dataset.id = spiel.id;
        card.innerHTML = `<img src="${spiel.img}" alt="${spiel.name}"><span>${spiel.name}</span>`;
        card.onclick = () => {
            const idx = selectedGameIds.indexOf(spiel.id); // Prüfen, ob das Spiel bereits ausgewählt ist
            if(idx === -1) { // Wenn nicht ausgewählt
                card.classList.add('selected'); // optisch hinzufügen
                selectedGameIds.push(spiel.id); // und ins Array einfügen
            } else { // Wenn bereits ausgewählt
                card.classList.remove('selected'); // optisch entfernen
                selectedGameIds.splice(idx, 1); // und aus dem Array entfernen
            }
            // Button aktivieren/deaktivieren, je nachdem ob so viele Spiele wie Runden ausgewählt sind oder nicht
            const rundenAnzahl = parseInt(runden.value, 10);
            if(!isNaN(rundenAnzahl) && selectedGameIds.length == rundenAnzahl) {
                spieleSetzenBtn.disabled = false;
            } else {
                spieleSetzenBtn.disabled = true;
                auswahlStatus.textContent = "Bitte wähle genau " + rundenAnzahl + " Spiele aus.";
            }
        };
        gameGrid.appendChild(card);
    });
}

// Funktion zum Starten des Spiels (Aufruf des Los-Gehts-Endpoints)
async function starteSpiel() {
    try {
        await fetch(`https://kk-backend.vercel.app/losGehts?lobby=${pin}`); // Los-Gehts-Endpoint aufrufen
    } catch (e) {}
    startBtn.style.display = "none"; // Start-Button ausblenden
    resetBtn.style.display = "none"; // Reset-Button ausblenden
}

// Die Funktionen müssen hier unten stehen, nicht an den Anfang des Codes packen, da die functions sonst auf Buttons zugreifen, die noch nicht initialisiert sind
renderGameGrid();
ladeSpieler();
pruefeSpielGestartet();
ladeWarteschlange();
// Initial laden und jede Sekunde aktualisieren
setInterval(() => {
    ladeSpieler();
    pruefeSpielGestartet();
    ladeWarteschlange();
}, 1000);

// Hilfsfunktionen
// Funktion zum Abrufen der PIN (ausgelager, da sie mehrfach benötigt wird)
function getPin() {
        const match = pinAnzeige.textContent.match(/\d+/);
        return match ? match[0] : "";
}

// Funktion zum Generieren einer Zufallszahl zwischen min und max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // Zufallszahl zwischen min und max generieren
}

// Funktion zum Generieren einer Liste von Zufallszahlen für den Zufallsmodus
function getZufallszahlen(){
    const rundenAnzahl = parseInt(runden.value, 10);
    const zufallszahlen = [];
    while (zufallszahlen.length < rundenAnzahl) {
        const zufallszahl = getRandomInt(1, spiele.length); // Zufallszahl zwischen 1 und der Anzahl der Spiele generieren
        if (!zufallszahlen.includes(zufallszahl)) { // Prüfen, ob die Zahl bereits ausgewählt wurde
            zufallszahlen.push(zufallszahl); // Wenn nicht, zur Liste hinzufügen
        }
    }
    return zufallszahlen; // Zufallszahlen zurückgeben
}


// Copy-Button Funktionalität für die PIN (Material Icon)
document.addEventListener("DOMContentLoaded", function() {
    const pinAnzeige = document.getElementById("pinAnzeige");
    const copyBtn = document.getElementById("copyPinBtn");
    const iconSpan = copyBtn.querySelector("span.material-symbols-outlined");
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

// Copy-Button Funktionalität für den Lobby-Link (Material Icon)
document.addEventListener("DOMContentLoaded", function() {
    const copyBtn = document.getElementById("copyLinkBtn");
    const iconSpan = copyBtn.querySelector("span.material-symbols-outlined");
    copyBtn.onclick = function() {
        const link = window.location.origin + "/index.html?pin=" + getPin();
        if (link) {
            navigator.clipboard.writeText(link);
            iconSpan.textContent = "check";
            copyBtn.style.background = "var(--md3-primary-container)";
            setTimeout(() => {
                iconSpan.textContent = "content_copy";
                copyBtn.style.background = "none";
            }, 1200);
        }
    };
});

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

// Button-Logik für "Nächstes Spiel auswählen" anpassen:
// Der Button soll IMMER sichtbar sein, daher alles entfernen:
// Prüfe, ob das Spiel gestartet wurde und blende den Button ein/aus
// let spielGestartetGlobal = false;
// async function pruefeObGameGestartetUndButton() { ... }
// setInterval(pruefeObGameGestartetUndButton, 1000);