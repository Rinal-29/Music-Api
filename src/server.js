require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// error
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistService = new PlaylistsService(collaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('musicsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    }, {
      plugin: playlists,
      options: {
        service: playlistService,
        songsService,
        validator: MusicsValidator,
      },
    }, {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        playlistService,
        usersService,
        validator: CollaborationsValidator,
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
      console.log(error);
      return error;
    }

    return h.continue;
  });

  await server.start();
  console.log(`console log server berjalan pada ${server.info.uri}`);
};

init();
