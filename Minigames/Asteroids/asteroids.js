let punkte;
window.onload = reset();
function reset() {
    punkte = 10;
}
const hier = document.getElementById("hier");
const momentle = document.getElementById("momentle");

hier.addEventListener("click", () => {
    spielBeenden();
    hier.disabled = true;
    momentle.style.display="flex";
});

async function spielBeenden() {
    // Lobby und Spielername aus localStorage herholen
    const lobby = localStorage.getItem("uic_gamepin") || "1111";
    const username = localStorage.getItem("uic_username") || "Name";

    try {
        await fetch(`https://kk-backend.vercel.app/addPointsToPlayer?lobby=${lobby}&spieler=${username}&punkte=${punkte}`);
        setTimeout(() => {window.location.assign("/System/pause.html");}, 3000);
    } catch (e) {
        alert("Fehler beim Übertragen der Punkte!");
        setTimeout(() => {window.location.assign("/System/pause.html");}, 3000);
    }
}