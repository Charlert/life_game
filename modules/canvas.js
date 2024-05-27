import { deepClone } from "./utils.js";
import * as exports from "./config.js"
Object.assign(window, exports);

export class Canvas {
    constructor(cvs) {
        this.cvs = cvs;
        this.cvs.width = CVS_W;
        this.cvs.height = CVS_H;
        this.ctx = cvs.getContext("2d");
        this.ctx.font = BLOCK_LENGTH + "px serlf";

        // initialize
        (() => {
            this.randomMap();
            this.drawMap();
            setInterval(() => {
                this.next();
                this.drawMap();
            }, DELAY);
        })()
    }

    nBlockW = CVS_W / BLOCK_LENGTH;
    nBlockH = CVS_H / BLOCK_LENGTH;
    map = Array.from(new Array(this.nBlockH), () => new Array(this.nBlockW).fill(0));

    drawBlock(x, y, level) {
        if (level < MIN_SHOW_LEVEL) return;

        const x1 = x * BLOCK_LENGTH;
        const y1 = y * BLOCK_LENGTH;
        const x2 = x1 + BLOCK_LENGTH / 2 * BLOCK_MARGIN_CENTAGE;
        const y2 = y1 + BLOCK_LENGTH / 2 * BLOCK_MARGIN_CENTAGE;

        const alpha = level / MAX_LEVEL;
        this.ctx.fillStyle = "rgba(" + BLOCK_COLOR + ", " + alpha + ")";
        this.ctx.fillRect(x2, y2, BLOCK_LENGTH * (1 - BLOCK_MARGIN_CENTAGE), BLOCK_LENGTH * (1 - BLOCK_MARGIN_CENTAGE));

        this.ctx.fillStyle = FONT_COLOR;
        if (SHOW_TEXT)
            this.ctx.fillText(level, x1 + BLOCK_LENGTH / 3.5, y1 + BLOCK_LENGTH * 0.8, BLOCK_LENGTH * (1 - BLOCK_MARGIN_CENTAGE));
    }

    drawMap() {
        this.ctx.clearRect(0, 0, CVS_W, CVS_H);
        for (let y = 0; y < this.nBlockH; y++) {
            for (let x = 0; x < this.nBlockW; x++) {
                this.drawBlock(x, y, this.map[y][x]);
            }
        }
    }

    next() {
        const newMap = deepClone(this.map);
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
                b1[0] = b4[0] = b7[0] = this.nBlockW - 1;
                b3[0] = b6[0] = b9[0] = 1;
            } else if (x === this.nBlockW - 1) {
                b1[0] = b4[0] = b7[0] = x - 1;
                b3[0] = b6[0] = b9[0] = 0;
            } else {
                b1[0] = b4[0] = b7[0] = x - 1;
                b3[0] = b6[0] = b9[0] = x + 1;
            }
            if (y === 0) {
                b1[1] = b2[1] = b3[1] = this.nBlockH - 1;
                b7[1] = b8[1] = b9[1] = 1;
            } else if (y === this.nBlockH - 1) {
                b1[1] = b2[1] = b3[1] = y - 1;
                b7[1] = b8[1] = b9[1] = 0;
            } else {
                b1[1] = b2[1] = b3[1] = y - 1;
                b7[1] = b8[1] = b9[1] = y + 1;
            }
            const blocks = [b1, b2, b3, b4, b6, b7, b8, b9];
            let counter = 0;
            blocks.forEach((v, i) => {
                if (this.map[v[1]][v[0]] >= this.map[y][x] &&
                    this.map[v[1]][v[0]])
                    counter++;
            })
            return counter;
        }
        const checkBlock = (x, y) => {
            if (typeof x === "string") x = parseInt(x);
            if (typeof y === "string") y = parseInt(y);
            const counter = count(x, y);
            // 活的
            if (this.map[y][x]) {
                if (counter < 2 || counter > 3) newMap[y][x]--;
                else newMap[y][x]++;
            }
            // 死的
            else if (counter === 3) newMap[y][x]++;

            if (newMap[y][x] > MAX_LEVEL) newMap[y][x] = MAX_LEVEL;
            if (newMap[y][x] < 0) newMap[y][x] = 0;
        }

        for (let y = 0; y < this.nBlockH; y++)
            for (let x = 0; x < this.nBlockW; x++)
                checkBlock(x, y);
        this.map = newMap;
    }

    randomMap() {
        for (let y = 0; y < this.nBlockH; y++) {
            const setBlock = (x, y, level) => this.map[y][x] = level;
            for (let x = 0; x < this.nBlockW; x++) setBlock(x, y, Math.floor(Math.random() * (MAX_LEVEL + 1)));
        }
    }
}