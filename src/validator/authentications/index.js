const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantEerror');

const AuthetnicationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const result = PostAuthenticationPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
  validatePutAuthenticationPayload: (payload) => {
    const result = PutAuthenticationPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
  validateDeleteAtuhenticationPayload: (payload) => {
    const result = DeleteAuthenticationPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
};

module.exports = AuthetnicationsValidator;
