const routes = require('./routes');
const UsersHandler = require('./usersHandler');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const userHandler = new UsersHandler(service, validator);
    server.route(routes(userHandler));
  },
};
