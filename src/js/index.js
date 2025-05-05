/*!
 *  NyankoSweeper v0.2.0
 *
 *  Copyright(C) 2025 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/NyankoSweeper/blob/master/LICENSE
 */

const $ = require('jquery');

const Game  = require('./game');
const Board = require('./board');

$(function(){

    $('a[href="#board"]').on('click', ()=>{
        $('#rule').hide();
        $('#board').show();
        return false;
    });
    $('a[href="#rule"]').on('click', ()=>{
        $('#board').hide();
        $('#rule').slideDown();
        return false;
    });

    let game  = new Game(20, 12, 24);
    let board = new Board($('#board'), game);
    board.start();

    $('#loading').hide();
    $('#board').fadeIn();
});
