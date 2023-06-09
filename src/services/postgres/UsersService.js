const { nanoid } = require('nanoid');
const bycrpt = require('bcrypt');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantEerror');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bycrpt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new InvariantError('User gagal ditambahkan');

    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rowCount > 0) throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
  }

  async verifyUserNameAndPassword(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new AuthenticationError('Kredensial yang Anda berikan salah');

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bycrpt.compare(password, hashedPassword);
    if (!match) throw new AuthenticationError('Kredensial yang Anda berikan salah');

    return id;
  }

  async verifyUserById(id) {
    const query = {
      text: 'SELECT username FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Gagal mendapatkan user. Id tidak ditemukan');
  }
}

module.exports = UsersService;
