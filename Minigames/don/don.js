document.addEventListener("DOMContentLoaded", async () => {
    const lobby = localStorage.getItem("uic_gamepin");
    const spieler = localStorage.getItem("uic_username");
    let punkte = 0;
    let name = "";

    async function ladeSpielerInfo() {
        const res = await fetch(`https://kk-backend.vercel.app/playerInfo?lobby=${lobby}&spieler=${spieler}`);
        const data = await res.json();
        punkte = data.punkte ?? 0;
        name = data.name ?? "";
        document.getElementById("spielerName").textContent = `Spieler: ${name}`;
        document.getElementById("punkteStand").textContent = `Punkte: ${punkte}`;
    }

    // Timer-Logik
    const timerDuration = 30; // Sekunden
    let timeLeft = timerDuration;
    const timerBar = document.getElementById("timerBar");
    const timerText = document.getElementById("timerText");

    function updateTimerUI() {
        timerText.textContent = `Zeit: ${timeLeft}s`;
        timerBar.style.width = `${(timeLeft / timerDuration) * 100}%`;
    }

    updateTimerUI();

    const timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            window.location.href = "/System/pause.html";
        }
    }, 1000);

    await ladeSpielerInfo();

    const nachrichtFeld = document.getElementById("nachrichtFeld");

    document.getElementById("donForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const einsatz = parseInt(document.getElementById("einsatz").value, 10);
        if (isNaN(einsatz) || einsatz < 1) {
            nachrichtFeld.textContent = "Bitte gib einen gültigen Einsatz ein.";
            return;
        }
        if (einsatz > punkte) {
            nachrichtFeld.textContent = "Du hast nicht genug Punkte!";
            return;
        }
        // 50/50 Entscheidung
        const gewonnen = Math.random() < 0.5; // 50% Chance zu gewinnen
        let punkteDiff = gewonnen ? einsatz : -einsatz; // Punkte anpassen: wenn gewonnen, dann +Einsatz, wenn verloren, dann -Einsatz
        let neuerPunktestand = punkte + punkteDiff; // neuen Punktestand berechnen
        if (gewonnen) {
            nachrichtFeld.textContent = `Gewonnen! Neuer Punktestand: ${neuerPunktestand}`;
        } else {
            nachrichtFeld.textContent = `Verloren! Neuer Punktestand: ${neuerPunktestand}`;
        }
        // Punkte im Backend aktualisieren
        await fetch(`https://kk-backend.vercel.app/addPointsToPlayer?lobby=${lobby}&spieler=${spieler}&punkte=${punkteDiff}`);
        // Punktestand neu laden
        await ladeSpielerInfo();
    });
});