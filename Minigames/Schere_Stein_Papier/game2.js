        function fortfahren() {
            localStorage.setItem("uic_task1done ", "true ");
            window.location.assign("game.html ")
        }
        var clicks = 0;

        function geklickt() {
            clicks++;
            if (clicks >= 100) {
                document.getElementById("pizza ").style.visibility = "hidden ";
                document.getElementById("fortfahren ").style.visibility = "visible ";
            }
        }


        function Schere() {
            x = Math.random(1, 3);
            if(AnzahlGewonnen <= 2)
                
                if (x = 1) {
                    document.getElementById("Schere").style.display = "visible ";
                    document.getElementById("Papier1").style.display = "visible ";
                    AnzahlGewonnen++;
                }
                if (x = 2) {
                    document.getElementById("Schere").style.display = "visible ";
                    document.getElementById("Schere1").style.display = "visible ";
                }
                 if (x = 2) {
                    document.getElementById("Schere").style.display = "visible ";
                    document.getElementById("Stein1").style.display = "visible ";
        }
                 document.getElementById("Schere1").style.visibility = "hidden ";
                 document.getElementById("Schere").style.visibility = "hidden ";
                 document.getElementById("Papier1").style.visibility = "hidden ";
                 document.getElementById("Stein1").style.visibility = "visible ";
                 document.getElementById("Stein").style.visibility = "visible ";
    }




        
