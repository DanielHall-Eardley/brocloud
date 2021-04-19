const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brocloud?poolSize=20';

let db;
const options = {
  useNewUrlParser: true, 
  useUnifiedTopology: true
};

module.exports = {
  connect: cb => {
    MongoClient.connect(uri, options, (err, client) => {
      db = client.db('brocloud')
      cb(err);
    })
  },
  getDb: () => {
    return db;
  }
}
