const ExportsHandler = require('./exportsHandler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const exportshandler = new ExportsHandler(service, playlistsService, validator);
    server.route(routes(exportshandler));
  },
};
