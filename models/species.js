const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const speciesSchema = new Schema({
  name: String,
  description: String,
});

speciesSchema
  .virtual('url')
  .get(function() {
    return `/species/${ this.name }`;
  });

// Export model
module.exports = mongoose.model('Species', speciesSchema);
