const {
    Book
} = require('../models');
const fs = require('fs');

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();

        return res.json(books);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération des livres',
            error: error.message
        });
    }
};

// Get a book
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findOne({
            _id: req.params.id
        });

        if (!book) {
            return res.status(404).json({
                message: 'Livre non trouvé'
            });
        }

        return res.json(book);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la récupération du livre',
            error: error.message
        });
    }
}

// Get 3 best rated books
exports.getBestRatings = async (req, res) => {
    try {
        const books = await Book.find().sort({
            note: -1
        }).limit(3);

        return res.json(books);
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
        const host = req.get('host');

        if (!req.file) {
            return res.status(400).json({
                message: 'Veuillez ajouter une image'
            });
        }

        const dataBook = JSON.parse(req.body.book);

        const book = {
            userId: dataBook.userId,
            imageUrl: `${req.protocol}://${host}/images/${req.file.filename}`,
            title: dataBook.title,
            author: dataBook.author,
            year: dataBook.year,
            genre: dataBook.genre,
            ratings: [{
                userId: dataBook.ratings[0].userId,
                grade: dataBook.ratings[0].grade
            }],
            averageRating: dataBook.averageRating
        }

        await Book.create(book);

        return res.status(201).json(book);
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
        const id = req.params.id;
        const {
            userId,
            rating
        } = req.body;

        if (rating < 0 || rating > 5 || isNaN(rating)) {
            return res.status(400).json({
                message: 'La note doit être comprise entre 0 et 5'
            });
        }

        const book = await Book.findById(id);

        const userRating = book.ratings.find(rating => rating.userId === userId);
        if (userRating) {
            return res.status(400).json({
                message: 'Vous avez déjà noté ce livre'
            });
        }

        const newRating = {
            userId: userId,
            grade: rating
        };

        const arrayRatings = [...book.ratings, newRating]; // Ajouter la nouvelle note
        const addRatings = arrayRatings.reduce((acc, curr) => acc + curr.grade, 0); // Calculer la somme des notes
        const averageRating = addRatings / arrayRatings.length; // Calculer la moyenne des notes

        const bookUpdate = await Book.findByIdAndUpdate(
            id, {
                averageRating: averageRating,
                ratings: arrayRatings
            }, {
                new: true
            }
        );

        return res.json(bookUpdate);
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
        const book = await Book.findById(req.params.id);
        verifyBookUser(req.userId, book.userId, res)

        // Supprimer l'image
        deleteImage(book.imageUrl);

        await Book.findOneAndDelete({
            _id: req.params.id
        });

        return res.status(200).json({
            message: 'Livre supprimé avec succès',
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
        const host = req.get('host');
        const book = await Book.findById(req.params.id);
        verifyBookUser(req.userId, book.userId, res)

        if (req.file) {
            // Supprimer l'ancienne image
            deleteImage(book.imageUrl);

            // Mettre à jour l'image
            req.body.image = `${req.protocol}://${host}/images/${req.file.filename}`;
        }

        const dataBook = {
            imageUrl: req.body.image,
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            genre: req.body.genre,
        };

        const bookUpdate = await Book.findByIdAndUpdate(
            req.params.id,
            dataBook, {
                new: true
            }
        );

        return res.json(bookUpdate);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification du livre',
            error: error.message
        });
    }
}

function deleteImage(bookImageUrl) {
    const filename = bookImageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, (error) => {
        if (error) {
            console.error(error);
        }
    });
}

function verifyBookUser(currentUser, ownerID, res) {
    // verifier que l'utilisateur courant est le propriétaire du livre
    if (currentUser !== ownerID) {
        throw new Error("L'utilisateur courant n'est pas le propriétaire du livre")
    }
}