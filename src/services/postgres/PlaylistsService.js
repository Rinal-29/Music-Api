const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantEerror');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModelPlaylists, mapDBToModelSongList } = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Playlist gagal ditambahkan');

    return result.rows[0].id;
  }

  async getAllPlaylist() {
    const result = await this._pool.query(`SELECT playlists.*, users.username
    FROM playlists
    LEFT JOIN users ON users.id = playlists.owner`);

    return result.rows.map(mapDBToModelPlaylists);
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Playlists gagal dihapus. Id tidak ditemukan');
  }

  async addSongToPlaylist({ playlistId, sId }) {
    const playlistSongId = `playlist_songs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [playlistSongId, playlistId, sId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Playlist song gagal ditambahkan');

    return result.rows[0].id;
  }

  async getAllPlaylistSongsById(playlistId, credentialId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name
      FROM playlists
      LEFT JOIN playlist_songs 
      ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs
      ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1
      GROUP BY playlists.id`,
      values: [playlistId],
    };

    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists
      LEFT JOIN playlist_songs 
      ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs
      ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1
      GROUP BY songs.id`,
      values: [playlistId],
    };

    const queryUsername = {
      text: `SELECT users.username 
      FROM playlists
      LEFT JOIN users
      ON users.id = playlists.owner
      WHERE users.id = $1 OR playlists.owner = $1
      GROUP BY users.username`,
      values: [credentialId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);
    const resultSongs = await this._pool.query(querySongs);
    const username = await this._pool.query(queryUsername);

    const songList = resultSongs.rows.map(mapDBToModelSongList);
    const playlistSongs = {
      id: resultPlaylist.rows[0].id,
      name: resultPlaylist.rows[0].name,
      username: username.rows[0].username,
      songs: songList,
    };

    return playlistSongs;
  }

  async deleteSongPlaylistById({ playlistId, sId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, sId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Playlist tidak ditemukan');

    const playlist = result.rows[0];
    if (playlist.owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }
}

module.exports = PlaylistsService;
