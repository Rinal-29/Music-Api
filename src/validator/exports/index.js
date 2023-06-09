const ExportPlaylistsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantEerror');

const ExportsValidator = {
  validateExportPlaylistsPayload: (payload) => {
    const result = ExportPlaylistsPayloadSchema.validate(payload);
    if (result.error) throw new InvariantError(result.error.message);
  },
};

module.exports = ExportsValidator;
