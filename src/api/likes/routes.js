const routes = (likesHandler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: likesHandler.postAlbumLikeHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: likesHandler.deleteAlbumLikeHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: likesHandler.getAlbumLikeCountHandler,
  },
];

module.exports = routes;
