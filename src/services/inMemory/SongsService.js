const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantEerror');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const newSong = {
      id, title, year, genre, performer, duration, albumId,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id);

    if (!isSuccess) throw new InvariantError('Song gagal ditambahkan');

    return newSong;
  }

  getSongs() {
    const songList = [];
    this._songs.forEach((song) => {
      const prop = { id: song.id, title: song.title, performer: song.performer };
      songList.push(prop);
    });
    return songList;
  }

  getSongById(id) {
    const song = this._songs.filter((s) => s.id === id)[0];
    if (!song) throw new NotFoundError('Song tidak ditemukan');
    return song;
  }

  editSongById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) throw new NotFoundError('Gagal memperbarui data. Id tidak ditemukan');

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) throw new NotFoundError('Song gagal dihapus, Id tidak ditemukan');

    this._songs.splice(index, 1);
  }

  getSongsByAlbumId(albumId) {
    const albumSongs = [];
    const songs = this._songs.filter((song) => song.albumId === albumId);

    if (songs.length < 0) throw new NotFoundError('tidak ada album songs, Id tidak ditemukan');

    songs.forEach((song) => {
      const prop = { id: song.id, title: song.title, performer: song.performer };
      albumSongs.push(prop);
    });
    return albumSongs;
  }
}

module.exports = SongsService;
