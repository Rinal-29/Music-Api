const PlaylistActivitiesHandler = require('./playlistActivitiesHandler');
const routes = require('./routes');

module.exports = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: async (server, { service, playlistService }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(service, playlistService);
    server.route(routes(playlistActivitiesHandler));
  },
};
