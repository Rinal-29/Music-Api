const routes = (collabHandler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: collabHandler.postCollaborationPlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: collabHandler.deleteCollaborationPlaylistHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
