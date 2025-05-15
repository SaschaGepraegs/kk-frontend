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

        /* Checken ob die Karte bereits aufgedeckt ist
        if (this.src.includes("Prototyp_Images/Karte_König")) {
            this.src = "Prototyp_Images/Karte_Rückseite"; // Wechsel zu Vc.png (zweite Karte)
        } else if(this.src.includes("Prototyp_Images/Karte_Dame")) {
            this.src = "Prototyp_Images/Karte_Rückseite"; // Wechsel zu Bc.jpg (erste Karte)
        }else{
            this.src = "Prototyp_Images/Karte_König";
        }
            */
    };
}

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

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}