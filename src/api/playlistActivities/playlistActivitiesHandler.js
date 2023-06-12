const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(service, playlistService) {
    this._service = service;
    this._playlistService = playlistService;

    autoBind(this);
  }

  async getPlaylistsActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const data = await this._service.getPlaylistActivities(playlistId);

    return h.response({
      status: 'success',
      data,
    });
  }
}

module.exports = PlaylistActivitiesHandler;
