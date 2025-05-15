const cards = document.getElementsByClassName("cards");

// Listener um die Namen der Spieler zu laden
document.addEventListener("DOMContentLoaded", function () {
    displayName();
});


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