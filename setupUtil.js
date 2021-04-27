const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/brocloud?poolSize=20';
const addCollections = require('./collections/addCollections');
const throwError = require('./util/throwError');
const socket = require('socket.io');

let db;
let io;

const connect = async (initServer) => {
  const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  };

  const client = new MongoClient(uri, options);
  try {
    await client.connect()
    db = client.db('brocloud')
    console.log('database connected')
    
    const server = initServer();
    io = socket(server)
  } catch (error) {
    console.log(error)
  } 
}

const dbConnection = () => db;
const mainIo = () => io;

const findDocuments = (
  db, query = {}, options = {} 
) => {
  return new Promise(async (resolve, reject) => {
    const cursor = await db.find(query, options)
    const data = await cursor.toArray()
    if (!data) {
      reject(throwError('Documents not found', 404));
    }

    await cursor.close()
    resolve(data)
  })
}

const addDocument = async (db, newDoc) => {
  const response = await db.insertOne(newDoc);
  return response.ops[0];
};

const updateDocument = async (db, filter, update, options = {}) => {
  options.returnOriginal = false
  const newDoc = await db.findOneAndUpdate(filter, update, options);
  if (newDoc.ok !== 1) {
    throwError('Unable update your document', 500);
  }
  return newDoc.value
}

module.exports = {
  connect,
  updateDocument,
  findDocuments,
  addDocument,
  dbConnection,
  mainIo
}
