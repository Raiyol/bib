const michelin = require('./michelin');
const maitre = require('./maitre');

module.exports.get = async () => {
    const bib = await michelin.get();
    const restaurants = await maitre.get();
    const distinction = [];
    
    restaurants.forEach(element => {
        bib.forEach(elem => {
            if(element.name.toLowerCase() == elem.name.toLowerCase())
            {
                let cp1 = element.adresse.split(',');
                let cp2 = elem.adresse.split(',');
                if(cp1[2] == cp2[2])
                {
                    distinction.push({
                        name : elem.name,
                        owner : element.owner,
                        adresse : elem.adresse,
                        tel : element.tel,
                        feeling : elem.feeling,
                        priceRange : elem.priceRange,
                        cooking : elem.cooking,
                        bibURL : elem.url
                    })
                }
            }
        })
    });
    return distinction;
}