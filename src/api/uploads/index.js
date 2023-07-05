const routes = require('./routes');
const UploadsHandler = require('./uploadsHandler');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { service, albumService, validator }) => {
    const uploadsHandler = new UploadsHandler(service, albumService, validator);
    server.route(routes(uploadsHandler));
  },
};
