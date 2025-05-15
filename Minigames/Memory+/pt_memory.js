const cards = document.getElementsByClassName("cards");
window.onload = function(){
    KartenMischen(); // Karten werden zu Beginn gemischt
}

// Loop durch jede Karte
// und füge einen Klick-Event-Listener hinzu
for (let i = 0; i < cards.length; i++) {
    cards[i].onclick = function () {
        // Hingefügte Klasse "clicked" für Animation
        // und um die Karte zu markieren
        this.classList.toggle("clicked");

        // Checken ob die Karte bereits aufgedeckt ist
        if (this.src.includes("Prototyp_Images/Bc.jpg")) {
            this.src = "Prototyp_Images/Vc.png"; // Wechsel zu Vc.png (zweite Karte)
        } else {
            this.src = "Prototyp_Images/Bc.jpg"; // Wechsel zu Bc.jpg (erste Karte)
        }
    }; 
}

// Funktion um die Karten zu mischen
function KartenMischen(){
    let Tabelle = document.getElementById("gameTable");
    const cardElements = Array.from(Tabelle.getElementsByClassName("cards")); // Alle Karten sammeln
    shuffleArray(cardElements); // Karten mischen
    const kartenProZeile = 3; // Anzahl der Karten pro Zeile
    const zeilenAnzahl = Math.ceil(cardElements.length / kartenProZeile); // Anzahl der Zeilen
    Tabelle.innerHTML = ""; // Tabelle leeren
    for (let i = 0; i < zeilenAnzahl; i++) {
        const zeile = document.createElement("tr"); // Neue Zeile erstellen
        for (let j = 0; j < kartenProZeile; j++) {
            const index = i * kartenProZeile + j; // Index der Karte
            if (index < cardElements.length) {
                const zelle = document.createElement("td"); // Neue Zelle erstellen
                zelle.appendChild(cardElements[index]); // Karte zur Zelle hinzufügen
                zeile.appendChild(zelle); // Zelle zur Zeile hinzufügen
            }
        }
        Tabelle.appendChild(zeile); // Zeile zur Tabelle hinzufügen
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