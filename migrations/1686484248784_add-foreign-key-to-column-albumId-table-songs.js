/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_albums', 'old_albums', 'old_albums', 'old albums')");

  // pgm.renameColumn('songs', 'albumId', 'album_id');

  pgm.sql("UPDATE songs SET album_id = 'old_notes' WHERE album_id = NULL");

  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');

  pgm.sql("UPDATE songs SET album_id = NULL WHERE album_id = 'old_albums'");

  // pgm.renameColumn('songs', 'album_id', 'albumId');

  pgm.sql("DELETE FROM users WHERE id = 'old_albums'");
};
