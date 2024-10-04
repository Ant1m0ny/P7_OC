const mongoose = require('mongoose');

const Book = mongoose.Schema({
    image: {
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
    note: {
        type: Number,
        required: false,
        default: 0,
    },
});

module.exports = mongoose.model('Book', Book);