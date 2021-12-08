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
    // Fetch related Species document to extract its _id value
    // Species.findOne({ name: req.params.species_name })
    //   .exec((err, species) => {
    //     if (err) { return next(err); }
    //     animal.species = species._id;
    //     animal.save((err) => {
    //       // Animal saved - redirect to its detail page
    //       res.redirect(animal.url);
    //     })
    //   });

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

      // fetch Species document to get animal.species value (_id)
      // Save animal document
      // Populate animal.species for url virtual
      // redirect using url virtual

  },
];

exports.animal_update_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Animal update GET for animal with id ${ req.params.animal_id }`)
};

exports.animal_update_post = (req, res) => {
  res.send(`NOT IMPLEMENTED: Animal update POST for animal with id ${ req.params.animal_id }`);
};

exports.animal_delete_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Animal delete GET for animal with id ${ req.params.animal_id }`);
};

exports.animal_delete_post = (req, res) => {
  res.send(`NOT IMPLEMENTED: Animal delete POST for animal with id ${ req.params.animal_id }`);
};
