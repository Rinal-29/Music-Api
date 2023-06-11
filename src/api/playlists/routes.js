const routes = (playlistsHandler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: playlistsHandler.postPlaylistsHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: playlistsHandler.getPlaylistsHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: playlistsHandler.deletePlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: playlistsHandler.postPlaylistSongHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: playlistsHandler.getAllPlaylistSongsByIdHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: playlistsHandler.deleteSongPlaylistByIdHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
