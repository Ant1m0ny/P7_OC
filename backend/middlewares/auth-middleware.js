import {
    JWT_SECRET
} from '../server.js'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    try {
        // Récupération du token depuis les en-têtes
        const token = req.headers.authorization.split(' ')[1]; // Format: "Bearer TOKEN"

        // Vérification du token
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // Ajout des informations de l'utilisateur à l'objet request
        req.userData = {
            userId: decodedToken.userId,
            email: decodedToken.email
        };

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentification échouée',
            error
        });
    }
};