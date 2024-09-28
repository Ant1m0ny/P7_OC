const db = require('./../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = db.Users;

// Create and Save a new User
exports.signup = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Un email et un mot de passe sont requis"
        });
    }

    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = {
            email: req.body.email,
            password: hash
        }

        await Users.create(user)

        return res.status(201).json({
            message: 'L\'utilisateur a bien été créé'
        })
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    }
}

// Connect a User
exports.login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });

    if (user === null) {
        return res.status(404).json({
            message: 'Utilisateur non trouvé'
        })
    } else {
        const valid = await bcrypt.compare(req.body.password, user.password)

        if (!valid) {
            return res.status(401).json({
                error: new Error('Mot de passe incorrect')
            })
        }

        return res.status(200).json({
            userId: user.id,
            token: jwt.sign({
                    userId: user.id,
                    iat: Math.floor(Date.now() / 1000) - 30 // L'iat sert à bloquer le token pendant 30 secondes
                },
                process.env.TOKEN_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '24h'
                }
            )
        })

    }
}