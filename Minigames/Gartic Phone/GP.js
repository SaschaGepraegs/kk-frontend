const canvas = document.getElementById("canvas");
const Werkzeuge = document.getElementById("Werkzeuge");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;


let isPainting = false;
let lastlineWidth = 5;
let startX = 0;
let startY = 0;

Werkzeuge.addEventListener("click", (e) => {
    if (e.target.id === "Loeschen") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (e.target.id === "Zuruecksetzen") {
        ctx.restore();
    }
});

Werkzeuge.addEventListener("change", (e) => {
    if (e.target.id === "Stift") {
        ctx.strokeStyle = e.target.value;
    } else if (e.target.id === "Dicke") {
        lineWidth = e.target.value;
    }
});

const draw = (e) => {
    if (!isPainting) return;

    ctx.lineWidth = lastlineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();

    startX = e.clientX - canvasOffsetX;
    startY = e.clientY - canvasOffsetY;
};

canvas.addEventListener("mousedown", (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;

});

canvas.addEventListener("mouseup", (e) => {
    isPainting = false;
    ctx.beginPath();
    ctx.stroke();
});

canvas.addEventListener("mousemove", draw);
