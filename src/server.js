require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const MusicsValidator = require('./validator/musics');
const tokenManager = require('./tokenize/TokenManagerService');
const config = require('./utils/config');

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
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// exports
const _exports = require('./api/exports');
const ExportsValidator = require('./validator/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadValidator = require('./validator/uploads');

// favorites
const likes = require('./api/likes');
const LikesService = require('./services/postgres/LikesService');

// cache
const CacheService = require('./services/redis/CacheService');

// error
const ClientError = require('./exceptions/ClientError');
const playlistActivities = require('./api/playlistActivities');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistService = new PlaylistsService(collaborationsService);
  const playlistActivitiesService = new PlaylistActivitiesService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const likesService = new LikesService(cacheService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
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
    {
      plugin: Inert,
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
        playlistActivitiesService,
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
    }, {
      plugin: playlistActivities,
      options: {
        service: playlistActivitiesService,
        playlistService,
      },
    }, {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistsService: playlistService,
        validator: ExportsValidator,
      },
    }, {
      plugin: uploads,
      options: {
        service: storageService,
        albumService: albumsService,
        validator: UploadValidator,
      },
    }, {
      plugin: likes,
      options: {
        service: likesService,
        albumsService,
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
  console.log(`server berjalan pada ${server.info.uri}`);
};

init();
