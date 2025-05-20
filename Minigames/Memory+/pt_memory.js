const cards = document.getElementsByClassName("cards");
let aktuellAufgedeckteKarten = []; // Array für aktuell aufgedeckte Karten; array.length ist Zähler für aufgedeckte Karten
let punkte = 0; // Punktezähler
let timer = 10; // Timer für die Spielzeit
let richtigInFolge = 0; // Zählt richtige Paare in Folge

window.onload = function(){ // Funktion wird beim Laden der Seite aufgerufen
    Timer(); // Timer starten
    const KartenInfos = [ // Array mit Karteninformationen
        {wert: 1, bild: "Prototyp_Images/Karte_König.jpg"},
        {wert: 1, bild: "Prototyp_Images/Karte_König.jpg"},
        {wert: 2, bild: "Prototyp_Images/Karte_Dame.jpg"},
        {wert: 2, bild: "Prototyp_Images/Karte_Dame.jpg"},
        {wert: 3, bild: "Prototyp_Images/Karte_Bube.jpg"},
        {wert: 3, bild: "Prototyp_Images/Karte_Bube.jpg"},  
    ];
    shuffleArray(KartenInfos); // Karten Mischen
    for (let i = 0; i < cards.length; i++) {
        cards[i].KartenWert = KartenInfos[i].wert; // Wert der Karte zuweisen
        cards[i].KartenBild = KartenInfos[i].bild; // Bild der Karte zuweisen
        cards[i].src = "Prototyp_Images/Karte_Rückseite.jpg"; // Karte wird umgedreht (Rückseite)
        cards[i].aufgedeckt = false; // Karte ist nicht aufgedeckt
        KartenEntsperren(); // Karten werden zu Spielbeginn entsperrt
    }
    displayName(); // Namen der Spieler anzeigen
}

// Funktion, um die Karte aufzudecken
function KarteAufdecken(){
    this.src = this.KartenBild; // Bild der Karte anzeigen
    this.aufgedeckt = true; // Karte ist aufgedeckt
}

// Funktion, um die Karte zuzudecken
function KarteZudecken(){
    this.src = "Prototyp_Images/Karte_Rückseite.jpg"; // Rückseite anzeigen
    this.aufgedeckt = false; // Karte ist zugedeckt
}

// Funktion um die Karten zu vergleichen
function kartenVergleichen(){
    setTimeout(function(){ // Timeout für 1 Sekunde
        if(aktuellAufgedeckteKarten[0].KartenWert == aktuellAufgedeckteKarten[1].KartenWert){ // Wenn die Karten gleich sind
            aktuellAufgedeckteKarten[0].onclick = null; // Klick-Event-Listener entfernen
            aktuellAufgedeckteKarten[1].onclick = null; // Klick-Event-Listener entfernen
            richtigInFolge++; // Zähler für richtige Paare erhöhen
            let punkteErhoehen = 1;
            if(richtigInFolge >= 2){
                punkteErhoehen += 1; // Ab 2 richtigen Paaren in Folge: 1 Bonuspunkt mehr
                // "+1 Punkt" anzeigen
                const bonuspunkteDiv = document.getElementById("bonuspunkte");
                bonuspunkteDiv.textContent = "+1 Bonuspunkt";
                setTimeout(() => {
                    bonuspunkteDiv.textContent = "";
                }, 800); // Nach 0,8 Sekunden wieder ausblenden
            }
            punkte += punkteErhoehen; // Punkte erhöhen
            document.getElementById("punkte").innerHTML = "Punkte: " + punkte; // Punkte anzeigen
            timer += 1; // Timer um 1 Sekunde erhöhen
            document.getElementById("timer").innerHTML = "00:" + (timer < 10 ? "0" : "") + timer; // Timer-Anzeige aktualisieren

            // "+1s" anzeigen
            const timerPlus = document.getElementById("timerPlus");
            timerPlus.textContent = "+1s";
            setTimeout(() => {
                timerPlus.textContent = "";
            }, 800); // Nach 0,8 Sekunden wieder ausblenden
        }else{
            KarteZudecken.call(aktuellAufgedeckteKarten[0]); // Karte zudecken
            KarteZudecken.call(aktuellAufgedeckteKarten[1]); // Karte zudecken
            aktuellAufgedeckteKarten[0].classList.toggle("clicked"); // Animation für Umdrehen
            aktuellAufgedeckteKarten[1].classList.toggle("clicked"); // Animation für Umdrehen
            richtigInFolge = 0; // Bei Fehler den Zähler zurücksetzen
        }
        document.getElementById("streak").innerHTML = "Streak: " + richtigInFolge; // Streak anzeigen
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
            if (this.aufgedeckt == false && aktuellAufgedeckteKarten.length <2) { // Wenn die angeklickte Karte nicht aufgedeckt ist und weniger als 2 Karten aufgedeckt sind
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
            document.getElementById("timer").innerHTML = "00:0" + timer; // Zeit anzeigen
        }else{
            clearInterval(this); // Intervall stoppen
            KartenSperren(); // Karten sperren
            document.getElementById("timer").innerHTML = "Zeit abgelaufen"; // Zeit abgelaufen anzeigen
        }
    }, 1000); // Intervall von 1 Sekunde
}

// Funktion um die Namen der Spieler zu speichern
async function displayName() {
    try {
        // Hole den Namen des Spielers aus der API
        const response = await fetch('https://kk-backend.vercel.app/getAllPlayersOfLobby?lobby=' + localStorage.getItem("uic_gamepin"));
        const players = await response.json();

        //Liste für die Spieler
        const playerListContainer = document.getElementById("playerList");

        
        playerListContainer.innerHTML = "";

       
        players.forEach(player => {
            const playerElement = document.createElement("div");
            playerElement.textContent = player; 
            playerElement.className = "player"; 
            playerListContainer.appendChild(playerElement);
        });
    } catch (error) {
        console.error("Fehler die Spieler zu speichern:", error);
        displayName(); // Bei Fehler erneut versuchen
    }
};