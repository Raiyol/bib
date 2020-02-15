const michelin = require('./michelin');
const maitre = require('./maitre');

module.exports.get = async () => {
    const bib = await michelin.get();
    const restaurants = await maitre.get();
    const distinction = [];
    let id = 0;
    restaurants.forEach(element => {
        bib.forEach(elem => {
            if(element.name.toLowerCase() == elem.name.toLowerCase())
            {
                let cp1 = element.adresse.split(',');
                let cp2 = elem.adresse.split(',');
                if(cp1[2] == cp2[2])
                {
                    let lieu = cp2[0];
                    let cp = cp2[2].slice(1, );
                    let city = cp2[1].slice(1, );
                    distinction.push({
                        id : id,
                        name : elem.name,
                        owner : element.owner,
                        adresse : lieu,
                        ville : city,
                        cp : cp,
                        tel : element.tel,
                        feeling : elem.feeling,
                        priceRange : elem.priceRange,
                        cooking : elem.cooking,
                        bibURL : elem.url,
                        img : elem.img
                    })
                    id ++;
                }
            }
        })
    });
    return distinction;
}