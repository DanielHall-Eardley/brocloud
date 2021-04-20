const userCollection = require('./user');
const clubCollection = require('./club');
const videoCollection = require('./video');
const playListCollection = require('./playlist');

const collectionArray = [
  userCollection, 
  clubCollection,
  videoCollection,
  playListCollection,
];

const addCollections = db => {
  collectionArray.forEach(collection => {
    db.createCollection(
      collection.name, 
      { validator: collection.validator }
    )
  })
};

module.exports = addCollections;