function fortfahren() {
    localStorage.setItem("uic_task1done", "true");
    window.location.assign("./System/game.html");
}
var clicks = 0;

function geklickt() {
    clicks++;
    if (clicks >= 100) {
        document.getElementById("pizza").style.visibility = "hidden";
        document.getElementById("fortfahren").style.visibility = "visible";
    }
}
var meter = document.querySelector("meter");
meter.value = clicks;
meter.max = 100;
setInterval(function() {
    meter.value = clicks;
}, 100);