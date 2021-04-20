module.exports = {
  name: 'club',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'A name is required'
        },
        listeningHistory: {
          bsonType: 'array'
        }
      }
    }
  }
};