const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const MusicsValidator = require('./validator/musics');
const AlbumsService = require('./services/inMemory/AlbumsService');
const SongsService = require('./services/inMemory/SongsService');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
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
