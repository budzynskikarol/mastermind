
const canvas = document.getElementById("game_canvas");
const ctx = canvas.getContext("2d");

const PILL_WIDTH = 80;
const PILL_HEIGHT = 80;

let active_pill = 0;
let round_no = 1;
const ok = new Image(50, 50); ok.src = "assets/ok.png";
const elsewhere = new Image(50, 50); elsewhere.src = "assets/elsewhere.png";
const none = new Image(50, 50); none.src = "assets/none.png";

let colors = ["firebrick", "seagreen", "dodgerblue", "orange", "yellow", "sienna", "magenta", "gray"];

let solution = ["empty", "empty", "empty", "empty", "empty"];

let state = ["empty", "empty", "empty", "empty", "empty"];

let elem = document.querySelectorAll("#c");

for (let i = 0; i < elem.length; i++) {
    let element = elem[i];
    element.style.backgroundColor = colors[i];
    element.addEventListener("click", guess, false);
    element.color = colors[i];
}

function randomSolution() {
    for (let i = 0; i < 5; i++) {
        solution[i] = colors[Math.floor(Math.random() * 7)];
    }
    console.log(solution);
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillRect(640, 40, 110, 130);

    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.arc( 692, 90, 45, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "orange";
    ctx.font = "44px Arial";
    if (round_no < 10) ctx.fillText(round_no, 680, 105);
    else ctx.fillText(round_no, 665, 105);

    ctx.font = "20px Arial";
    ctx.fillText("ROUND", 655, 165)
}

function drawPill(x, y, type) {
    ctx.fillStyle = "black";
    ctx.fillRect(x - 5, y - 5, PILL_WIDTH + 10, PILL_HEIGHT + 10);
    if (type == "empty") {
        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, PILL_WIDTH, PILL_HEIGHT);
    } else {
        ctx.fillStyle = type;
        ctx.fillRect(x, y, PILL_WIDTH, PILL_HEIGHT);
    }
}

function drawArrow() {
    ctx.fillStyle = "black";
    ctx.fillRect(100, 140, 480, 60);
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("↑", 133 + active_pill * 100, 180);
}

function startBoard() {
    ctx.fillStyle = "black";
    ctx.fillRect(90, 40, 500, 100);
    for (let i = 0; i < 5; i++) {
        drawPill(100 + i * 100, 50, "empty");
    }
    drawArrow();
}

function winingCheck() {
    let win = true;
    for (let i = 0; i < 5; i++) {
        if (state[i] != solution[i]) win = false;
    }
    
    if(win) {   
        ctx.fillStyle = "black";
        ctx.fillRect(80, 20, 550, 200);
        active_pill = -999;
        drawArrow();

        ctx.fillStyle = "orange";
        ctx.font = "78px Arial";
        ctx.fillText("YOU WIN!", 160, 130);
        document.querySelector(".comment").innerHTML = "You managed to establish the colors of all blocks in round number " + round_no;

        document.querySelector(".controls").style.fontSize = "40px";
        document.querySelector(".controls").innerHTML = '<span id="again"> Play again?</span>';
        document.querySelector("#again").style.cursor = "pointer";
        document.querySelector("#again").addEventListener("click", function() {window.location.reload();}, false);
    } else {
    round_no++;
    drawScore();
    }
}

function checkBoard() {
    active_pill = 0;
    startBoard();
    drawArrow();
    
    ctx.fillStyle = "black";
    ctx.fillRect(100, 350, 480, 70);

    for (let i = 0; i < 5; i++) {
        drawPill(100 + i * 100, 250, state[i]);
        if (state[i] == solution[i]) {
            ctx.drawImage(ok, 115 + i * 100, 360);
        } else {
            let other_spot = false;
            for (let j = 0; j < 5; j++) {
                if (state[i] == solution[j]) other_spot = true;
            }
            if (other_spot) {
                ctx.drawImage(elsewhere, 115 + i * 100, 360);
            } else {
                ctx.drawImage(none, 115 + i * 100, 360);
            }
        }
    }

    winingCheck();
}

function guess(evt) { 
    if (active_pill >= 0 && active_pill <= 4) {
        let pill_color = evt.currentTarget.color;
        drawPill(100 + active_pill * 100, 50, pill_color)
        state[active_pill] = pill_color;
        if(active_pill < 4) active_pill ++;
        else checkBoard();
        drawArrow();
    } 
}

function resetPill() {
    if (active_pill > 0) {
        drawPill(100 + (active_pill - 1) * 100, 50, "empty");
        state[active_pill -1] = "empty";
        active_pill--;
        drawArrow();
    }
}

function showHelp() {
    document.querySelector(".help").style.display = "block";
}

function closeHelp() {
    document.querySelector(".help").style.display = "none";
}

document.querySelector("#delete").addEventListener("click", resetPill, false);

document.querySelector("#help").addEventListener("click", showHelp, false);

document.querySelector("#close_help").addEventListener("click", closeHelp, false);

window.addEventListener('load', function() {
    randomSolution();
    startBoard();
    drawScore();
})