const cards = document.getElementsByClassName("cards");
let aktuellAufgedeckteKarten = []; // Array für aktuell aufgedeckte Karten; array.length ist Zähler für aufgedeckte Karten
window.onload = function(){
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
        cards[i].KartenWert = KartenInfos[i].wert; // Kartenwert zuweisen
        cards[i].KartenBild = KartenInfos[i].bild; // Bild der Karte zuweisen
        cards[i].src = "Prototyp_Images/Karte_Rückseite.jpg"; // Karte wird umgedreht (Rückseite)
        cards[i].aufgedeckt = false; // Karte ist nicht aufgedeckt
        
        cards[i].onclick = function () { // Loop durch jede Karte und füge einen Klick-Event-Listener hinzu
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

//Funktionen "KarteAufdecken" und "Karte Zudecken" sind ausgelagert, um späteren Spielmechanismus zu vereinfachen
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
        }else{
                    KarteZudecken.call(aktuellAufgedeckteKarten[0]); // Karte zudecken
                    KarteZudecken.call(aktuellAufgedeckteKarten[1]); // Karte zudecken
                    aktuellAufgedeckteKarten[0].classList.toggle("clicked"); // Animation für Umdrehen
                    aktuellAufgedeckteKarten[1].classList.toggle("clicked"); // Animation für Umdrehen
        }
        aktuellAufgedeckteKarten = []; // Array der aktuell aufgedeckten Karten zurücksetzen
    }, 1000); // Timeout von 1 Sekunde
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
    }
};