const express = require('express');
const path = require('path');

// Import routes
const indexRouter = require('./routes/index');

const PORT = process.env.PORT || 5000;
const app = express();

// Set up MongoDB connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://tja:vamonos@cluster0.f5fh6.mongodb.net/pet-store?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize routes into request chain
app.use('/', indexRouter);

app.listen(PORT, () => console.log(`Server listening for requests at port ${ PORT }`));
