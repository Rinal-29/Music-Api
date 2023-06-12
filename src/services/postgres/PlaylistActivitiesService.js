const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantEerror');
const { mapDBToModelActivities } = require('../../utils');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity({
    playlistId, songId, userId, action,
  }) {
    const id = `activities-${nanoid(16)}`;
    const date = new Date();

    const query = {
      text: 'Insert INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, date],
    };

    const result = await this._pool.query(query);

    console.log(result.rows[0].id);

    if (!result.rows[0].id) throw new InvariantError('Playlist activitiy gagal ditambahkan');
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT
      playlists.id, users.username, songs.title,
      action, time
      FROM playlists
      LEFT JOIN playlist_song_activities
      ON playlist_song_activities.playlist_id = playlists.id
      LEFT JOIN songs 
      ON playlist_song_activities.song_id = songs.id
      LEFT JOIN users
      ON playlist_song_activities.user_id = users.id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const activities = result.rows.map(mapDBToModelActivities);

    return {
      playlistId,
      activities,
    };
  }
}

module.exports = PlaylistActivitiesService;
