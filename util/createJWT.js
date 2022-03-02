const { jwtSecret } = require('../config/keys');
const jwt = require('jsonwebtoken');

function createJWT (userId, cb) {

  // Create token with userId as payload
  jwt.sign(
    { id: userId }, 
    jwtSecret, 
    { expiresIn: '7d' }, 
    (err, token) => {
      if (err) {
        return throwError('Unable to generate token', 500);
      }

      // Execute the rest of the endpoint logic in the callback
      cb(token)
    }
  );
}

exports.createJWT = createJWT