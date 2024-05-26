const cvs = document.getElementById("cvs");
const cvsW = 1400;
const cvsH = 1200;
cvs.width = cvsW;
cvs.height = cvsH;

const blockL = 50;
const nBlockW = cvsW / blockL;
const nBlockH = cvsH / blockL;
console.log({ nBlockW, nBlockH });

const ctx = cvs.getContext("2d");
ctx.font = blockL + "px serlf";

const maxLevel = 1;

const SHOW_TEXT = false;

let map = Array.from(new Array(nBlockH), () => new Array(nBlockW).fill(0));

const drawBlock = (x, y, level) => {
    const x1 = x * blockL;
    const y1 = y * blockL;
    const marginCentage = 0.2;
    const x2 = x1 + blockL / 2 * marginCentage;
    const y2 = y1 + blockL / 2 * marginCentage;

    const alpha = level / maxLevel;
    ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
    ctx.fillRect(x2, y2, blockL * (1 - marginCentage), blockL * (1 - marginCentage));

    ctx.fillStyle = "blue";
    if (level && SHOW_TEXT)
        ctx.fillText(level, x1 + blockL / 3.5, y1 + blockL * 0.8);
}

const drawMap = () => {
    ctx.clearRect(0, 0, cvsW, cvsH);
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
        if (newMap[y][x] > maxLevel) newMap[y][x] = maxLevel;
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
        let l = Math.floor(Math.random() * (maxLevel + 1));
        setBlock(x, y, l);
    }
}

// setBlock(0, 0, 4);
// setBlock(0, 1, 6);
// setBlock(1, 6, 8);
// setBlock(1, 1, 4);
// setBlock(6, 0, 6);
// setBlock(0, 5, 5);
// setBlock(6, 5, 7);

drawMap();

setInterval(()=>{next();drawMap();}, 500);