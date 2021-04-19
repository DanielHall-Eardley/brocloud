module.exports = {
  name: 'playList',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['clubId', 'currentlyPlaying', 'upNext'],
      properties: {
        clubId: {
          bsonType: 'objectId',
        },
        currentlyPlaying: {
          bsonType: 'object',
        },
        upNext: {
          bsonType: 'array',
        },
      }
    }
  }
};