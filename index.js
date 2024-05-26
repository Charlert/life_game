const CVS_W = 500;
const CVS_H = 500;
const BLOCK_LENGTH = 10;
const MAX_LEVEL = 1;
const SHOW_TEXT = 0;
const DELAY = 500;
const BLOCK_MARGIN_CENTAGE = 0;
const MIN_SHOW_LEVEL = 1;

const cvs = document.getElementById("cvs");
const nBlockW = CVS_W / BLOCK_LENGTH;
const nBlockH = CVS_H / BLOCK_LENGTH;
const ctx = cvs.getContext("2d");

let map = Array.from(new Array(nBlockH), () => new Array(nBlockW).fill(0));

ctx.font = BLOCK_LENGTH + "px serlf";
cvs.width = CVS_W;
cvs.height = CVS_H;

console.log({ nBlockW, nBlockH });

const drawBlock = (x, y, level) => {
    if (level < MIN_SHOW_LEVEL) return;

    const x1 = x * BLOCK_LENGTH;
    const y1 = y * BLOCK_LENGTH;
    const x2 = x1 + BLOCK_LENGTH / 2 * BLOCK_MARGIN_CENTAGE;
    const y2 = y1 + BLOCK_LENGTH / 2 * BLOCK_MARGIN_CENTAGE;

    const alpha = level / MAX_LEVEL;
    ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
    ctx.fillRect(x2, y2, BLOCK_LENGTH * (1 - BLOCK_MARGIN_CENTAGE), BLOCK_LENGTH * (1 - BLOCK_MARGIN_CENTAGE));

    ctx.fillStyle = "blue";
    if (SHOW_TEXT)
        ctx.fillText(level, x1 + BLOCK_LENGTH / 3.5, y1 + BLOCK_LENGTH * 0.8, BLOCK_LENGTH * (1 - BLOCK_MARGIN_CENTAGE));
}

const drawMap = () => {
    ctx.clearRect(0, 0, CVS_W, CVS_H);
    for (let y = 0; y < nBlockH; y++) {
        for (let x = 0; x < nBlockW; x++) {
            drawBlock(x, y, map[y][x]);
        }
    }
}

const deepClone = obj => {
    const isObject = args => (typeof args === 'object' || typeof args === 'function') && typeof args !== null
    if (!isObject) throw new Error('Not Reference Types')
    let newObj = Array.isArray(obj) ? [...obj] : { ...obj }
    Reflect.ownKeys(newObj).map(key => {
        newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
    })
    return newObj
}

const count = (x, y) => {
    if (typeof x === "string") x = parseInt(x);
    if (typeof y === "string") y = parseInt(y);
    const b5 = [x, y];
    let b1 = new Array(2);
    let b2 = new Array(2);
    let b3 = new Array(2);
    let b4 = new Array(2);
    let b6 = new Array(2);
    let b7 = new Array(2);
    let b8 = new Array(2);
    let b9 = new Array(2);
    b2[0] = b8[0] = x;
    b4[1] = b6[1] = y;
    if (x === 0) {
        b1[0] = b4[0] = b7[0] = nBlockW - 1;
        b3[0] = b6[0] = b9[0] = 1;
    } else if (x === nBlockW - 1) {
        b1[0] = b4[0] = b7[0] = x - 1;
        b3[0] = b6[0] = b9[0] = 0;
    } else {
        b1[0] = b4[0] = b7[0] = x - 1;
        b3[0] = b6[0] = b9[0] = x + 1;
    }
    if (y === 0) {
        b1[1] = b2[1] = b3[1] = nBlockH - 1;
        b7[1] = b8[1] = b9[1] = 1;
    } else if (y === nBlockH - 1) {
        b1[1] = b2[1] = b3[1] = y - 1;
        b7[1] = b8[1] = b9[1] = 0;
    } else {
        b1[1] = b2[1] = b3[1] = y - 1;
        b7[1] = b8[1] = b9[1] = y + 1;
    }
    const blocks = [b1, b2, b3, b4, b6, b7, b8, b9];
    let counter = 0;
    blocks.forEach((v, i) => {
        if (map[v[1]][v[0]] >= map[y][x] && map[v[1]][v[0]]) counter++;
    })
    return counter;
}

const next = () => {
    const newMap = deepClone(map);
    const checkBlock = (x, y) => {
        if (typeof x === "string") x = parseInt(x);
        if (typeof y === "string") y = parseInt(y);
        const counter = count(x, y);
        if (map[y][x]) {
            if (counter < 2 || counter > 3) {
                newMap[y][x]--;
            } else {
                newMap[y][x]++;
            }
        } else {
            if (counter === 3) {
                newMap[y][x]++;
            }
        }
        if (newMap[y][x] > MAX_LEVEL) newMap[y][x] = MAX_LEVEL;
        if (newMap[y][x] < 0) newMap[y][x] = 0;
    }

    for (let y = 0; y < nBlockH; y++) {
        for (let x = 0; x < nBlockW; x++) {
            checkBlock(x, y);
        }
    }
    map = newMap;
}

const setBlock = (x, y, level) => {
    map[y][x] = level;
}

const uiSet = () => {
    setBlock(
        document.getElementById("ix").value,
        document.getElementById("iy").value,
        document.getElementById("il").value
    );
    drawMap();
}

const uiCheck = () => {
    console.log(count(
        document.getElementById("ix").value,
        document.getElementById("iy").value
    ));
}

for (let y = 0; y < nBlockH; y++) {
    for (let x = 0; x < nBlockW; x++) {
        let l = Math.floor(Math.random() * (MAX_LEVEL + 1));
        setBlock(x, y, l);
    }
}
drawMap();

setInterval(() => {
    next();
    drawMap();
}, DELAY);