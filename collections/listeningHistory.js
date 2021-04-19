module.exports = {
  name: 'listeningHistory',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['clubId', 'history'],
      properties: {
        clubId: {
          bsonType: 'objectId',
        },
        history: {
          bsonType: 'array'
        }
      }
    }
  }
};