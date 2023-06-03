const autoBind = require('auto-bind');

class albumsHandler {
  constructor(service, songService, validator) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;

    autoBind(this);
  }

  postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const album = this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId: album.id,
      },
    });

    response.code(201);
    return response;
  }

  getAllSongByAlbumIdHandler(request, h) {
    const { id } = request.params;
    const albumSong = this._songService.getSongsByAlbumId(id);
    const album = this._service.getAlbumById(id);

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

    response.code(200);
    return response;
  }

  putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    this._service.editAlbumById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Berhasil update data album',
    });

    response.code(200);
    return response;
  }

  deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: `Berhasil delete album id: ${id}`,
    });

    response.code(200);
    return response;
  }
}

module.exports = albumsHandler;
