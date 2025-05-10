/*
 *  Board
 */
"use strict";

const $ = require('jquery');

const mew     = new Audio('cat.wav');
const fanfare = new Audio('announce.wav');

module.exports = class Board {

    constructor(root) {
        this.root  = root;
        this.block = [];
    }

    start(game) {
        this.timer = clearInterval(this.timer);
        $('.block', this.root).off('dblclick');

        if (game) {
            this.game = game;
            game.view  = this;
        }
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
                block.on('click', ()=>{
                    this.game.mark(x, y);
                });
                this.update(x, y);
            }
        }
        this.status();
        this.timer = setInterval(()=> this.status(), 200);
    }

    update(x, y) {
        let block = this.block[y][x];
        block.removeClass('mark1 mark2');
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
        else {
            if (this.game.block[x][y].mark) {
                block.addClass('mark' + this.game.block[x][y].mark);
            }
        }
        this.status();
    }

    status() {
        let game = this.game;
        let time = new Date(new Date() - game.start)
                            .toLocaleTimeString('sv', { timeZone: 'UTC'});
        let panel = game.x * game.y - game.n;
        let text = `Panel = ${panel - game.panel}/${panel} `
                 + `Cat = ${game.cat}/${game.n} Time = ${time}`;
        $('.status', this.root).text(text)
    }

    finish(success) {
        this.timer = clearInterval(this.timer);
        for (let y = 0; y < this.game.y; y++) {
            for (let x = 0; x < this.game.x; x++) {
                this.update(x, y);
                this.block[y][x].off('dblclick click');
            }
        }
        if (success) {
            fanfare.play();
            this.callback();
        }
        else {
            mew.play();
        }
        setTimeout(()=>$('.block', this.root).on('dblclick', ()=>this.start()),
            1000);
    }
}
