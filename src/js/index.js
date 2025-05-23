/*!
 *  NyankoSweeper v1.0.0
 *
 *  Copyright(C) 2025 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/NyankoSweeper/blob/master/LICENSE
 */

const $ = require('jquery');

const Game  = require('./game');
const Board = require('./board');

let board, pref, record;
const url = 'score';

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

    $('#board').fadeIn();

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
    pref.private = + $('form#pref input[name="private"]:checked').val();
    localStorage.setItem('Nyanko.pref', JSON.stringify(pref));

    init();
    showBoard();

    return false;
}

async function addRecord(score, yourname) {
    $('#board .dialog').hide();
    if (! yourname) return;
    let date = Date.now();
    let record;
    if (pref.private) {
        record = JSON.parse(localStorage.getItem('Nyanko.record')||'[]');
        record.push({ score: score, name: yourname, date: date });
        record = record.sort((a, b)=> a.score - b.score).slice(0, 10);
        localStorage.setItem('Nyanko.record', JSON.stringify(record));
    }
    else {
        await fetch(url, {
                method:  'POST',
                headers: { 'content-type': 'application/json' },
                body:    JSON.stringify(
                            { score: score, name: yourname, date: date }) });
        record = (await (await fetch(url)).json()).slice(0, 10);
    }
    if (record.find(r => r.score == score && r.name == yourname
                            && r.date == date))
    {
        await showRecord(score, yourname, date);
        $('#board').hide();
        $('#pref').hide();
        $('#rule').hide();
        $('#score').slideDown();
    }
}

function showBoard() {
    $('#pref').hide();
    $('#score').hide();
    $('#rule').hide();
    $('#board').show();
    return false;
}

function showPref() {

    if (pref.size) {
        $('form#pref input[name="size"]').val(['custom']);
        $('form#pref input[name="x"]').val(pref.size.x);
        $('form#pref input[name="y"]').val(pref.size.y);
        $('form#pref input[name="n"]').val(pref.size.n);
    }
    else {
        $('form#pref input[name="size"]').val(['default']);
    }
    $('form#pref input[name="private"]').val([pref.private || 0]);

    $('#board').hide();
    $('#score').hide();
    $('#rule').hide();
    $('#pref').slideDown();
    return false;
}

async function showRecord(score, yourname, date) {

    $('#score td.name').text('');
    $('#score td.score').text('');
    $('#score td.date').text('');
    $('#score tr').removeClass('new');
    $('#score tr:gt(10)').remove();
    const tr = $('#score tr').eq(1).clone();
    $('#score .more').hide();

    let recored = [];
    if (pref.private) {
        record = JSON.parse(localStorage.getItem('Nyanko.record')||'[]');
    }
    else {
        record = await (await fetch(url)).json();
    }

    let i = 0;
    for (let r of record.slice(0,500)) {
        if ($('#score tr').length < i + 2) {
            $('#score table').append(tr.clone().hide());
            $('#score td.rank').eq(i).text(i + 1);
            $('#score .more').show();
        }
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

    $('#board').hide();
    $('#pref').hide();
    $('#rule').hide();
    $('#score').slideDown();
}

function showRule() {
    $('#board').hide();
    $('#pref').hide();
    $('#score').hide();
    $('#rule').slideDown();
    return false;
}

$(function(){

    $('a[href="#board"]').on('click', showBoard);
    $('a[href="#pref"]').on('click', showPref);
    $('a[href="#score"]').on('click', ()=>{ showRecord(); return false });
    $('a[href="#rule"]').on('click', showRule);
    $('form#pref').on('submit', submit);
    $('[name="x"], [name="y"], [name="n"]').on('change', ()=>
                            $('form#pref input[name="size"]').val(['custom']));
    $('#score .more').on('click', ()=>{
        $('#score tr').show();
        $('#score .more').hide();
        return false;
    })

    pref = JSON.parse(localStorage.getItem('Nyanko.pref')||'{}');
    $('#board input[name="yourname"]').val(pref.yourname);

    board = new Board($('#board'));

    fetch(url);

    $('#loading').hide();

    init();
});
