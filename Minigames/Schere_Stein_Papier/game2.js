function fortfahren() {
    localStorage.setItem("uic_task1done", "true");
    window.location.assign("/System/pause.html");
}
var AnzahlGewonnen = 0;
var timer = 30;
var Warte = 1;
var intervalId = null;
var timerId = null;
var meter = document.querySelector("meter");
meter.value = timer;
meter.max = 30; // Optional: max kann beliebig sein, dient nur der Anzeige


function startGame() {
    intervalId = setInterval(function() {
        // Optional: Meter kann für Klicks genutzt werden
        meter.value = timer;
    }, 100);

    timerId = setInterval(function() {
        timer--;
        meter.value = timer;
        if (timer <= 0) {
            clearInterval(intervalId);
            clearInterval(timerId);
            spielBeenden();
        }
    }, 1000);
}

async function spielBeenden() {
    // Lobby und Spielername aus localStorage holen
    const lobby = localStorage.getItem("uic_gamepin") || "1111";
    const player = localStorage.getItem("uic_name") || "Name";
    try {
        await fetch(`https://kk-backend.vercel.app/addPointsToPlayer?lobby=${localStorage.getItem("uic_gamepin")}&spieler=${localStorage.getItem("uic_username")}&punkte=${AnzahlGewonnen * 60}`,);
        window.location.assign("/System/pause.html");
    } catch (e) {
        alert("Fehler beim Übertragen der Punkte!");
        window.location.assign("/System/pause.html");
    }
}

// Spielstart nach Laden der Seite
window.onload = startGame;

function Timerabwarten(){
    Warte = 0;
}


function Schere() {
    let x = Math.floor(Math.random() * 3) + 1;
              
    if (x === 1 && Warte === 0) {
        document.getElementById("Stein").style.visibility = "hidden";
        document.getElementById("Stein1").style.visibility = "hidden";
        document.getElementById("Schere").style.visibility = "visible";
        document.getElementById("Papier1").style.visibility = "visible";
        
        AnzahlGewonnen++;
        }
    else if (x === 2 && Warte === 0) {
        document.getElementById("Stein").style.visibility = "hidden";
        document.getElementById("Stein1").style.visibility = "hidden";
        document.getElementById("Schere").style.visibility = "visible";
        document.getElementById("Schere1").style.visibility = "visible";
        }
    else if (x === 3 && Warte === 0) {
        document.getElementById("Stein").style.visibility = "hidden";
        document.getElementById("Schere").style.visibility = "visible";
        document.getElementById("Stein1").style.visibility = "visible";}
        Warte = 1;
        setTimeout(MachAufAnfangJetztAlter,1500);
        if(Warte = 1){
            setTimeout(Timerabwarten,1500);
        }
    }
    
        function Papier() {
            let x = Math.floor(Math.random() * 3) + 1;
                
                if (x === 1 && Warte === 0) {
                    document.getElementById("Stein").style.visibility = "hidden";
                    document.getElementById("Papier").style.visibility = "visible";
                    document.getElementById("Stein1").style.visibility = "visible";
                    AnzahlGewonnen++;
                }
                if (x === 2 && Warte === 0) {
                    document.getElementById("Stein").style.visibility = "hidden";
                    document.getElementById("Stein1").style.visibility = "hidden";
                    document.getElementById("Papier").style.visibility = "visible";
                    document.getElementById("Papier1").style.visibility = "visible";
                }
                 if (x === 3 && Warte === 0) {
                    document.getElementById("Stein").style.visibility = "hidden";
                    document.getElementById("Stein1").style.visibility = "hidden";
                    document.getElementById("Papier").style.visibility = "visible";
                    document.getElementById("Schere1").style.visibility = "visible";
        }
        Warte = 1;
        setTimeout(MachAufAnfangJetztAlter,1500);
        if(Warte = 1){
            setTimeout(Timerabwarten,1500);
        }
    }

        function Stein(){
            let x = Math.floor(Math.random() * 3) + 1;
            Warte = 0;
                
                if (x === 1 && Warte === 0) {
                    document.getElementById("Stein1").style.visibility = "hidden";
                    document.getElementById("Stein").style.visibility = "visible";
                    document.getElementById("Schere1").style.visibility = "visible";
                    
                    AnzahlGewonnen++;
                }
                if (x === 2 && Warte === 0) {
                    document.getElementById("Stein").style.visibility = "visible";
                    document.getElementById("Stein1").style.visibility = "visible";
                }
                 if (x === 2 && Warte === 0) {
                    document.getElementById("Stein1").style.visibility = "hidden";
                    document.getElementById("Stein").style.visibility = "visible";
                    document.getElementById("Papier1").style.visibility = "visible";
        }
        Warte = 1;
        setTimeout(MachAufAnfangJetztAlter,1500);
        Warte = 0;
        
    }


    function MachAufAnfangJetztAlter(){
        document.getElementById("Stein1").style.visibility = "visible ";
        document.getElementById("Stein").style.visibility = "visible ";
        document.getElementById("Schere").style.visibility = "hidden ";
        document.getElementById("Schere1").style.visibility = "hidden ";
        document.getElementById("Papier").style.visibility = "hidden ";
        document.getElementById("Papier1").style.visibility = "hidden ";
    }



        
