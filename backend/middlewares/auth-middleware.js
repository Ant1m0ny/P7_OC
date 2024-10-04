const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    // Vérifier si le token est présent dans le header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

    // Si le token est manquant ou invalide
    if (!token) {
        return res.status(401).json({
            message: 'Token manquant'
        })
    }

    // Vérifier si le token est valide
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        // Si le token est invalide
        if (err) {
            return res.status(401).json({
                message: 'Token invalide'
            })
        }

        // Si le token est valide on stocke l'userId dans la requête
        req.userId = decoded.userId
        next() // On effectue la suite de l'action
    })
};