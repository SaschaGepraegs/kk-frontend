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


//start jquery..
$(function(){

//get the the click of the button

 $("#button").click(function(){
   //disabled class toggle
   $(".toggle").prop('disabled', true);

  //enabled after 1 minute
  setTimeout( function(){ 

    //here you enabled all the html of class toggle.
   $(".toggle").prop('disabled', false);

  }
 , 60000 );

 });
});

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
        setTimeout(() => {window.location.assign("/System/pause.html");}, 3000); // Nach 3 Sekunden auf die Pause-Seite weiterleiten
    } catch (e) {
        alert("Fehler beim Übertragen der Punkte!");
        setTimeout(() => {window.location.assign("/System/pause.html");}, 3000); // Nach 3 Sekunden auf die Pause-Seite weiterleiten
    }
}

// Spielstart nach Laden der Seite
window.onload = startGame;



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
        MachAufAnfangJetztAlter();

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
                MachAufAnfangJetztAlter();
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
        MachAufAnfangJetztAlter();
        
    }


    function MachAufAnfangJetztAlter(){
        document.getElementById("Stein1").style.visibility = "visible ";
        document.getElementById("Stein").style.visibility = "visible ";
        document.getElementById("Schere").style.visibility = "hidden ";
        document.getElementById("Schere1").style.visibility = "hidden ";
        document.getElementById("Papier").style.visibility = "hidden ";
        document.getElementById("Papier1").style.visibility = "hidden ";
    }



        
