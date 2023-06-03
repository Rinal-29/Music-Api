const routes = (albumsHandler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: albumsHandler.postAlbumHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: albumsHandler.getAllSongByAlbumIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: albumsHandler.putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: albumsHandler.deleteAlbumByIdHandler,
  },
];

module.exports = routes;
