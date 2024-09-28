const db = require('./../models');
const Books = db.Books;

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const data = await Books.findAll().toArray();

        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des livres',
            error: error.message
        });
    }
};

// Get bestrated books
exports.getBestRatings = async (req, res) => {
    try {
        const data = await Books.find().sort({
                rating: -1
            })
            .limit(3)
            .toArray();

        return res.json(data);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des livres',
            error: error.message
        });
    }
}

// Add a book
exports.addBook = async (req, res) => {
    try {
        const result = await Books.insertOne(req.body);

        return res.json({
            message: 'Livre inséré avec succès',
            bookId: result.insertedId
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de l\'ajout du livre',
            error: error.message
        });
    }
}

// Rate a book
exports.ratingBook = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const {
            rating
        } = req.body;

        // Check if the rating is between 0 and 5
        if (rating < 0 || rating > 5) {
            return res.status(400).json({
                message: 'La note doit être comprise entre 0 et 5'
            });
        }

        const result = await Books.updateOne({
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

        const book = await Books.findOne({
            _id: id
        });

        return res.json({
            message: 'Livre noté avec succès',
            book: book
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la notation du livre',
            error: error.message
        });
    }
}

// Delete a book
exports.deleteBook = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await Books.deleteOne({
            _id: id
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Livre non trouvé'
            });
        }

        return res.json({
            message: 'Livre supprimé avec succès'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la suppression du livre',
            error: error.message
        });
    }

}

// Update a book
exports.updateBook = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await Books.updateOne({
            _id: id
        }, {
            $set: req.body
        }, {
            upsert: true
        })

        return res.json({
            message: 'Livre modifié avec succès',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification du livre',
            error: error.message
        });
    }
}