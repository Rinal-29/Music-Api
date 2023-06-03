const routes = (songsHandler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: songsHandler.postSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: songsHandler.getSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: songsHandler.getSongByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: songsHandler.putSongByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: songsHandler.deleteSongByIdHandler,
  },
];

module.exports = routes;
