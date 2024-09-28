const express = require('express');
const path = require('path');

const app = express()

const db = require("./models").default;
const usersRoutes = require('./routes/user.routes');
const booksRoutes = require("./routes/books.routes");
const mongoose = require('mongoose');

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
        dbName: process.env.DATABASE_NAME
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/auth', usersRoutes);
app.use('/api/books', booksRoutes);

module.exports = app;