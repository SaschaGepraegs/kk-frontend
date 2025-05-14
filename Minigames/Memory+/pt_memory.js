const cards = document.getElementsByClassName("cards");

// Loop through each card and attach the click event
for (let i = 0; i < cards.length; i++) {
    cards[i].onclick = function () {
        // Check if the image source includes "Bc.jpg"
        if (this.src.includes("Prototyp_Images/Bc.jpg")) {
            this.src = "Prototyp_Images/Vc.png"; // Change to the other image
        } else {
            this.src = "Prototyp_Images/Bc.jpg"; // Revert back to the original image
        }
    };
}