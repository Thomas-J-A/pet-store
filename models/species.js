const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const speciesSchema = new Schema({
  name: String,
  description: String,
});

speciesSchema
  .virtual('url')
  .get(function() {
    return `/inventory/species/${ this.name }`;
  });

// Export model
module.exports = mongoose.model('Species', speciesSchema);
