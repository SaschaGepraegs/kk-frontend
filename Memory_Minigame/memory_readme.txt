# Memory-Minigame

## Features / Regeln

### Karten
- Zahlen auf den Karten (wenig Design anfangs - Fokus liegt auf der Funktionalität des Programms)

### Spielersteuerung
- Es ist immer nur ein Spieler am Zug
- Nur der aktive Spieler hat Zugriff auf die Karten

### Spielstart
- Zu Beginn des Spiels werden alle Karten gemischt

### Spielprinzip (klassisches Memory)
- Ein zufällig gewählter Spieler beginnt
- Der Spieler deckt zwei Karten auf:
  - **Wenn beide Karten gleich sind:**
    - Der Spieler darf weitermachen
  - **Wenn die Karten unterschiedlich sind:**
    - Der nächste Spieler ist an der Reihe

### Spielumfang
- 16 Karten für den Prototyp um Übersicht zu behalten (8 Paare)

## Zusätzliche Regeln

- **Zeitlimit:** Jeder Spieler hat 10 Sekunden Zeit, um eine Aktion durchzuführen  
  - Bei keiner Aktion: automatische Übergabe an den nächsten Spieler (`skip`)
  
- **Streaks:** Bei mehreren richtigen Zügen hintereinander erhält der Spieler **mehr Punkte**

---