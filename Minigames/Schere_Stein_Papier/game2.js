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
            if (x = 1) {
                meter.value = clicks;
                meter.max = 100;
                setInterval(function() {
                    meter.value = clicks;
                }, 100);
            }
        }