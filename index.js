  localStorage.setItem("uic_status", "auswahl")
  localStorage.setItem("uic_username", undefined)
  localStorage.setItem("uic_gamepin", undefined)
  localStorage.setItem("uic_task1done", undefined)
  localStorage.setItem("uic_task2done", undefined)
  localStorage.setItem("uic_task3done", undefined)
  localStorage.setItem("uic_task4done", undefined)
  localStorage.setItem("uic_task5done", undefined)
  localStorage.setItem("uic_task6done", undefined)
  localStorage.setItem("uic_task7done", undefined)

  function joinLobby() {
      if (document.getElementById("namenseingabe").value != "" && document.getElementById("namenseingabe").value != "reset") {
          localStorage.setItem("uic_username", document.getElementById("namenseingabe").value)
          localStorage.setItem("uic_gamepin", document.getElementById("lobbyeingabe").value)
          localStorage.setItem("uic_status", "lobby")
          checkForLobby()
      } else {
          if (document.getElementById("namenseingabe").value == "reset") {
              fetch("https://kk-backend.vercel.app/reset")
              alert("Reset durchgeführt.")
          } else {
              alert("Bist du dir sicher, dass du Name eingegeben hast?")
          }

      }

      async function checkForPlayer() {
          const antwort = fetch('https://kk-backend.vercel.app/checkForPlayer', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  "username": localStorage.getItem("uic_username")
              })
          })
          let data = await (await antwort).json()
          let endergebnis = JSON.stringify(data);
          console.log(endergebnis)

          if (endergebnis == true) {
              alert("Diesen Nutzernamen gibt es schon.")
          } else {
              gehtsLos()
          }
      }

      async function checkForLobby() {
          const antwort = fetch('https://kk-backend.vercel.app/getOpenLobbyList')
          let data = await (await antwort).json()
          let endergebnis = JSON.stringify(data);
          console.log(endergebnis)
          if (endergebnis.includes(localStorage.getItem("uic_gamepin"))) {
              checkForPlayer();
          } else {
              alert("Diese Lobby existiert nicht.")
          }
      }

      async function gehtsLos() {
          var antwort3 = fetch('https://kk-backend.vercel.app/gehtsLos')
          let data = await (await antwort3).json()
          let endergebnis = JSON.stringify(data);

          if (endergebnis == "true") {
              alert('Das Spiel hat bereits gestartet! Wenn du es zurücksetzen willst, dann logge dich bitte als Spieler "reset" ein.')
          } else {
              window.location.assign("System/lobby.html")
          }
      }
  }