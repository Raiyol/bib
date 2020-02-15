/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
//const maitre = require('./maitre');
const bib = require('./bib');

michelin.get().then(function(result){
  console.log(result);
});

const [,, searchLink] = process.argv;