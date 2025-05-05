/*
 *  Board
 */
"use strict";

const $ = require('jquery');

const mew     = new Audio('cat.wav');
const fanfare = new Audio('announce.wav');

module.exports = class Board {

    constructor(root, game) {
        this.root  = root;
        this.block = [];
        this.game  = game;

        game.view  = this;
    }

    start() {
        this.root.off('dblclick');

        this.game.init();
        $('.block', this.root).empty();
        for (let y = 0; y < this.game.y; y++) {
            let row = $('<div>');
            $('.block', this.root).append(row);
            this.block[y] = [];
            for (let x = 0; x < this.game.x; x++) {
                let block = $('<div>');
                row.append(block);
                this.block[y][x] = block;
                block.on('dblclick', ()=>{
                    this.game.open(x, y);
                });
                this.update(x, y);
            }
        }
    }

    update(x, y) {
        let block = this.block[y][x];
        if (this.game.block[x][y].open) {
            block.addClass('open');
            if (this.game.block[x][y].n == -1) {
                if (this.game.block[x][y].mark == 1) {
                    block.addClass('OK');
                }
                else {
                    block.addClass('NG');
                }
            }
            else if (this.game.block[x][y].n > 0) {
                block.addClass('n' + this.game.block[x][y].n);
            }
        }
    }

    finish(success) {
        for (let y = 0; y < this.game.y; y++) {
            for (let x = 0; x < this.game.x; x++) {
                this.update(x, y);
                this.block[y][x].off('dblclick');
            }
        }
        if (success) fanfare.play();
        else         mew.play();

        setTimeout(()=>this.root.on('dblclick', ()=>this.start()), 10);
    }
}
