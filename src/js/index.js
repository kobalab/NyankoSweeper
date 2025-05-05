/*!
 *  NyankoSweeper v0.1.0
 *
 *  Copyright(C) 2025 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/NyankoSweeper/blob/master/LICENSE
 */

const $ = require('jquery');

const Game  = require('./game');
const Board = require('./board');

$(function(){
    let game  = new Game(20, 12, 24);
    let board = new Board($('#board'), game);
    board.start();

    $('#loading').hide();
    $('#board').fadeIn();
});
