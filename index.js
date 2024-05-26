const cvs = document.getElementById("cvs");
const cvsW = 500;
const cvsH = 300;
cvs.width = cvsW;
cvs.height = cvsH;

const blockL = 20;
const nBlockW = cvsW / blockL;
const nBlockH = cvsH / blockL;

const ctx = cvs.getContext("2d");
ctx.font = blockL + "px serlf";

const maxLevel = 10;

const map = Array.from(new Array(nBlockH), () => new Array(nBlockW).fill(0));

const drawCircle = (x, y, level) => {
    const x1 = x * blockL;
    const y1 = y * blockL;
    const marginCentage = 0.2;
    const x2 = x1 * blockL + blockL / 2 * marginCentage;
    const y2 = y1 * blockL + blockL / 2 * marginCentage;

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(x2, y2, blockL * (1 - marginCentage), blockL * (1 - marginCentage));

    ctx.fillStyle = "blue";
    ctx.fillText(level, x1 + blockL / 3.5, y1 + blockL * 0.8);
}

const drawMap = () => {
    for(let y = 0; y < nBlockH; y ++) {
        for(let x = 0; x < nBlockW; x ++) {
            drawCircle(x, y, map[y][x]);
        }
    }
}

drawMap();
