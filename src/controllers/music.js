const { Music, Artist } = require('../../models/');

exports.addMusic = async (req, res) => {
   try {
      const { body } = req;
      console.log('response body', body);

      console.log('req.files-------', req.files);
      console.log('artist id-----------------', Number(req.body.artistId));
      const checkArtist = await Artist.findOne({
         where: { id: Number(req.body.artistId) },
      });

      if (!checkArtist) {
         return res.send({
            status: 'failed',
            message: "the user you're looking for doesnt exist",
         });
      }

      const music = await Music.create({
         title: req.body.title,
         year: req.body.year,
         thumbnail: req.files.thumbnail[0].filename,
         artistId: req.body.artistId,
         attache: req.files.attache[0].filename,
         genre: req.body.genre,
      });

      const musicWithArtist = await Music.findOne({
         where: { id: music.id },
         include: [
            {
               model: Artist,
               attributes: {
                  exclude: ['createdAt', 'updatedAt'],
               },
               as: 'artist',
            },
         ],
         attributes: { exclude: ['artistId', 'id', 'createdAt', 'updatedAt'] },
      });

      res.send({
         status: 'success',
         data: {
            music: musicWithArtist,
         },
      });
   } catch (error) {
      console.log(error);
   }
};

exports.getMusic = async (req, res) => {
   const genre = req.query.genre;

   try {
      if (genre) {
         const music = await Music.findAll({
            where: { genre: genre },
            include: [
               {
                  model: Artist,
                  attributes: {
                     exclude: ['createdAt', 'updatedAt'],
                  },
                  as: 'artist',
               },
            ],
            attributes: {
               exclude: ['createdAt', 'updatedAt', 'artistId'],
            },
         });
         return res.send({
            status: 'success',
            data: {
               music: music,
            },
         });
      } else if (!genre) {
         const music = await Music.findAll({
            include: [
               {
                  model: Artist,
                  attributes: {
                     exclude: ['createdAt', 'updatedAt'],
                  },
                  as: 'artist',
               },
            ],
            attributes: {
               exclude: ['createdAt', 'updatedAt', 'artistId'],
            },
         });
         return res.send({
            status: 'success',
            data: {
               music: music,
            },
         });
      }
   } catch (error) {
      console.log(error);
   }
};
