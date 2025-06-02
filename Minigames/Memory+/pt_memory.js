const cards = document.getElementsByClassName("cards");
let aktuellAufgedeckteKarten = []; // Array für aktuell aufgedeckte Karten; array.length ist Zähler für aufgedeckte Karten
let punkte; // Punktezähler
let timer; // Timer für die Spielzeit
let streak; // Zählt richtige Paare in Folge
let aufgedeckteKarten; // Zählt die aufgedeckten Karten
const KartenGeräusch = new Audio("Sounds/Karten_Geräusch.mp3"); // Geräusch für das Aufdecken der Karten
var LobbyStatus;
let timerInterval; // NEU: Intervall-ID speichern
let spielBeendet = false; // NEU: Flag für Spielende
let lobbystatusvar

window.onload = spielStarten; // Funktion wird beim Laden der Seite aufgerufen
 
// Funktion, um verschiedene Variablen zurückzusetzen
function reset(){
    punkte = 0; // Punkte zurücksetzen
    timer = 25; // Timer zurücksetzen
    if(localStorage.getItem("uic_status")== "test"){ //Testoberfläche
        timer = 99999999;
    }
    streak = 0; // Streak zurücksetzen
    aufgedeckteKarten = 0; // Aufgedeckte Karten zurücksetzen
    spielBeendet = false; // NEU: Flag zurücksetzen
    if (timerInterval) {
        clearInterval(timerInterval); // NEU: Vorherigen Timer stoppen
    }
}

async function spielStarten(){ // Funktion, die das Spiel startet
    reset(); // Reset-Funktion aufrufen
    Timer(); // Timer starten
    const KartenInfos = [ // Array mit Karteninformationen
        {wert: 1, bild: "Prototyp_Images/Karte_Eule.jpg"},
        {wert: 1, bild: "Prototyp_Images/Karte_Eule.jpg"},
        {wert: 2, bild: "Prototyp_Images/Karte_Fisch.jpg"},
        {wert: 2, bild: "Prototyp_Images/Karte_Fisch.jpg"},
        {wert: 3, bild: "Prototyp_Images/Karte_Hase.jpg"},
        {wert: 3, bild: "Prototyp_Images/Karte_Hase.jpg"},
        {wert: 4, bild: "Prototyp_Images/Karte_Koala.jpg"},
        {wert: 4, bild: "Prototyp_Images/Karte_Koala.jpg"},
        {wert: 5, bild: "Prototyp_Images/Karte_Panda.jpg"},
        {wert: 5, bild: "Prototyp_Images/Karte_Panda.jpg"},
        {wert: 6, bild: "Prototyp_Images/Karte_Papagei.jpg"},
        {wert: 6, bild: "Prototyp_Images/Karte_Papagei.jpg"},
        {wert: 7, bild: "Prototyp_Images/Karte_Pinguin.jpg"},
        {wert: 7, bild: "Prototyp_Images/Karte_Pinguin.jpg"},
        {wert: 8, bild: "Prototyp_Images/Karte_Schildkröte.jpg"},
        {wert: 8, bild: "Prototyp_Images/Karte_Schildkröte.jpg"},
    ];
    shuffleArray(KartenInfos); // Karten Mischen
    for (let i = 0; i < cards.length; i++) {
        cards[i].KartenWert = KartenInfos[i].wert; // Wert der Karte zuweisen
        cards[i].KartenBild = KartenInfos[i].bild; // Bild der Karte zuweisen
        cards[i].src = "Prototyp_Images/Karte_Rückseite_Memory.jpg"; // Karte wird umgedreht (Rückseite)
        cards[i].aufgedeckt = false; // Karte ist nicht aufgedeckt
    }
    KartenEntsperren(); // Karten werden zu Spielbeginn entsperrt
    displayName(); // Namen der Spieler anzeigen
    checkLobby(); // Erster Check sofort
    setInterval(checkLobby, 5000); // Alle 5 Sekunden erneut prüfen
}

// Funktion, um die Karte aufzudecken
function KarteAufdecken(){
    this.aufgedeckt = true; // Karte ist aufgedeckt
    aktuellAufgedeckteKarten.push(this); // Karte in das Array der aktuell aufgedeckten Karten hinzufügen
    this.classList.toggle("clicked"); // Animation für das Aufdecken
    setTimeout(() => {this.src = this.KartenBild; // Bild der Karte anzeigen
    }, 250); // aber erst nach Hälfte der css-Animation (0,25s)    
    KartenGeräusch.currentTime = 0.35; // Geräusch auf 0,35s setzen
    KartenGeräusch.play(); // Geräusch abspielen
}

// Funktion, um die Karte zuzudecken
function KarteZudecken(){
    this.aufgedeckt = false; // Karte ist zugedeckt
    this.classList.toggle("clicked"); // Animation für das Zudecken
    setTimeout(() => {this.src = "Prototyp_Images/Karte_Rückseite_Memory.jpg"; // Rückseite anzeigen
    }, 100); // aber erst nach einem Drittel der css-Animation (0,1s)
    KartenGeräusch.currentTime = 0.4; // Geräusch auf 0,35s setzen
    KartenGeräusch.play(); // Geräusch abspielen
}

// Funktion um die Karten zu vergleichen
function kartenVergleichen(){
    KartenSperren(); // Karten sperren, solange Animation läuft!
    setTimeout(function(){
        if(aktuellAufgedeckteKarten[0].KartenWert == aktuellAufgedeckteKarten[1].KartenWert){
            aktuellAufgedeckteKarten[0].onclick = null; // Klick-Event-Listener ausschalten
            aktuellAufgedeckteKarten[1].onclick = null; // Klick-Event-Listener ausschalten
            aktuellAufgedeckteKarten[0].classList.add("found"); // css-Klasse "found" für die gefundene Karten hinzufügen,
            aktuellAufgedeckteKarten[1].classList.add("found"); // dadurch wird css-Animation "found" aktiviert
            setTimeout(() => {
                aktuellAufgedeckteKarten[0].style.visibility = "hidden"; // Karte ausblenden
                aktuellAufgedeckteKarten[1].style.visibility = "hidden"; // Karte ausblenden
                aktuellAufgedeckteKarten = []; // Array der aktuell aufgedeckten Karten leeren
                KartenEntsperren(); // Karten wieder entsperren
            },  300); // aber erst nach der css-Animation (0,3 s) ausblenden
            punkte+=25; // Punkte erhöhen
            Streak(); // Streak erhöhen (und eventuell Bonuspunkte vergeben)
            document.getElementById("punkte").textContent = "Punkte: " + punkte; // Punkte anzeigen
            timer += 1; // Timer um 1 Sekunde erhöhen
            document.getElementById("timer").textContent = "00:" + (timer < 10 ? "0" : "") + timer; // Timer anzeigen
            document.getElementById("timerPlus").textContent = "+1s"; // "+1s" anzeigen
            setTimeout(() => {timerPlus.textContent = "";}, 800); // Nach 0,8 Sekunden wieder ausblenden
            aufgedeckteKarten += 2; // Zähler für aufgedeckte Karten erhöhen
            if(aufgedeckteKarten == cards.length){ // Wenn alle Karten aufgedeckt sind
                spielBeenden(); // Spiel beenden
            }
        }else{
            KarteZudecken.call(aktuellAufgedeckteKarten[0]);
            KarteZudecken.call(aktuellAufgedeckteKarten[1]);
            streak = 0;
            setTimeout(() => {
                aktuellAufgedeckteKarten = [];
                KartenEntsperren();
            }, 300); // Zeit für das Zudecken / css-Animation (0,3s)
        }
        document.getElementById("streak").innerHTML = "Streak: " + streak;
    }, 600); // Zeit, wie lange beide Karten offen bleiben
}

// Funktion um die Karten zu sperren
function KartenSperren(){
    for (let i = 0; i < cards.length; i++) { // Loop durch alle Karten
        cards[i].onclick = null; // Klick-Event-Listener entfernen
    }
}

// Funktion um die Karten zu entsperren
function KartenEntsperren(){
    for(let i =0; i<cards.length; i++){ // Loop durch alle Karten
        cards[i].onclick = function () { // Klick-Event-Listener hinzufügen
            if(this.aufgedeckt == false && aktuellAufgedeckteKarten.length <2) { // Wenn die angeklickte Karte nicht aufgedeckt ist und weniger als 2 Karten aufgedeckt sind
                KarteAufdecken.call(this); // Karte aufdecken
                if(aktuellAufgedeckteKarten.length == 2){ // Wenn 2 Karten aufgedeckt sind
                    kartenVergleichen(); // Karten vergleichen
                }
            }else{
                return; // Wenn die Karte bereits aufgedeckt ist, nichts tun
            }
        };
    }
}

// Funktion um ein Array zu mischen
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
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
            KartenSperren();
            spielBeenden();
            document.getElementById("timer").innerHTML = "Zeit abgelaufen";
        }
    }, 1000);
}

// Funktion für den Streak
function Streak(){
    streak++; // Zähler für richtige Paare erhöhen
    if(streak >= 2){
        let bonus = streak*5;
        punkte+=bonus; // Ab 2 richtigen Paaren in Folge: Bonuspunkte
        document.getElementById("bonuspunkte").textContent = "+"+ bonus +" Punkte"; // "+... Punkte" anzeigen
        setTimeout(() => {document.getElementById("bonuspunkte").textContent = "";}, 800); // Nach 0,8 Sekunden wieder ausblenden
    }
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
        await fetch(`https://kk-backend.vercel.app/addPointsToPlayer?lobby=${localStorage.getItem("uic_gamepin")}&spieler=${localStorage.getItem("uic_username")}&punkte=${punkte}`,);
        setTimeout(() => {window.location.replace("/System/pause.html");}, 3000); // Nach 3 Sekunden auf die Pause-Seite weiterleiten
    } catch (e) {
        alert("Fehler beim Übertragen der Punkte!");
        setTimeout(() => {window.location.replace("/System/pause.html");}, 3000); // Nach 3 Sekunden auf die Pause-Seite weiterleiten
    }
}

async function checkLobby() {
    const status = await LobbyStatus();
    if (status == "off") {
        console.log("Lobby ist geschlossen oder nicht gefunden");
        window.location.assign("./index.html");
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