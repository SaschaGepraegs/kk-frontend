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

    await ladeSpielerInfo();

    document.getElementById("donForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const einsatz = parseInt(document.getElementById("einsatz").value, 10);
        if (isNaN(einsatz) || einsatz < 1) {
            alert("Bitte gib einen gültigen Einsatz ein.");
            return;
        }
        if (einsatz > punkte) {
            alert("Du hast nicht genug Punkte!");
            return;
        }
        // 50/50 Entscheidung
        const gewonnen = Math.random() < 0.5;
        let neuerPunktestand;
        if (gewonnen) {
            neuerPunktestand = punkte + einsatz;
            alert(`Gewonnen! Neuer Punktestand: ${neuerPunktestand}`);
        } else {
            neuerPunktestand = punkte - einsatz;
            alert(`Verloren! Neuer Punktestand: ${neuerPunktestand}`);
        }
        // Optional: Punkte lokal aktualisieren
        punkte = neuerPunktestand;
        document.getElementById("punkteStand").textContent = `Punkte: ${punkte}`;
    });
});