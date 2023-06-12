const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantEerror');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModelPlaylists, mapDBToModelSongList } = require('../../utils');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
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

  async getAllPlaylist(owner) {
    const queryPlaylists = {
      text: `SELECT playlists.*, users.username from playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      `,
      values: [owner],
    };

    const result = await this._pool.query(queryPlaylists);

    const mappedResult = result.rows.map(mapDBToModelPlaylists);

    return mappedResult;
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

  async getAllPlaylistSongsById(playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name, playlists.owner, users.username
      FROM playlists
      LEFT JOIN playlist_songs 
      ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs
      ON playlist_songs.song_id = songs.id
      LEFT JOIN users
      ON users.id = playlists.owner
      WHERE playlist_songs.playlist_id = $1`,
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

    const resultPlaylist = await this._pool.query(queryPlaylist);
    const resultSongs = await this._pool.query(querySongs);

    const playlist = resultPlaylist.rows.map(mapDBToModelPlaylists)[0];
    const songList = resultSongs.rows.map(mapDBToModelSongList);
    const playlistSongs = {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
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

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
