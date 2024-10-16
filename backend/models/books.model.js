const mongoose = require('mongoose');

const Book = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String, // monimage.png
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    averageRating: {
        type: Number,
        required: false,
        default: 0,
    },
    ratings: {
        type: Array,
        required: false,
    },
});

module.exports = mongoose.model('Book', Book);