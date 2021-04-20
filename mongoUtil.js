const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brocloud?poolSize=20';
const addCollections = require('./collections/addCollections');

let db;
const options = {
  useNewUrlParser: true, 
  useUnifiedTopology: true
};

module.exports = {
  connect: cb => {
    MongoClient.connect(uri, options, (err, client) => {
      db = client.db('brocloud')
      // addCollections(db); 
      cb(err);
    })
  },
  getDb: () => {
    return db;
  }
}
