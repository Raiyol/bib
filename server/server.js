'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bib = require('./bib');
const cors = require('cors');

const server = express();
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended : true}));

bib.get().then(function(result){
    server.get('/bib', (req, res) => {
        res.send({express : result});
    })
});

