const Jwt = require('@hapi/jwt');

// Fonction d'authentification par jwt

exports.registerAuth = async (server) => {
    await server.register(Jwt);

    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.JWT_SECRET,
        verify: { 
            aud: 'urn:audience', 
            iss: 'urn:issuer', 
            sub: false, 
            maxAgeSec: 86400 // 24 hours
        },
        validate: (artifacts, request, h) => {
            return { isValid: true, credentials: artifacts.decoded.payload };
        }
    });

    server.auth.default('jwt'); // jwt devient la méthode d'authentification par défaut
};

// Fonction de connexion et stockage du token dans les cookies
exports.login = async (request, h) => {
    const { username, password } = request.payload;
    if (username !== process.env.API_USERNAME || password !== process.env.API_PASSWORD) {
        return h.response({ error: 'Invalid credentials' }).code(401);
    }

    // Generation du token
    const token = Jwt.token.generate(
        { user: username,
        aud: 'urn:audience', 
        iss: 'urn:issuer'
         },
        { key: process.env.JWT_SECRET, algorithm: 'HS256' },
        { ttlSec: 86400 } // 24 hours
    );

    // stocke le token dans les cookies (pas d'encryption hapi)
    return h.response({ message: 'Login successful' })
        .state('token', token, { 
            isHttpOnly: true, 
            isSecure: false, 
            sameSite: 'Strict', 
            path: '/', 
            ttl: 86400000 // 24 hours
        })
        .code(200);
};

// Fonction de déconnexion (clear des cookies)
exports.logout = async (request, h) => {
    return h.response({ message: 'Logged out successfully' })
        .unstate('token')
        .code(200);
};
