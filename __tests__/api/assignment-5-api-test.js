const frisby = require('frisby');

const { Joi } = frisby;
//const Joi = frisby.Joi;

it('should return a status of 200 when the track is found', () => {
	return frisby
				.patch('http://localhost:8000/api/tracks/5', 
							{
    						name : 'La La Land Song',
    						milliseconds : '123456',
   							unitPrice : 1
							}                                )
				.expect('status', 200);
});

it('should return a status of 404 when the track is not found', () => {
	return frisby
				.patch('http://localhost:8000/api/tracks/-1', 
							{
    						name : 'La La Land Song',
    						milliseconds : '123456',
   							unitPrice : 1
							}                                
															)
				.expect('status', 404);
});

it('should return the track name and its playlist', () => {
	return frisby
				.get('http://localhost:8000/api/tracks/3')
				.expect('json', 'name', 'Fast As a Shark')
				.expect('jsonTypes', 'playlists.*', {
					id: Joi.number().required(),
					name: Joi.string().required()
				});
});

it('should return a 422 status code when the name of the track is not there', () => {
	return frisby
				.patch('http://localhost:8000/api/tracks/5', 

				{name: '', milliseconds: 'a', 'unitPrice': 'b'}                      
															
															)
				.expect('status', 422);
});