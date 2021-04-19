const userCollection = require('./user');
const clubCollection = require('./club');

const collectionArray = [userCollection, clubCollection];

const addCollections = db => {
  collectionArray.forEach(collection => {
    db.createCollection(collection.name, {validator: collection.validator})
  })
};

module.exports = addCollections