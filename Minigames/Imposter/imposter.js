// Beispielwortliste
const words = [
    "Banane", "Pyramide", "Schneemann", "Kaktus", "Brille", "Känguru", "Schokolade", "Gitarre", "Rakete", "Kuh"
];

// Spieleranzahl automatisch holen
async function getPlayerCount() {
    const lobbycode = localStorage.getItem("uic_gamepin");
    if (!lobbycode) {
        alert("Kein Lobbycode gefunden!");
        return 0;
    }
    const res = await fetch(`https://kk-backend.vercel.app/getAllPlayersOfLobby?lobby=${lobbycode}`);
    const arr = await res.json();
    return Array.isArray(arr) ? arr.length : 0;
}

async function startImposter() {
    const playerCount = await getPlayerCount();
    if (playerCount < 3) {
        alert("Mindestens 3 Spieler benötigt!");
        return;
    }
    let playerNumber = 0;
    while (playerNumber < 1 || playerNumber > playerCount || isNaN(playerNumber)) {
        playerNumber = parseInt(prompt(`Wer bist du? (Spieler 1 bis ${playerCount})`));
    }
    // Imposter bestimmen (für alle gleich, damit alle dieselbe Info bekommen)
    let imposterNumber = localStorage.getItem("imposterNumber");
    if (!imposterNumber) {
        imposterNumber = Math.floor(Math.random() * playerCount) + 1;
        localStorage.setItem("imposterNumber", imposterNumber);
    } else {
        imposterNumber = parseInt(imposterNumber);
    }
    // Gemeinsames Wort wählen (für alle gleich)
    let chosenWord = localStorage.getItem("imposterWord");
    if (!chosenWord) {
        chosenWord = words[Math.floor(Math.random() * words.length)];
        localStorage.setItem("imposterWord", chosenWord);
    }

    document.getElementById("showWordBtn").addEventListener("click", () => {
        document.getElementById("showWordBtn").style.display = "none";
        document.getElementById("infoText").style.display = "none";
        const wordCard = document.getElementById("wordCard");
        wordCard.style.display = "block";
        if (playerNumber === imposterNumber) {
            document.getElementById("wordText").textContent = "Du bist der Imposter!";
            wordCard.style.background = "#ffcdd2";
            wordCard.style.color = "#c62828";
        } else {
            document.getElementById("wordText").textContent = chosenWord;
            wordCard.style.background = "#e3f2fd";
            wordCard.style.color = "#1976d2";
        }
    });
}

startImposter();
