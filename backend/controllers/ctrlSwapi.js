const axios = require('axios');

//Définition des catégories

const CATEGORIES = ['people', 'planets', 'starships', 'vehicles', 'species', 'films'];

exports.searchAllCategories = async (request, h) => {
    try {
        // Recherche simultanée de l'élément sur toutes les catégories
        const promises = CATEGORIES.map(category => axios.get(`https://swapi.dev/api/${category}/`));
        const responses = await Promise.all(promises);

        // Structure de la réponse
        const result = {};
        CATEGORIES.forEach((category, index) => {
            result[category] = responses[index].data;
        });
        return h.response(result).code(200);
    } catch (error) {
        return h.response({ error: 'Error fetching data from SWAPI' }).code(500);
    }
};
