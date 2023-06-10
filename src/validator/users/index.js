const InvariantError = require('../../exceptions/InvariantEerror');
const { userPayloadSchema } = require('./shema');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const result = userPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
};

module.exports = UsersValidator;
