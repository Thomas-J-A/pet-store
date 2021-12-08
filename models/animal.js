const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const animalSchema = new Schema({
  name: String,
  gender: String,
  age: Number,
  description: String,
  price: Number,
  species: { type: Schema.Types.ObjectId, ref: 'Species' },
});

animalSchema
  .virtual('url')
  .get(function() {
    return `/inventory/species/${ this.species.name }/${ this.id }`;
  });

// Export model
module.exports = mongoose.model('Animal', animalSchema);
