/*!
 *  NyankoSweeper v0.4.0
 *
 *  Copyright(C) 2025 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/NyankoSweeper/blob/master/LICENSE
 */

const $ = require('jquery');

const Game  = require('./game');
const Board = require('./board');

let board, pref, record;

function init() {

    let game;

    $('#board .dialog form').off('submit');

    if (pref.size) {
        game = new Game(pref.size.x, pref.size.y, pref.size.n);
        board.callback = ()=>{};
    }
    else {
        game = new Game();
        board.callback = ()=>{
            setTimeout(()=>{
                $('.dialog', this.root).show();
                $('.dialog input', this.root).focus();
            }, 800);
        };
        $('#board .dialog form').on('submit', ()=>{
            pref.yourname = $('#board input[name="yourname"]').val();
            localStorage.setItem('Nyanko.pref', JSON.stringify(pref));
            addRecord(game.score, pref.yourname);
            return false;
        });
    }

    board.start(game);
}

function submit() {

    let size = $('form#pref input[name="size"]:checked').val();
    if (size == 'default') {
        delete pref.size;
    }
    else {
        let x = + $('form#pref input[name="x"]').val();
        let y = + $('form#pref input[name="y"]').val();
        let n = + $('form#pref input[name="n"]').val();
        let err;
        if      (x < 20 || y < 12) err = 'ゲーム盤が小さすぎます。';
        else if (x > 40 || y > 25) err = 'ゲーム盤が大きすぎます。';
        else if (n * 10 < x * y)   err = '猫が少なすぎます。';
        else if (n > x * y)        err = '猫があふれています。';
        if (err) {
            $('form#pref .error').text(err).show().fadeOut(2000);
            return false;
        }
        pref.size = { x: x, y: y, n: n };
    }
    localStorage.setItem('Nyanko.pref', JSON.stringify(pref));

    init();
    $('a[href="#board"]').trigger('click');

    return false;
}

function addRecord(score, yourname) {
    $('#board .dialog').hide();
    if (! yourname) return;
    let date = Date.now();
    record.push({ score: score, name: yourname, date: date });
    record = record.sort((a, b)=> a.score - b.score).slice(0, 10);
    localStorage.setItem('Nyanko.record', JSON.stringify(record));
    if (record.find(r => r.score == score && r.name == yourname
                            && r.date == date))
    {
        showRecord(score, yourname, date);
        $('#board').hide();
        $('#pref').hide();
        $('#rule').hide();
        $('#score').slideDown();
    }
}

function showRecord(score, yourname, date) {

    $('#score td.name').text('');
    $('#score td.score').text('');
    $('#score td.date').text('');
    $('#score tr').removeClass('new');

    let i = 0;
    for (let r of record) {
        if (r.score == score && r.name == yourname && r.date == date) {
            $('#score tr').eq(i + 1).addClass('new');
        }
        $('#score td.name').eq(i).text(r.name);
        $('#score td.score').eq(i).text(
                new Date(r.score).toLocaleTimeString('sv', { timeZone: 'UTC'}));
        $('#score td.date').eq(i).text(
                new Date(r.date).toLocaleDateString('sv'));
        i++;
    }
}

$(function(){

    $('a[href="#board"]').on('click', ()=>{
        $('#pref').hide();
        $('#score').hide();
        $('#rule').hide();
        $('#board').show();
        return false;
    });
    $('a[href="#pref"]').on('click', ()=>{
        $('#board').hide();
        $('#score').hide();
        $('#rule').hide();
        $('#pref').slideDown();
        return false;
    });
    $('a[href="#score"]').on('click', ()=>{
        showRecord();
        $('#board').hide();
        $('#pref').hide();
        $('#rule').hide();
        $('#score').slideDown();
        return false;
    });
    $('a[href="#rule"]').on('click', ()=>{
        $('#board').hide();
        $('#pref').hide();
        $('#score').hide();
        $('#rule').slideDown();
        return false;
    });
    $('form#pref').on('submit', submit);

    pref   = JSON.parse(localStorage.getItem('Nyanko.pref')||'{}');
    record = JSON.parse(localStorage.getItem('Nyanko.record')||'[]');

    if (pref.size) {
        $('form#pref input[name="size"]').val(['custom']);
        $('form#pref input[name="x"]').val(pref.size.x);
        $('form#pref input[name="y"]').val(pref.size.y);
        $('form#pref input[name="n"]').val(pref.size.n);
    }
    $('#board input[name="yourname"]').val(pref.yourname);

    board = new Board($('#board'));

    init();

    $('#loading').hide();
    $('#board').fadeIn();
});
