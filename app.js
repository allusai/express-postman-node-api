const express = require('express');
const bodyParser = require('body-parser');
const Playlist = require('./models/playlist');
const Artist = require('./models/artist');
const Album = require('./models/album');
const Track = require('./models/track');
const Sequelize = require('sequelize');

const { Op } = Sequelize;
const app = express();

app.use(bodyParser.json());

Artist.hasMany(Album, {
  foreignKey: 'ArtistId'
});

Album.belongsTo(Artist, {
  foreignKey: 'ArtistId'
});

Playlist.belongsToMany(Track, {
  through: 'playlist_track',
  foreignKey: 'PlaylistId',
  timestamps: false
});

Track.belongsToMany(Playlist, {
  through: 'playlist_track',
  foreignKey: 'TrackId',
  timestamps: false
});

app.delete('/api/playlists/:id', function(request, response) {
  let { id } = request.params;

  Playlist
    .findByPk(id)
    .then((playlist) => {
      if (playlist) {
        return playlist.setTracks([]).then(() => {
          return playlist.destroy();
        });
      } else {
        return Promise.reject();
      }
    })
    .then(() => {
      response.status(204).send();
    }, () => {
      response.status(404).send();
    });
});

app.post('/api/artists', function(request, response) {
  Artist.create({
    name: request.body.name
  }).then((artist) => {
    response.json(artist);
  }, (validation) => {
    response.status(422).json({
      errors: validation.errors.map((error) => {
        return {
          attribute: error.path,
          message: error.message
        };
      })
    });
  });
  
});

app.get('/api/playlists', function(request, response) {
  let filter = {};
  let { q } = request.query;

  if (q) {
    filter = {
      where: {
        name: {
          [Op.like]: `${q}%`
        }
      }
    };
  }

  Playlist.findAll(filter).then((playlists) => {
    response.json(playlists);
  });
});

app.get('/api/playlists/:id', function(request, response) {
  let { id } = request.params;

  Playlist.findByPk(id, {
    include: [Track]
  }).then((playlist) => {
    if (playlist) {
      response.json(playlist);
    } else {
      response.status(404).send();
    }
  });
});

app.get('/api/tracks/:id', function(request, response) {
  let { id } = request.params;

  Track.findByPk(id, {
    include: [Playlist]
  }).then((track) => {
    if (track) {
      response.json(track);
    } else {
      response.status(404).send();
    }
  });
});

app.get('/api/artists/:id', function(request, response) {
  let { id } = request.params;

  Artist.findByPk(id, {
    include: [Album]
  }).then((artist) => {
    if (artist) {
      response.json(artist);
    } else {
      response.status(404).send();
    }
  });
});

app.get('/api/albums/:id', function(request, response) {
  let { id } = request.params;

  Album.findByPk(id, {
    include: [Artist]
  }).then((album) => {
    if (album) {
      response.json(album);
    } else {
      response.status(404).send();
    }
  });
});

app.patch('/api/tracks/:id' , function(request, response) {

	request.body

	let id = request.params.id;
	let name = request.body.name;
	let milliseconds = request.body.milliseconds;
	let unitPrice = request.body.unitPrice;


	//Step 1: Find by PK the record itself that we should be updating
	let ourRecordThingy = Track.findByPk(id, {
    // include: [Track]
  }).then((track) => {
  
  		if(track) {
        console.log(track);
      	return track.update({
 		 name: name,
 		 milliseconds: milliseconds,
 		 unitPrice: unitPrice
		}).then((track) => {
    response.json(track);
  }, (validation) => {
    response.status(422).json({
      errors: validation.errors.map((error) => {
        return {
          attribute: error.path,
          message: error.message
        };
      })
    });
  });
		}
  }).then((track) => {
  		if(track) {
  		response.json(track);
  		}
  		else {
  			response.status(404).send();
  		}
  });
  
  	//Step 2: Update the record
  //	ourRecordThingy.update({
 //		 name: name,
 //		 milliseconds: milliseconds,
 //		 unitPrice: unitPrice
	//}).then(() => {})
  	

});

app.listen(8000);
