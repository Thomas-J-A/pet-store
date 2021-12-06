const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const animalSchema = new Schema({
  name: String,
  gender: String,
  age: Number,
  description: String,
  species: Schema.Types.ObjectId,
  price: Number,
});

animalSchema
  .virtual('url')
  .get(function() {
    return `/species/${ this.species.name }/${ this.id }`;
  });

// Export model
module.exports = mongoose.model('Animal', animalSchema);
