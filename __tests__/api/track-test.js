const frisby = require('frisby');

const { Joi } = frisby;
//const Joi = frisby.Joi;

it('should return a status of 200 when the track is found', () => {
	return frisby
				.get('http://localhost:8000/api/tracks/5')
				.expect('status', 200);
});

it('should return a status of 404 when the track is not found', () => {
	return frisby
				.get('http://localhost:8000/api/tracks/-1')
				.expect('status', 404);
});

it('should return the track name and its playlist', () => {
	return frisby
				.get('http://localhost:8000/api/tracks/5')
				.expect('json', 'name', 'Princess of the Dawn')
				.expect('jsonTypes', 'playlists.*', {
					id: Joi.number().required(),
					name: Joi.string().required()
				});
});