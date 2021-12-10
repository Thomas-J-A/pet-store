const Species = require('../models/species');
const Animal = require('../models/animal');

const async = require('async');
const { body, validationResult } = require('express-validator');
// const species = require('../models/species');

exports.animal_detail = (req, res, next) => {
  Animal.findById(req.params.animal_id)
    .populate('species')
    .exec((err, animal) => {
      if (err) { return next(err); }
      res.render('animal_detail', { animal });
    });
};

exports.animal_create_get = (req, res) => {
  res.render('animal_form', { title: 'Add New Entry' });
};

exports.animal_create_post = [
  // Validate and sanitize input
  body('name', 'A name is required').trim().isLength({ min: 1 }).escape(),
  body('gender', 'A gender is required').trim().isLength({ min: 1 }).escape(),
  body('age', 'Age must be greater than 0').isInt({ gt: 0 }),
  body('description', 'A description is required').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price must be greater than 0').isInt({ gt: 0 }),

  // Process request after validatio and sanitization
  (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create Animal object/document with escaped and trimmed data
    const animal = new Animal({
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      description: req.body.description,
      price: req.body.price,
    });

    // Check for validation errors
    if (!errors.isEmpty()) {
      // There are errors; re-render form with sanitized values/error messages
      res.render('animal_form', { title: 'Add New Entry', animal, errors: errors.array() });
      return;
    }

    // Data from form is valid
    // 1. Fetch Species document to get animal.species value (_id)
    // 2. Save animal document
    // 3. Populate animal.species for url virtual
    // 4. redirect using url virtual

      async.series([
        (callback) => {
          Species.findOne({ name: req.params.species_name })
            .exec((err, species) => {
              if (err) { return next(err); }
              animal.species = species._id;
              callback();
            });
        },
        (callback) => {
          animal.save((err) => {
            if (err) { return next(err); }
            callback();
          });
        },
        (callback) => {
          Animal.populate(animal, { path: 'species' }, (err) => {
            if (err) { return next(err); }
            callback();
          });
        },
      ], (err, results) => {
        res.redirect(animal.url);
      });
  },
];

exports.animal_update_get = (req, res, next) => {
  Animal.findById(req.params.animal_id)
    .exec((err, animal) => {
      if (err) { return next(err); }
      res.render('animal_form', { title: 'Update Entry', animal });
    });
};

exports.animal_update_post = [
  body('name', 'A name is required').trim().isLength({ min: 1 }).escape(),
  body('gender', 'A gender is required').trim().isLength({ min: 1 }).escape(),
  body('age', 'Age must be greater than 0').isInt({ gt: 0 }),
  body('description', 'A description is required').trim().isLength({ min: 1 }).escape(),
  body('price', 'Price must be greater than 0').isInt({ gt: 0 }),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create new Animal object/doc with escaped/trimmed data
    const animal = new Animal({
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      description: req.body.description,
      price: req.body.price,
      // Use old _id to ensure a new one isn't implicitly created
      // and used to overide the current value upon updating the database
      _id: req.params.animal_id,
    });

    if (!errors.isEmpty()) {
      // There are errors - re-render form with sanitized values/error messages
      res.render('animal_form', { title: 'Update Entry', animal, errors: errors.array() });
      return;
    }

    // Updated data is valid
    // 1. Update Animal record
    // 2. Populate animal.species for url virtual in redirect
    // 3. Redirect to animal details page

    async.waterfall([
      (callback) => {
        Animal.findByIdAndUpdate(req.params.animal_id, animal, (err, animal) => {
          console.log(animal);
          if (err) { return next(err); }
          callback(null, animal);
        });
      },
      (animal, callback) => {
        Animal.populate(animal, { path: 'species' }, (err) => {
          console.log(animal);
          if (err) { return next(err); }
          callback(null, animal);
        });
      },
    ], (err, animal) => {
      console.log(animal)
      res.redirect(animal.url);
    });
  },
];

exports.animal_delete_get = (req, res, next) => {
  Animal.findById(req.params.animal_id)
    .populate('species')
    .exec((err, animal) => {
      if (err) { return next(err); }
      if (animal === null) {
        // No matching Animal record exists - redirect to list of species
        res.redirect('/species');
        return;
      }
      res.render('animal_delete', { animal });
    });
};

exports.animal_delete_post = (req, res, next) => {
  // Delete record and and redirect to list of animals
  Animal.findByIdAndRemove(req.params.animal_id, (err) => {
    if (err) { return next(err); }
    res.redirect(`/inventory/species/${ req.params.species_name }`);
  });
};
