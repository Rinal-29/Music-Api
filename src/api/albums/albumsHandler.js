const autoBind = require('auto-bind');

class albumsHandler {
  constructor(service, songService, validator) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const album = await this._service.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        albumId: album,
      },
    });

    response.code(201);
    return response;
  }

  async getAllSongByAlbumIdHandler(request, h) {
    const { id } = request.params;
    const albumSong = await this._songService.getSongsByAlbumId(id);
    const album = await this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          songs: albumSong,
        },
      },
    });
    return response;
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Berhasil update data album',
    });

    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: `Berhasil delete album id: ${id}`,
    });

    response.code(200);
    return response;
  }
}

module.exports = albumsHandler;
