const autoBind = require('auto-bind');

class songsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const song = await this._service.addSong({
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
        songId: song,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    let songList = await this._service.getSongs();

    if (title && performer) {
      songList = songList.filter((song) => song.title.toLowerCase().includes(title.toLowerCase())
        && song.performer.toLowerCase().includes(performer.toLowerCase()));
    } else if (title || performer) {
      if (title) {
        songList = songList.filter((song) => song.title.toLowerCase()
          .includes(title.toLowerCase()));
      } else {
        songList = songList.filter((song) => song.performer.toLowerCase()
          .includes(performer.toLowerCase()));
      }
    }

    const response = h.response({
      status: 'success',
      data: {
        songs: songList,
      },
    });

    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });

    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Berhasil update song',
    });

    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    const response = h.response({
      status: 'success',
      message: `Berhasil delete song id: ${id}`,
    });

    response.code(200);
    return response;
  }
}

module.exports = songsHandler;
