const express = require('express');
const path = require('path');
require('dotenv').config();

// Swagger
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('./swagger.yaml');

const app = express()

const usersRoutes = require('./routes/user.routes');
const booksRoutes = require("./routes/books.routes");
const mongoose = require('mongoose');

// Middleware
const rateLimit = require('./middlewares/rate-limit-middleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

mongoose.connect(process.env.DATABASE_URL, {
        dbName: process.env.DATABASE_NAME
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.use(rateLimit)

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', usersRoutes);
app.use('/api/books', booksRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;