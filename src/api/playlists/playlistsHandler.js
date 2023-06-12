const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, songsService, playlistActivitiesService, validator) {
    this._service = service;
    this._songsService = songsService;
    this._playlistActivitiesService = playlistActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getAllPlaylist(credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });

    return response;
  }

  async deletePlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
    return response;
  }

  async postPlaylistSongHandler(request, h) {
    await this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const song = await this._songsService.getSongById(songId);
    await this._service.addSongToPlaylist({ playlistId, sId: song.id });
    await this._playlistActivitiesService.addPlaylistActivity({
      playlistId, songId, userId: credentialId, action: 'add',
    });

    const response = h.response({
      status: 'success',
      message: 'Plpaylist song berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getAllPlaylistSongsByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getAllPlaylistSongsById(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    return response;
  }

  async deleteSongPlaylistByIdHandler(request, h) {
    await this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const song = await this._songsService.getSongById(songId);
    await this._service.deleteSongPlaylistById({ playlistId, sId: song.id });
    await this._playlistActivitiesService.addPlaylistActivity({
      playlistId, songId, userId: credentialId, action: 'delete',
    });

    const response = h.response({
      status: 'success',
      message: 'Berhasil hapus song dri playlist',
    });
    return response;
  }
}

module.exports = PlaylistsHandler;
