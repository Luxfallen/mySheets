const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const convertId = mongoose.Types.ObjectId;

let CharacterModel = {};

const CharacterSchema = new mongoose.Schema({
  // I hope you don't need a comment to know what a name is
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Index of level corresponds w/ class in future
  level: {
    type: Number,
    required: true,
    default: 1,
  },
  // Index of class corresponds w/ level in future
  class: {
    type: String,
    required: true,
  },
  // STR, DEX, CON, INT, WIS, CHA
  stats: {
    type: [Number],
    required: true,
  },
  // Current, Max, Temp
  health: {
    type: [Number],
    required: true,
  },
  // Whatever order the user entered them...?
  // Alphabetizing would be cool, but not right now.
  inventory: {
    type: [String],
    required: false,
    trim: true,
  },
  // Duh
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
});

CharacterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  stats: doc.stats,
  health: doc.stats,
  inventory: doc.stats,
});

CharacterSchema.statics.findByOwner = (ownerId, callback) => {
  const search = { owner: convertId(ownerId) };
  return CharacterModel.find(search).select('name stats health inventory').exec(callback);
};

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports = {
  CharacterModel,
  CharacterSchema,
};
