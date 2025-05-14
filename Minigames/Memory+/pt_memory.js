const cards = document.getElementsByClassName("cards");

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