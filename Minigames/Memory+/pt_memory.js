const cards = document.getElementsByClassName("cards");
window.onload = function(){
    const KartenInfos = [
        {wert: 1, bild: "Prototyp_Images/Karte_König.jpg"},
        {wert: 2, bild: "Prototyp_Images/Karte_Dame.jpg"},
        {wert: 3, bild: "Prototyp_Images/Karte_Bube.jpg"},
        {wert: 1, bild: "Prototyp_Images/Karte_König.jpg"},
        {wert: 2, bild: "Prototyp_Images/Karte_Dame.jpg"},
        {wert: 3, bild: "Prototyp_Images/Karte_Bube.jpg"},  
    ];
    shuffleArray(KartenInfos); // Karten Mischen
    for (let i = 0; i < cards.length; i++) {
        cards[i].KartenWert = KartenInfos[i].wert; // Kartenwert zuweisen
        cards[i].KartenBild = KartenInfos[i].bild; // Bild der Karte zuweisen
        cards[i].src = "Prototyp_Images/Karte_Rückseite.jpg"; // Karten werden umgedreht (Rückseite)
        cards[i].aufgedeckt = false; // Karten sind nicht aufgedeckt
        
        cards[i].onclick = function () { // Loop durch jede Karte und füge einen Klick-Event-Listener hinzu
            this.classList.toggle("clicked"); // Hingefügte Klasse "clicked" für Animation
        if (this.aufgedeckt == false) { // Überprüfen, ob die Karte aufgedeckt ist
            KarteAufdecken.call(this); // Funktion aufrufen, um die Karte aufzudecken
        } else {
            KarteZudecken.call(this); // Funktion aufrufen, um die Karte zuzudecken
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