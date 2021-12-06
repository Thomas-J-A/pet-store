const Species = require('./models/species');
const Animal = require('./models/animal');

const async = require('async');

const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://tja:vamonos@cluster0.f5fh6.mongodb.net/pet-store?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let speciesArr = [];

const speciesCreate = (name, description, cb) => {
  const species = new Species({ name, description });

  species.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }

    console.log(`New Species: ${ species }`);
    speciesArr.push(species);
    cb(null, species);
  });
};

// species field is an object, is it cast to an ObjectId upon validation?
const animalCreate = (name, gender, age, description, species, price, cb) => {
  const animal = new Animal({ name, gender, age, description, species, price });

  animal.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }

    console.log(`New Animal: ${ animal }`);
    cb(null, animal);
  });
};

const createSpecies = (cb) => {
  async.parallel([
    (callback) => speciesCreate('Ibex', 'The GOAT of goats.', callback),
    (callback) => speciesCreate('Armadillo', 'Like Sandshrew, but real.', callback),
    (callback) => speciesCreate('Fox', 'A chicken\'s worst nightmare.', callback),
    (callback) => speciesCreate('Moose', 'An unfriendly Canadian.', callback),
    (callback) => speciesCreate('Racoon', 'Not much they wouldn\'t eat.', callback),
    (callback) => speciesCreate('Dog', 'Man\'s best friend.', callback),
    (callback) => speciesCreate('Quokka', 'Happy to take a selfie.', callback),
    (callback) => speciesCreate('Sheep', 'Actually have long tails.', callback),
  ], cb);
};

const createAnimals = (cb) => {
  async.parallel([
    (callback) => {
      animalCreate('Frank', 'Male', 16, 'Not good with people. Has killed a cat.', speciesArr[0], 250, callback);
    },
    (callback) => {
      animalCreate('Conan', 'Non-binary', 4, 'Likes playing with Lego. Hates spiders.', speciesArr[0], 400, callback);
    },
    (callback) => {
      animalCreate('Snobber', 'Male', 2, 'Has an aggressive streak but is generally non-lethal.', speciesArr[1], 99, callback);
    },
    (callback) => {
      animalCreate('Miranda', 'Female', 12, 'Has a habit of chewing iPhone cables.', speciesArr[1], 50, callback);
    },
    (callback) => {
      animalCreate('Stanley', 'Male', 16, 'Often attempts to run away. Cannot be trusted.', speciesArr[2], 160, callback);
    },
    (callback) => {
      animalCreate('Thomas', 'Non-binary', 22, 'Enjoys having their antlers polished with a scourer.', speciesArr[3], 350, callback);
    },
    (callback) => {
      animalCreate('Philip', 'Male', 33, 'Has had the vaccine. Likes children.', speciesArr[3], 200, callback);
    },
    (callback) => {
      animalCreate('Julia', 'Female', 12, 'Enjoys classical music and walks through the national parks.', speciesArr[3], 250, callback);
    },
    (callback) => {
      animalCreate('Garth', 'Male', 4, 'Slightly obese and has a heart condition. Lovely character.', speciesArr[4], 20, callback);
    },
    (callback) => {
      animalCreate('Sandra', 'Female', 17, 'Doesn\'t like to be touched. Ex-stray.', speciesArr[5], 60, callback);
    },
    (callback) => {
      animalCreate('Margaret', 'Female', 10, 'Friendly character but shy around dogs and gorillas.', speciesArr[6], 140, callback);
    },
    (callback) => {
      animalCreate('Julio', 'Male', 4, 'Lively little Quokka. Trained singer.', speciesArr[6], 210, callback);
    },
    (callback) => {
      animalCreate('Maximillian', 'Male', 16, 'Very fussy with food but will protect a plot of land admirably.', speciesArr[7], 130, callback);
    },
  ], cb);
};

async.series([
  createSpecies,
  createAnimals,
], (err, results) => {
  if (err) console.log(`FINAL ERR: ${ err }`);
  else console.log('Database has been occupied like the Ukraine.');
  // All done, disconnect from database
  mongoose.connection.close();
});
