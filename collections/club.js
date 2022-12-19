const video = {
  bsonType: "object",
  required: ["name", "videoId", "userFullName"],
  properties: {
    _id: {
      bsonType: "objectId",
    },
    name: {
      bsonType: "string",
      description: "A name is required",
    },
    videoId: {
      bsonType: "string",
      description: "A video id is required",
    },
    userFullName: {
      bsonType: "string",
      description: "The song requestor's name is required",
    },
    playedAtTime: {
      bsonType: "date",
    },
  },
};

module.exports = {
  name: "club",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        name: {
          bsonType: "string",
          description: "A name is required",
        },
        history: {
          bsonType: "array",
          items: video,
        },
        upNext: {
          bsonType: "array",
          items: video,
        },
      },
    },
  },
};
