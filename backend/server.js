import express from 'express'
import {
    MongoClient,
    ObjectId
} from 'mongodb'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
    authMiddleware
} from './middlewares/auth-middleware.js'

const app = express();
const port = 4000;

export const JWT_SECRET = 'superCamille';

// Remplacez par votre URI de connexion MongoDB
const uri = "mongodb+srv://antimony51:VacJMNmB1RvmunDz@clusterp7.8naaj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterP7"
const client = new MongoClient(uri);

app.use(express.json());

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connecté à la base de données MongoDB");
        db = client.db("nomdevotredb"); // Remplacez par le nom de votre base de données
    } catch (error) {
        console.error("Erreur de connexion à MongoDB:", error);
        process.exit(1);
    }
}

// Schéma Joi pour la validation du rating
const ratingSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required()
});


// Middleware de validation pour la mise à jour du rating
function validateRating(req, res, next) {
    const {
        error
    } = ratingSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: 'Rating invalide',
            error: error.details[0].message
        });
    }
    next();
}

app.get('/', (req, res) => {
    res.send('Bonjour, monde !');
});

app.get('/api/books', authMiddleware, async (req, res) => {
    try {
        const collection = db.collection('books');
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des livres',
            error: error.message
        });
    }
});

app.get('/api/books/bestrating', async (req, res) => {
    try {
        const collection = db.collection('books');
        const data = await collection.find().sort({
                rating: -1
            })
            .limit(3)
            .toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des livres',
            error: error.message
        });
    }
});


app.post('/api/auth/login', async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body

        const collection = db.collection('users');
        const user = await collection.findOne({
            email,
        })

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        const token = jwt.sign({
                userId: user._id,
                email: user.email
            },
            JWT_SECRET, {
                expiresIn: '1h'
            } // Le token expire après 1 heure
        );

        res.json({
            message: 'Authentifié avec succès',
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de l'authentification",
            error: error.message
        });
    }
});


app.post('/api/auth/signup', async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            email,
            password: hashedPassword
        }

        const collection = db.collection('users');
        const result = await collection.insertOne(user)
        res.json({
            message: 'Compte crée avec succès',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la création du compte',
            error: error.message
        });
    }
});


app.post('/api/books', async (req, res) => {
    try {
        const collection = db.collection('books');
        const result = await collection.insertOne(req.body);
        res.json({
            message: 'Livre inséré avec succès',
            insertedId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de l\'insertion des données',
            error: error.message
        });
    }
});


app.post('/api/books/:id/rating', (req, res) => {
    const body = req.body;
    console.log(req)
    const rating = body.rating;
    res.status(200).json({
        message: 'Rating added successfully'
    });
});


app.patch('/api/books/:id/rating', validateRating, async (req, res) => {
    try {
        const collection = db.collection('books');
        const id = new ObjectId(req.params.id);
        const {
            rating
        } = req.body;

        const result = await collection.updateOne({
            _id: id
        }, {
            $set: {
                rating: rating
            }
        });

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'Livre non trouvé'
            });
        }

        if (result.modifiedCount === 0) {
            return res.status(200).json({
                message: 'Aucune modification nécessaire'
            });
        }

        const updatedBook = await collection.findOne({
            _id: id
        });
        res.json({
            message: 'Rating mis à jour avec succès',
            book: updatedBook
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du rating',
            error: error.message
        });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        const collection = db.collection('books');
        console.log(req.params)
        const id = new ObjectId(req.params.id);
        console.log(id)
        const result = await collection.deleteOne({
            _id: id
        });

        if (result.deletedCount === 1) {
            res.json({
                message: 'Livre supprimé avec succès'
            });
        } else {
            res.status(404).json({
                message: 'Livre non trouvé'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression du livre',
            error: error.message
        });
    }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        const collection = db.collection('books');
        const id = new ObjectId(req.params.id);
        const result = await collection.updateOne({
            _id: id
        }, {
            $set: req.body
        }, {
            upsert: true
        })
        res.json({
            message: 'Livre inséré avec succès',
            insertedId: result.insertedId
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de l\'insertion des données',
            error: error.message
        });
    }
});

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`L'application écoute sur http://localhost:${port}`);
    });
});