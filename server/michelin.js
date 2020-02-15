const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parseLink = data => {
  const $ = cheerio.load(data);
  const links = [];
  
  $('a.link').each( function() {
    var link = $(this).attr('href');
    links.push({"link": link});
  });

  return {links};
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
scrapeLink = async url => {
  const response = await axios.get(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseLink(data);
  }

  console.error(status);

  return null;
};


const parseNumber = data => {
  const $ = cheerio.load(data);
  let number = '';
  let result = $('.search-results__count').text();
  let index = result.indexOf("sur");
  for(let i = index; i < result.length; i++)
  {
    if(/^\d+$/.test(result[i]))
    {
      number += result[i];
    }
  }
  if(number % 20 < 10)
  {
    return [Math.round(number/20) + 1, number];
  }
  else
  {
    return [Math.round(number/20), number];
  }
};

scrapeNumber = async url => {
  const response = await axios.get(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parseNumber(data);
  }

  console.error(status);

  return null;
};


const parse = data => {
  const $ = cheerio.load(data);
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  const experience = $('#experience-section > ul > li:nth-child(2)').text();
  let adresse = $('.section-main > div > ul.restaurant-details__heading--list > li:nth-child(1)').text();
  const price = $('.section-main .restaurant-details__heading-price').text();
  let img = $('.masthead__gallery-image-item').attr('data-image');
  console.log(img);
  if (adresse[0] == '\n')
  {
    adresse = $('.section-main > div > ul.restaurant-details__heading--list > li:nth-child(2)').text();
  }
  let priceRange = '';
  let cooking = '';
  let next = false;
  let index = price.indexOf("-");
  for(let i = 0; i < price.length; i++)
  {
    if( i < index)
    {
      if(/^\d+$/.test(price[i]))
      {
        priceRange += price[i];
      }
    }
    else if (i == index)
    {
      priceRange += " - ";
    }
    else
    {
      if(/^\d+$/.test(price[i]))
      {
        priceRange += price[i];
      }
    }
    if(/^[A-Z]+$/.test(price[i]) && i > price.indexOf('•'))
    {
      next = true;
    }
    else if(price[i] == '\n')
    {
      next = false;
    }
    if(next)
    {
      cooking += price[i];
    }
  }
  let feeling = '';
  for(let i = 0; i < experience.length; i++)
  {
    if(/^[A-Z]+$/.test(experience[i]))
    {
      next = true;
    }
    else if(experience[i] == '\n')
    {
      next = false;
    }
    if(next)
    {
      feeling += experience[i];
    }
  }
  return {name, adresse, feeling, priceRange, cooking, img};
};

scrapeRestaurant = async url => {
  const response = await axios.get(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = async () => {
  try {
    const searchLink = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/1';
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);

    const page = await scrapeNumber(searchLink);
    const links = [];
    var rest;
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('bib.json', 'utf8'));
    if(obj.restaurants.length == page[1])
    {
      rest = obj;
    }
    else
    {
      console.log('New restaurant has been added in bib gourmant site, updating json file ...');
      rest = {
        restaurants : []
      };
      for(let i = 1; i <= page[0]; i++)
      {
        const temp = await scrapeLink('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/' + i);
        let len = temp.links.length;
        for(let k = 0; k < len; k++)
        { 
          links.push(temp.links[k].link);
        }
      }
      console.log('links get.');
      
      for(let i = 0; i < links.length; i++)
      {
        const shop = await scrapeRestaurant('https://guide.michelin.com' + links[i]);
        rest.restaurants.push(shop);
        rest.restaurants[i].url = 'https://guide.michelin.com' + links[i];
      }
      var json = JSON.stringify(rest);
      fs.writeFileSync('bib.json', json, 'utf8', (err) => {
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