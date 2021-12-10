const Species = require('../models/species');
const Animal = require('../models/animal');

const async = require('async');
const { body, validationResult } = require('express-validator');
// const species = require('../models/species');

exports.species_list = (req, res, next) => {
  Species.find((err, species) => {
    if (err) { return next(err); }
    res.render('species_list', { species });
  });
};

exports.species_detail = (req, res) => {
  async.waterfall([
    (callback) => {
      Species.findOne({ name: req.params.species_name }, (err, species) => {
        if (err) { return next(err); }
        callback(null, species);
      });
    },
    (species, callback) => {
      Animal.find({ species: species._id })
      .populate('species')
      .exec((err, animals) => {
        if (err) { return next(err); }
        callback(null, species, animals);
      });
    },
  ], (err, species, animals) => {
    if (err) { return next(err); }
    res.render('species_detail', { title: species.name, species, animals });
  });
};

exports.species_create_get = (req, res, next) => {
  res.render('species_form', { title: 'Add New Entry' });
};

exports.species_create_post = [
  // Validate and sanitize input
  body('name', 'A name is required').trim().isLength({ min: 1 }).escape(),
  body('description', 'A description is required').trim().isLength({ min: 1 }).escape(),
  
  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create a Species object/document with escaped and trimmed data
    const species = new Species({
      name: req.body.name,
      description: req.body.description,
    });

    // Check for validation errors
    if (!errors.isEmpty()) {
      // There are errors; re-render form with sanitized values/error messages
      res.render('species_form', { title: 'Add New Entry', species, errors: errors.array() });
      
      // Stop response here
      return;
    }

    // Data from form is valid
    // Check if Species with same name already exists
    Species.findOne({ name: req.body.name })
      .exec((err, found_species) => {
        if (err) { return next(err); }
        if (found_species) {
          // Species already exists - redirect to its detail page
          res.redirect(found_species.url);

          // Using return statement ensures execution stops here
          // otherwise this function would run until finished
          // and save document
          return;
        }


        species.save((err) => {
          if (err) { return next(err); }
          // Species saved - redirect to its detail page
          res.redirect(species.url);
        });
      });
  },
];

exports.species_update_get = (req, res, next) => {
  Species.findOne({ name: req.params.species_name })
    .exec((err, species) => {
      if (err) { return next(err); }
      res.render('species_form', { title: 'Update Entry', species });
    });
};

exports.species_update_post = [
  // Validate and sanitize fields
  body('name', 'A name is required').trim().isLength({ min: 1 }).escape(),
  body('description', 'A description is required').trim().isLength({ min: 1 }),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract validation errors from request
    const errors = validationResult(req);

    // Create a new Species object/doc with escaped/trimmed data
    const species = new Species({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors - re-render form with sanitized values/error messages
      res.render('species_form', { title: 'Update Entry', species, errors: errors.array() });
      return;
    }

    // Updated data is valid - update record
    Species.findOneAndUpdate({ name: req.params.species_name }, {
      name: species.name,
      description: species.description,
    }, (err) => {
      if (err) { return next(err); }
      // Successfully updated database - redirect to list of species
      res.redirect('/inventory/species');
    });
  },
];

exports.species_delete_get = (req, res) => {
  res.render('species_delete', { species: req.params.species_name });
};

exports.species_delete_post = (req, res, next) => {
  async.waterfall([
    (callback) => {
      // Fetch Species document for current Species
      Species.findOne({ name: req.params.species_name }, (err, species) => {
        if (err) { return next(err); }
        callback(null, species);
      });
    },
    (species, callback) => {
      // Remove associated Animal instances
      Animal.deleteMany({ species: species._id })
        .exec((err) => {
          if (err) { return next(err); }
          callback(null, species);
      });
    },
    (species, callback) => {
      // Remove Species document
      Species.findByIdAndRemove(species._id)
        .exec((err) => {
          if (err) { return next(err); }
          callback(null, '');
        })
    },
  ], (err, msg) => {
    if (err) { return next(err); }
    // Species and associated Animal docs removed, redirect to list of species
    res.redirect('/inventory/species');
  });
};
