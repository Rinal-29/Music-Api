const autoBind = require('auto-bind');

class albumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

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

  getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = this._service.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album,
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
