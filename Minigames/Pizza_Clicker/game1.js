function fortfahren() {
    localStorage.setItem("uic_task1done", "true");
    window.location.assign("/System/pause.html");
}
var clicks = 0;

function geklickt() {
    clicks++;
    if (clicks >= 100) {
        fortfahren();
    }
}
var meter = document.querySelector("meter");
meter.value = clicks;
meter.max = 100;
setInterval(function() {
    meter.value = clicks;
}, 100);