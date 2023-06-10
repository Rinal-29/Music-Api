const routes = (userHandler) => [
  {
    method: 'POST',
    path: '/users',
    handler: userHandler.postUserHandler,
  },
];

module.exports = routes;
