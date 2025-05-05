/*
 *  Game
 */
"use strict";

module.exports = class Game {

    constructor(x = 30 , y = 17, n = 100) {
        this.x = x;
        this.y = y;
        this.n = n;

        this.block = [];
    }

    neighbor(x, y) {
        let rv = [];
        for (let yy = y - 1; yy <= y + 1; yy++) {
            for (let xx = x - 1; xx <= x + 1; xx++) {
                if (   0 <= xx && xx < this.x
                    && 0 <= yy && yy < this.y
                    && ! (xx == x && yy == y)   )   rv.push({ x: xx, y: yy });
            }
        }
        return rv;
    }

    init() {
        for (let x = 0; x < this.x; x++) {
            this.block[x] = [];
            for (let y = 0; y < this.y; y++) {
                this.block[x][y] = { n: 0, open: 0, mark: 0 };
            }
        }
        let n = this.n;
        while(n) {
            let x = (Math.random() * this.x)|0;
            let y = (Math.random() * this.y)|0;
            if (this.block[x][y].n == -1) continue;
            this.block[x][y].n = -1;
            n--;
        }
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                if (this.block[x][y].n != 0) continue;
                this.block[x][y].n
                    = this.neighbor(x, y)
                            .map(n => this.block[n.x][n.y].n == -1 ? 1 : 0)
                            .reduce((x, y)=> x + y);
            }
        }
        this.panel = this.x * this.y - this.n;
        this.cat   = this.n;
        this.start = new Date();
    }

    open(x, y) {
        if (this.block[x][y].open) return;
        this.block[x][y].open = 1;
        if (this.block[x][y].n == -1) {
            this.finish(0);
            return;
        }
        this.panel--;
        if (this.view) this.view.update(x, y);
        if (this.block[x][y].n == 0) {
            for (let n of this.neighbor(x, y)) {
                if (! this.block[n.x][n.y].open) this.open(n.x, n.y);
            }
        }
        if (this.panel == 0) this.finish(1);
    }

    mark(x, y) {
        if (this.block[x][y].open) return;
        if (! this.block[x][y].mark && this.cat == 0) return;
        this.block[x][y].mark = (this.block[x][y].mark + 1) % 3;
        if      (this.block[x][y].mark == 1) this.cat--;
        else if (this.block[x][y].mark == 2) this.cat++;
        if (this.view) this.view.update(x, y);
    }

    finish(success) {
        for (let y = 0; y < this.y; y++) {
            for (let x = 0; x < this.x; x++) {
                if (this.block[x][y].n == -1) this.block[x][y].open = 1;
            }
        }
        if (this.view) this.view.finish(success);
    }
}
