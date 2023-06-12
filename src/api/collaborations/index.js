const CollabHandler = require('./collabHandler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    service, playlistService, usersService, validator,
  }) => {
    const collabHandler = new CollabHandler(service, playlistService, usersService, validator);
    server.route(routes(collabHandler));
  },
};
