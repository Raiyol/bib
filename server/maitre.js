const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');

const parseNumberR = data => {
  const $ = cheerio.load(data);
  let page = $('a.end').attr('data-page');
  let nombre = $('.annuaire_result_topbar .row .title1').text();
  let temp = nombre.split(' ');
  temp.forEach(function(elem) {
    if(/^\d+$/.test(elem))
    {
      nombre = elem;
    }
  });
  return [page, nombre];
};

scrapeNumberR = async url => {
  const response = await axios.post(url, querystring.stringify({
    page : '1',
    sort : 'undefined',
    request_id : '94ae50fa26e8a3906a7283e21a90eec1'
  }));
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseNumberR(data);
  }

  console.error(status);

  return null;
};

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parseRestaurantR = data => {
  const $ = cheerio.load(data);

  const info = [];
  
  $('.annuaire_result_list .single_desc').each( function() {
    let data = $(this).text();
    let line = data.split('\n');
    let name = '';
    let owner = '';
    let adresse = '';
    let tel = '';
    let word
    [3,13,16,22].forEach(function(i) {
      switch (i) {
        case 3:
          let begin = line[i].indexOf('(');
          let end = line[i].indexOf(')');
          for (let j = 12; j < line[i].length; j++) 
          {
            if(j < begin-1)
            {
              name += line[i][j];
            }
            else if(j > begin && j < end)
            {
              owner += line[i][j];
            }
          }
          break;
        case 13:
          word = line[i].split(' ');
          for(let j = 10; j < word.length; j++)
          {
            if(word[j].length >= 1)
            {
              adresse += word[j] + ' ';
            }
          }
          adresse = adresse.slice(0, -1);
          adresse += ', ';
        break;
        case 16:
          word = line[i].split(' ');
          let first = true;
          let cp;
          for(let j = 10; j < word.length; j++)
          {
            if(word[j].length >= 1)
            {
              if(first)
              {
                cp = word[j]
                first = false;
              }
              else
              {
                adresse += word[j] + ' ';
              }
            }
          }
          adresse = adresse.slice(0, -1);
          adresse += ', ' + cp + ', France';
        break;
        case 22:
          word = line[i].split(' ');
          for(let j = 10; j < word.length; j++)
          {
            if(word[j].length >= 1)
            {
              tel += word[j] + ' ';
            }
          }
          tel = tel.slice(0, -1);
        break;
        default:
          break;
      }
    });
    info.push({name, owner, adresse, tel});
    // 3 name ower
    // 13 adresse
    // 16 code postal
    // 22 tel
  });
  console.log(info);
  return info;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
scrapeRestaurantR = async (url,num) => {
  const response = await axios({
    method : 'POST',
    url : url,
    responseEncoding: 'latin1',
    data : querystring.stringify({
      page : num,
      sort : 'undefined',
      request_id : '94ae50fa26e8a3906a7283e21a90eec1'
    })
  });
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return parseRestaurantR(data);
  }

  return null;
};

module.exports.get = async () => {
  try {
    const searchLink = 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult';
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);

    const page = await scrapeNumberR(searchLink);
    var rest;
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('maitre.json', 'utf8', (err) => {
      if (err) throw err;
    }));
    //console.log(obj.restaurants.length, page[1]);
    if(obj.restaurants != undefined && obj.restaurants.length == page[1])
    {
      rest = obj;
    }
    else
    {
      console.log('New restaurant has been added in maitre restaurateur site, updating json file ...');
      rest = {
        restaurants : []
      };
      
      for(let i = 1; i <= page[0]; i++)
      {
        const shop = await scrapeRestaurantR(searchLink, i);
        shop.forEach(element => {
          rest.restaurants.push(element);
        });
      }
      var json = JSON.stringify(rest);
      fs.writeFileSync('maitre.json', json, 'utf8', (err) => {
        if (err) throw err
        console.log('The file has been saved!');
      });
      console.log('done');
    }
    return rest.restaurants;
  }
  catch (e) {
    console.error(e);
    return e;
  }
};