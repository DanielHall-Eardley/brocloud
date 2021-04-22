module.exports = {
  name: 'video',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'videoId', 'userFullName', 'mostRecentlyPlayed', 'firstPlayed'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'A name is required'
        },
        videoId: {
          bsonType: 'string',
          description: 'A video id is required'
        },
        userFullName: {
          bsonType: 'string',
          description: 'The song requestor\'s name is required'
        },
        firstPlayed: {
          bsonType: 'date',
        },
        mostRecentlyPlayed: {
          bsonType: 'date',
        }
      }
    }
  }
};