const {
    Book
} = require('../models');

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

        // if (!req.file) {
        //     return res.status(400).json({
        //         message: 'Veuillez ajouter une image'
        //     });
        // }

        const book = {
            image: 'test', //`${req.protocol}://${host}/images/${req.file.filename}`, // hhtp://localhost:3000/images/imagename.jpg
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            genre: req.body.genre,
            note: req.body.note
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
            rating
        } = req.body;

        // Check if the rating is between 0 and 5
        if (rating < 0 || rating > 5 || isNaN(rating)) {
            return res.status(400).json({
                message: 'La note doit être comprise entre 0 et 5'
            });
        }

        await Book.findOneAndUpdate({
            _id: id
        }, {
            note: parseFloat(rating)
        });

        const book = await Book.findById(id);

        return res.json(book);
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

        if (req.file) {
            req.body.image = `${req.protocol}://${host}/images/${req.file.filename}`;
        }

        const book = {
            image: req.body.image,
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            genre: req.body.genre,
            note: req.body.note
        }

        await Book.findOneAndUpdate({
            _id: req.params.id
        }, book);

        const bookUpdate = await Book.findById(req.params.id);

        return res.json(bookUpdate);
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur lors de la modification du livre',
            error: error.message
        });
    }
}