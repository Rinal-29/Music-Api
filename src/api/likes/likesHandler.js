const autoBind = require('auto-bind');

class LikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    const _album = await this._albumsService.getAlbumById(albumId);
    await this._service.checkDuplicateAlbumLike(albumId, userId);
    await this._service.addAlbumLike(_album.id, userId);

    const response = h.response({
      status: 'success',
      message: `menyukai album ${_album.name}`,
    });
    response.code(201);
    return response;
  }

  async getAlbumLikeCountHandler(request, h) {
    const { id: albumId } = request.params;

    const _album = await this._albumsService.getAlbumById(albumId);
    const result = await this._service.getAlbumLikeCount(_album.id);
    const response = h.response({
      status: 'success',
      data: result.data,
    });
    if (result.isFromCache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    const _album = await this._albumsService.getAlbumById(albumId);
    await this._service.deleteAlbumLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: `unlike album ${_album.name}`,
    });
    return response;
  }
}

module.exports = LikesHandler;
