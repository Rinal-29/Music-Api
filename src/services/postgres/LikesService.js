const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantEerror');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Gagal menyukai album');
    await this._cacheService.delete(`album:${albumId}`);
  }

  async getAlbumLikeCount(albumId) {
    try {
      const value = await this._cacheService.get(`album:${albumId}`);
      const data = JSON.parse(value);
      return { data, isFromCache: true };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      const data = { likes: result.rowCount };
      await this._cacheService.set(`album:${albumId}`, JSON.stringify(data));
      return { data, isFromCache: false };
    }
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 and user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('error batal menyukai akun');
    }

    await this._cacheService.delete(`album:${albumId}`);
  }

  async checkDuplicateAlbumLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 and user_id =  $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) throw new InvariantError('Duplikat album like');
  }
}

module.exports = LikesService;
