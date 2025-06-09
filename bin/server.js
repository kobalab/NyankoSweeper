#!/usr/bin/env node

"use strict";

const fs    = require('fs');
const path  = require('path');

const yargs = require('yargs');
const argv = yargs
    .usage('Usage: $0 [ options... ] score-file')
    .option('port',     { alias: 'p', default: 4187 })
    .option('baseurl',  { alias: 'b', default: '/score'})
    .option('docroot',  { alias: 'd' })
    .option('store',    { alias: 's' })
    .demandCommand(1)
    .argv;
const file = path.resolve(argv._[0]);
const port = argv.port;
const base = ('' + argv.baseurl)
                    .replace(/^(?!\/.*)/, '/$&')
                    .replace(/\/$/,'');
const docs = argv.docroot && path.resolve(argv.docroot);

const score    = require('./score')(file);
const express  = require('express');
const store    = ! argv.store ? null
               : new (require('session-file-store')(
                        require('express-session')))(
                            { path:  path.resolve(argv.store),
                              logFn: ()=>{} });
const session  = require('express-session')({
                            name:   'NYANKO',
                            secret: 'keyboard cat',
                            resave: false,
                            saveUninitialized: true,
                            store:  store });

const app = express();
app.use(session);
app.use(express.json());
app.get(base, score.get());
app.post(base, score.post());
if (docs) app.use(express.static(docs));
app.use((req, res)=>res.status(404).send('<h1>Not Found</h1>'));

app.listen(port,
    ()=> console.log(
        `Server start on http://127.0.0.1:${port}${base}`,
        docs ? `(docroot=${docs})` : '')
).on('error', (e)=>{
    console.error('' + e);
    process.exit(-1);
});
