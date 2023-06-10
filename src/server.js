require('dotenv').config();

const Hapi = require('@hapi/hapi');
const MusicsValidator = require('./validator/musics');
const tokenManager = require('./tokenize/TokenManagerService');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/Authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

// error
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        songService: songsService,
        validator: MusicsValidator,
      },
    }, {
      plugin: songs,
      options: {
        service: songsService,
        validator: MusicsValidator,
      },
    }, {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    }, {
      plugin: authentications,
      options: {
        service: authenticationsService,
        usersService,
        tokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const errorResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        errorResponse.code(response.statusCode);
        return errorResponse;
      }

      if (!response.isServer) return h.continue;

      const error = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      error.code(500);
      return error;
    }

    return h.continue;
  });

  await server.start();
  console.log(`console log server berjalan pada ${server.info.uri}`);
};

init();
