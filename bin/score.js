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
        this.record = this.record.slice(-1000);
        fs.writeFileSync(this.file,
                    this.record.map(r=>`${r.date}\t${r.score}\t${r.name}\n`)
                               .join(''));
    }
    get() {
        return (req, res)=>{
            res.json(this.record.toSorted((a, b)=> a.score - b.score));
        };
    }
    post() {
        return (req, res)=>{
            if (! req.session) return res.status(403).end('<h1>Forbidden</h1>');
            if (! req.body) return res.status(400).end('<h1>Bad Request</h1>');
            let { score, name, date } = req.body;
            if (! score || ! name || ! date )
                            return res.status(400).end('<h1>Bad Request</h1>');
            this.record.push({ score: + score, name: name, date: + date });
            this.save();
            res.status(200).end('<h1>OK</h1>');
        };
    }
}

module.exports = function(file) { return new Score(file) }
