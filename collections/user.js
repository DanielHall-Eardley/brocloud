module.exports = {
  name: 'user',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['firstName', 'lastName', 'nickName', 'clubId'],
      properties: {
        firstName: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 20,
          description: 'First name required'
        },
        lastName: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 20,
          description: 'Last name required'
        },
        nickName: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 20,
          description: 'Nickname required'
        },
        clubId: {
          bsonType: 'objectId',
          description: 'Club id required'
        },
        isActive: {
          bsonType: 'bool'
        }
      }
    }
  }
};