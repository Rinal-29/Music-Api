const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getPlaylistsActivitiesHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
