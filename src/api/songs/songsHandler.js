const autoBind = require('auto-bind');

class songsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const song = this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      data: {
        songId: song.id,
      },
    });

    response.code(201);
    return response;
  }

  getSongsHandler(request, h) {
    const songList = this._service.getSongs();
    const response = h.response({
      status: 'success',
      data: {
        songs: songList,
      },
    });

    response.code(200);
    return response;
  }

  getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });

    response.code(200);
    return response;
  }

  putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    this._service.editSongById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Berhasil update song',
    });

    response.code(200);
    return response;
  }

  deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    this._service.deleteSongById(id);

    const response = h.response({
      status: 'success',
      message: `Berhasil delete song id: ${id}`,
    });

    response.code(200);
    return response;
  }
}

module.exports = songsHandler;
