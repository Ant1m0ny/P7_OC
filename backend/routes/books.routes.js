const express = require('express');
const router = express.Router();
const controllers = require('../controllers/books.controllers');

const auth = require('../middlewares/auth-middleware')
const multer = require('../middlewares/multer-middleware');

router.get('/', controllers.getBooks); // Récupérer tous les livres
router.get('/bestrating', controllers.getBestRatings); // Récupérer les 3 livres les mieux notés
router.get('/:id', controllers.getBook);

router.post('/', auth, multer, controllers.addBook); // Ajouter un livre
router.post('/:id/rating', auth, controllers.ratingBook); // Noter un livre
router.delete('/:id', auth, controllers.deleteBook); // Supprimer un livre
router.put('/:id', auth, multer, controllers.updateBook); // Modifier un livre

module.exports = router;