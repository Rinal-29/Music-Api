const InvariantError = require('../../exceptions/InvariantEerror');
const { albumPayloadSchema, songPayloadSchema } = require('./musicsSchema');

const MusicsValidator = {
  validateAlbumPayload: (payload) => {
    const result = albumPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateSongPayload: (payload) => {
    const result = songPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = MusicsValidator;
