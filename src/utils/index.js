/* eslint-disable object-shorthand */
const mapDBToModelAlbum = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapDBToModelSongList = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBToModelSong = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration: duration,
  albumId: albumId,
});

module.exports = { mapDBToModelAlbum, mapDBToModelSongList, mapDBToModelSong };
