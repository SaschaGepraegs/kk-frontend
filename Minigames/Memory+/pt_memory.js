const cards = document.getElementsByClassName("cards");
let aktuellAufgedeckteKarten = []; // Array für aktuell aufgedeckte Karten; array.length ist Zähler für aufgedeckte Karten
let punkte = 0; // Punktezähler
let timer = 25; // Timer für die Spielzeit
let streak = 0; // Zählt richtige Paare in Folge

window.onload = spielStarten; // Funktion wird beim Laden der Seite aufgerufen

function spielStarten(){ // Funktion, die das Spiel startet
    punkte = 0; // Punkte zurücksetzen
    timer = 25; // Timer zurücksetzen
    streak = 0; // Streak zurücksetzen
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
}

// Funktion, um die Karte aufzudecken
function KarteAufdecken(){
    this.src = this.KartenBild; // Bild der Karte anzeigen
    this.aufgedeckt = true; // Karte ist aufgedeckt
}

// Funktion, um die Karte zuzudecken
function KarteZudecken(){
    this.src = "Prototyp_Images/Karte_Rückseite_Memory.jpg"; // Rückseite anzeigen
    this.aufgedeckt = false; // Karte ist zugedeckt
}

// Funktion um die Karten zu vergleichen
function kartenVergleichen(){
    setTimeout(function(){ // Timeout für 1 Sekunde
        if(aktuellAufgedeckteKarten[0].KartenWert == aktuellAufgedeckteKarten[1].KartenWert){ // Wenn die Karten gleich sind
            aktuellAufgedeckteKarten[0].onclick = null; // Klick-Event-Listener entfernen
            aktuellAufgedeckteKarten[1].onclick = null; // Klick-Event-Listener entfernen
            aktuellAufgedeckteKarten[0].classList.add("found");
            aktuellAufgedeckteKarten[1].classList.add("found");
            setTimeout(() => {
                aktuellAufgedeckteKarten[0].style.visibility = "hidden";
                aktuellAufgedeckteKarten[1].style.visibility = "hidden";
            }, 700);
            punkte+=25; // Punkte erhöhen
            Streak(); // Streak erhöhen
            document.getElementById("punkte").textContent = "Punkte: " + punkte; // Punkte anzeigen
            timer += 1; // Timer um 1 Sekunde erhöhen
            document.getElementById("timer").textContent = "00:" + (timer < 10 ? "0" : "") + timer; // Timer-Anzeige aktualisieren
            document.getElementById("timerPlus").textContent = "+1s"; // "+1s" anzeigen
            setTimeout(() => {timerPlus.textContent = "";}, 800); // Nach 0,8 Sekunden wieder ausblenden
        }else{
            KarteZudecken.call(aktuellAufgedeckteKarten[0]); // Karte zudecken
            KarteZudecken.call(aktuellAufgedeckteKarten[1]); // Karte zudecken
            aktuellAufgedeckteKarten[0].classList.toggle("clicked"); // Animation für Umdrehen
            aktuellAufgedeckteKarten[1].classList.toggle("clicked"); // Animation für Umdrehen
            streak = 0; // Bei Fehler den Zähler zurücksetzen
        }
        document.getElementById("streak").innerHTML = "Streak: " + streak; // Streak anzeigen
        aktuellAufgedeckteKarten = []; // Array der aktuell aufgedeckten Karten zurücksetzen
    }, 1000); // Timeout von 1 Sekunde
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
                this.classList.toggle("clicked"); //Animation für Umdrehen
                aktuellAufgedeckteKarten.push(this); // Karte in das Array der aktuell aufgedeckten Karten hinzufügen
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
    setInterval(function(){ // Intervall für den Timer
        if(timer > 0){ // Wenn der Timer größer als 0 ist
            timer--; // Timer um 1 Sekunde verringern
            document.getElementById("timer").innerHTML = "00:" +(timer < 10? "0" : "") + timer; // Zeit anzeigen
        }else{
            clearInterval(this); // Intervall stoppen
            KartenSperren(); // Karten sperren
            document.getElementById("timer").innerHTML = "Zeit abgelaufen"; // Zeit abgelaufen anzeigen
            spielBeenden(); // Spiel beenden
        }
    }, 1000); // Intervall von 1 Sekunde
}

// Funktion für den Streak
function Streak(){
    streak++; // Zähler für richtige Paare erhöhen
    if(streak >= 2){
        punkte+=streak*5; // Ab 2 richtigen Paaren in Folge: 1 Bonuspunkt mehr
        document.getElementById("bonuspunkte").textContent = "+1 Bonuspunkt"; // "+1 Bonuspunkt" anzeigen
        setTimeout(() => {document.getElementById("bonuspunkte").textContent = "";}, 800); // Nach 0,8 Sekunden wieder ausblenden
    }
}

//Funktion, die nach Ende des Spiels aufgerufen wird
async function spielBeenden() {
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