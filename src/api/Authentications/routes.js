const routes = (authHandler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: authHandler.postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: authHandler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: authHandler.deleteAuthenticationHandler,
  },
];

module.exports = routes;
