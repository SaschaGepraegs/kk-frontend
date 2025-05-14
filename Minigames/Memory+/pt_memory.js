const cards = document.getElementsByClassName("cards");

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

async function displayName() {
    try {
        // Fetch the list of players from the backend
        const response = await fetch('https://kk-backend.vercel.app/getPlayers?lobby=' + localStorage.getItem("uic_gamepin"));
        const players = await response.json();

        // Find the container where player names will be displayed
        const playerListContainer = document.getElementById("playerList");

        // Clear any existing content
        playerListContainer.innerHTML = "";

        // Loop through the players and add them to the container
        players.forEach(player => {
            const playerElement = document.createElement("div");
            playerElement.textContent = player; // Set the player's name
            playerElement.className = "player"; // Optional: Add a class for styling
            playerListContainer.appendChild(playerElement);
        });
    } catch (error) {
        console.error("Error fetching players:", error);
    }
}