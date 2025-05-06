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

let board;

function submit() {

    let game;
    let size = $('form#pref input[name="size"]:checked').val();
    if (size == 'default') {
        game  = new Game();
    }
    else {
        let x = $('form#pref input[name="x"]').val();
        let y = $('form#pref input[name="y"]').val();
        let n = $('form#pref input[name="n"]').val();
        let err;
        if      (x < 20 || y < 12) err = 'ゲーム盤が小さすぎます。';
        else if (x > 40 || y > 25) err = 'ゲーム盤が大きすぎます。';
        else if (n * 10 < x * y)   err = '猫が少なすぎます。';
        else if (n > x * y)        err = '猫があふれています。';
        if (err) {
            $('form#pref .error').text(err).show().fadeOut(2000);
            return false;
        }
        game  = new Game(x, y, n);
    }

    board.start(game);
    $('a[href="#board"]').trigger('click');

    return false;
}

$(function(){

    $('a[href="#board"]').on('click', ()=>{
        $('#pref').hide();
        $('#rule').hide();
        $('#board').show();
        return false;
    });
    $('a[href="#pref"]').on('click', ()=>{
        $('#board').hide();
        $('#rule').hide();
        $('#pref').slideDown();
        return false;
    });
    $('a[href="#rule"]').on('click', ()=>{
        $('#board').hide();
        $('#pref').hide();
        $('#rule').slideDown();
        return false;
    });
    $('form#pref').on('submit', submit);

    board = new Board($('#board'));
    board.start(new Game());

    $('#loading').hide();
    $('#board').fadeIn();
});
