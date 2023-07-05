const routes = (exportsHandler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: exportsHandler.postExportPlaylistsHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
