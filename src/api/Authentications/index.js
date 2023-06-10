const AuthHandler = require('./authHandler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    service,
    usersService,
    tokenManager,
    validator,
  }) => {
    const authHandler = new AuthHandler(
      service,
      usersService,
      tokenManager,
      validator,
    );
    server.route(routes(authHandler));
  },
};
