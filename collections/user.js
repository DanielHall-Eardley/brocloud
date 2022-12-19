module.exports = {
  name: "user",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["active", "firstName", "lastName", "nickName", "clubId"],
      properties: {
        firstName: {
          bsonType: "string",
          minLength: 3,
          maxLength: 20,
          description: "First name required",
        },
        lastName: {
          bsonType: "string",
          minLength: 3,
          maxLength: 20,
          description: "Last name required",
        },
        nickName: {
          bsonType: "string",
          minLength: 3,
          maxLength: 20,
          description: "Nickname required",
        },
        password: {
          bsonType: "string",
          minLength: 6,
          maxLength: 20,
          description: "Password Required",
        },
        clubId: {
          bsonType: "objectId",
          description: "Club id required",
        },
        active: {
          bsonType: "boolean",
        },
      },
    },
  },
};
