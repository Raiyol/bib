/* eslint-disable no-console, no-process-exit */
const bib = require('./bib');

bib.get().then(function(result){
  console.log(result);
});

/*
maitre.get().then(function(result){
  console.log(result);
});*/
const [,, searchLink] = process.argv;
