/*
 *  score.js
 */
"use strict";

const fs = require('fs');

class Score {

    constructor(file) {
        this.file = file;
        this.record
            = fs.readFileSync(file, 'utf-8')
                .split(/\n/).filter(r=>r)
                .map(r=>{ r = r.split(/\t/);
                          return { score: +r[1], name: r[2], date: +r[0] } });
        this.save();
    }
    save() {
        fs.writeFileSync(this.file,
                    this.record.map(r=>`${r.date}\t${r.score}\t${r.name}\n`)
                               .join(''));
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
