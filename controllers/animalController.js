const Animal = require('../models/animal');

exports.animal_detail = (req, res, next) => {
  Animal.findById(req.params.animal_id)
    .populate('species')
    .exec((err, animal) => {
      if (err) { return next(err); }
      res.render('animal_detail', { animal });
    });
};

exports.animal_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Animal create GET');
};

exports.animal_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Animal create POST');
};

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
