const autoBind = require('auto-bind');
const config = require('../../utils/config');

class UploadsHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._albumService = albumService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;
    const { host, port } = config.app;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const fileName = await this._service.writeFile(cover, cover.hapi);
    const fileLocation = `http://${host}:${port}/upload/images/${fileName}`;
    await this._albumService.updateAlbumCoverByAlbumId(fileLocation, albumId);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
