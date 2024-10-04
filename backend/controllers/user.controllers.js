const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create and Save a new User
exports.signup = async (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Un email et un mot de passe sont requis"
        });
    }

    // check email format
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;
    if (!emailRegex.test(req.body.email)) {
        return res.status(400).send({
            message: "L'email n'est pas valide"
        });
    }

    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = {
            email: req.body.email,
            password: hash
        }

        await User.create(user)

        return res.status(201).json({
            message: 'L\'utilisateur a bien été créé'
        })
    } catch (err) {
        return res.status(500).send({
            message: 'Une erreur est survenue lors de la création de l\'utilisateur',
            error: err.message
        });
    }
}

// Connect a User
exports.login = async (req, res) => {

    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({
                message: "Un email et un mot de passe sont requis"
            });
        }

        // check email format
        const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).send({
                message: "L'email n'est pas valide"
            });
        }

        const user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            })
        }

        const valid = await bcrypt.compare(req.body.password, user.password)

        if (!valid) {
            return res.status(401).json({
                message: 'Mot de passe incorrect',
            })
        }

        return res.status(200).json({
            userId: user.id,
            token: jwt.sign({
                    userId: user.id
                },
                process.env.TOKEN_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '24h'
                }
            )
        })
    } catch (err) {
        return res.status(500).send({
            message: 'Une erreur est survenue lors de la connexion, veuillez réessayer',
            error: err.message
        });
    }
}