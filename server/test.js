/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const maitre = require('./maitre');

maitre.get().then(function(result){
  console.log(result);
});

const [,, searchLink] = process.argv;
console.log('wait dude');
