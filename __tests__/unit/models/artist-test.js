const { expect } = require('chai');
const Artist = require('../../../models/artist');

it('should be at least 2 characters', async () => {
	try {
		let artist = new Artist( {name: 'a'} );
		await artist.validate();
	}
	catch(error) {
		expect(error.errors[0].message).to.equal('Name must be between 2 and 10 characters');
	}

});