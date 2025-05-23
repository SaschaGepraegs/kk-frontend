async function createLobby() {
            document.getElementById("einzigerbutton").innerHTML = "Erstelle Lobby...";
            document.getElementById("einzigerbutton").disabled = true;
            const pin = Math.floor(1000 + Math.random() * 9000);
            const response = await fetch('https://kk-backend.vercel.app/registerLobby?gamepin=' + pin, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gamepin: pin
                })
            });

            if (response.ok) {
                window.location.href = `./mainscreen.html?pin=${pin}`;
            } else {
                alert("Fehler beim Erstellen der Lobby.");
            }
        }