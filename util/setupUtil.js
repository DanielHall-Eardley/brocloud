const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGODB_URI;
const throwError = require("../util/throwError");
const socket = require("socket.io");

let db;
let io;

const connect = async (initServer) => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const client = new MongoClient(uri, options);
  try {
    await client.connect();
    db = client.db("brocloud");
    console.log("database connected");

    const server = initServer();
    io = socket(server);
  } catch (error) {
    console.log(error);
  }
};

const dbConnection = () => db;
const mainIo = () => io;

const findDocuments = (db, query = {}, options = {}) => {
  return new Promise(async (resolve, reject) => {
    const cursor = await db.find(query, options);
    const data = await cursor.toArray();
    await cursor.close();
    resolve(data);
  });
};

const addDocument = async (db, newDoc) => {
  const response = await db.insertOne(newDoc);
  return response.ops[0];
};

const updateDocument = async (db, filter, update, options = {}) => {
  options.returnOriginal = false;
  const updateRes = await db.updateOne(filter, update, options);
  if (updateRes.result.ok !== 1) {
    throwError("Unable update your document", 500);
  }
  const updatedDoc = await findDocuments(db, filter);
  return updatedDoc[0];
};

module.exports = {
  connect,
  updateDocument,
  findDocuments,
  addDocument,
  dbConnection,
  mainIo,
};
