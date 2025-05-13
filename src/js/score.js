/*
 *  score.js
 */
"use strict";

const fs = require('fs');

class Score {

    constructor(file) {
        this.file = file;
        this.record = JSON.parse(fs.readFileSync(file));
        this.save();
    }
    save() {
        fs.writeFileSync(this.file, JSON.stringify(this.record));
    }
    get() {
        return (req, res)=>{
            res.json(this.record.sort((a, b)=> a.score - b.score));
        };
    }
    post() {
        return (req, res)=>{
            let { score, name, date } = req.body;
            this.record.push({ score: + score, name: name, date: + date });
            this.save();
            res.status(200).end();
        };
    }
}

module.exports = function(file) { return new Score(file) }
