const Hapi = require('@hapi/hapi');
const { registerAuth } = require('./middlewares/auth');
const swapiRoutes = require('./routes/routeSwapi');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:5173'],
                credentials: true
            }
        },
        state: {
            strictHeader: false, // autorise les cookies
        }
    });
    
    // Autorise le support des cookies
    await server.register(require('@hapi/cookie'));

    // Autorise l'authentification jwt
    await registerAuth(server);

    // Lecture du jwt dans les cookies
    server.ext('onPreAuth', (request, h) => {
        if (!request.headers.authorization && request.state.token) {
            request.headers.authorization = `Bearer ${request.state.token}`;
        }
        return h.continue;
    });

    // import de nos routes
    server.route(swapiRoutes);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    return server;
};

module.exports = init;
