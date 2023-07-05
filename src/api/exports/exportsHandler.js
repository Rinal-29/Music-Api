const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    this._validator.validateExportPlaylistsPayload(request.payload);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const message = {
      userId: credentialId,
      targetEmail: request.payload.targetEmail,
      playlistId,
    };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Perminataan dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
