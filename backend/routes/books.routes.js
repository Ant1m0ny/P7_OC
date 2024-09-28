const express = require('express');
const router = express.Router();
const controllers = require('../controllers/books.controllers');

router.get('/', controllers.getBooks); // Récupérer tous les livres
router.get('/bestratings', controllers.getBestRatings); // Récupérer les 3 livres les mieux notés
router.post('/', controllers.addBook); // Ajouter un livre
router.patch('/:id/rating', controllers.ratingBook); // Noter un livre
router.delete('/:id', controllers.deleteBook); // Supprimer un livre
router.put('/:id', controllers.updateBook); // Modifier un livre

