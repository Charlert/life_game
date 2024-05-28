import { deepClone } from "./utils.js";

export class Canvas {
    constructor(cvs) {
        this.cvs = cvs;
        this.ctx = cvs.getContext("2d");
        this.initiate();
    }

    get nBlockW() { return window.cvso_config.CVS_W.value / window.cvso_config.BLOCK_LENGTH.value; }
    get nBlockH() { return window.cvso_config.CVS_H.value / window.cvso_config.BLOCK_LENGTH.value; }

    nIntervId = null;

    initiate() {
        this.stopTimer();
        this.map = new Array(this.nBlockH).fill(0).map(v=>new Array(this.nBlockW).fill(0));
        this.cvs.width = window.cvso_config.CVS_W.value;
        this.cvs.height = window.cvso_config.CVS_H.value;
        this.ctx.font = window.cvso_config.BLOCK_LENGTH.value + "px serlf";
        this.randomMap();
        this.drawMap();
        this.startTimer();
    }

    startTimer() {
        this.drawMap();
        if (!this.nIntervId)
            this.nIntervId = setInterval(() => {
                this.next();
                this.drawMap();
            }, window.cvso_config.DELAY.value);
    }

    stopTimer() {
        clearInterval(this.nIntervId);
        this.nIntervId = null;
    }

    drawBlock(x, y, level) {
        if (level < window.cvso_config.BLOCK_MIN_SHOW_LEVEL.value) return;

        const x1 = x * window.cvso_config.BLOCK_LENGTH.value;
        const y1 = y * window.cvso_config.BLOCK_LENGTH.value;
        const x2 = x1 + window.cvso_config.BLOCK_LENGTH.value / 2 * window.cvso_config.BLOCK_MARGIN_CENTAGE.value;
        const y2 = y1 + window.cvso_config.BLOCK_LENGTH.value / 2 * window.cvso_config.BLOCK_MARGIN_CENTAGE.value;

        const alpha = level / window.cvso_config.BLOCK_MAX_LEVEL.value;
        this.ctx.fillStyle = "rgba(" + window.cvso_config.BLOCK_COLOR.value + ", " + alpha + ")";
        this.ctx.fillRect(x2, y2, window.cvso_config.BLOCK_LENGTH.value * (1 - window.cvso_config.BLOCK_MARGIN_CENTAGE.value), window.cvso_config.BLOCK_LENGTH.value * (1 - window.cvso_config.BLOCK_MARGIN_CENTAGE.value));

        this.ctx.fillStyle = window.cvso_config.TEXT_COLOR.value;
        if (window.cvso_config.TEXT_SHOW.value)
            this.ctx.fillText(level, x1 + window.cvso_config.BLOCK_LENGTH.value / 3.5, y1 + window.cvso_config.BLOCK_LENGTH.value * 0.8, window.cvso_config.BLOCK_LENGTH.value * (1 - window.cvso_config.BLOCK_MARGIN_CENTAGE.value));
    }

    drawMap() {
        this.ctx.clearRect(0, 0, window.cvso_config.CVS_W.value, window.cvso_config.CVS_H.value);
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

            if (newMap[y][x] > window.cvso_config.BLOCK_MAX_LEVEL.value) newMap[y][x] = window.cvso_config.BLOCK_MAX_LEVEL.value;
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
            for (let x = 0; x < this.nBlockW; x++) setBlock(x, y, Math.floor(Math.random() * (window.cvso_config.BLOCK_MAX_LEVEL.value + 1)));
        }
    }
}
