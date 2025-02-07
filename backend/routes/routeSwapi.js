const swapiController = require('../controllers/ctrlSwapi');
const { login, logout } = require('../middlewares/auth');

// Définition de nos routes

const routes = [
    {
        method: 'POST',
        path: '/login',
        handler: login,
        options: { auth: false } // Route publique, non protégée par le auth.js
    },
    {
        method: 'POST',
        path: '/logout',
        handler: logout,
        options: { auth: false } // idem
    },
    {
        method: 'GET',
        path: '/search-all',
        handler: swapiController.searchAllCategories,
        options: { auth: 'jwt' } // Requiert d'être connecté
    },
    {
        method: 'GET',
        path: '/validate-token',
        handler: (request, h) => {
            return h.response({ message: 'Token is valid', user: request.auth.credentials }).code(200);
        },
        options: { auth: 'jwt' } // Requiert un token valide
    }
];

module.exports = routes;
