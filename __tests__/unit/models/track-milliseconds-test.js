const { expect } = require('chai');
const Track = require('../../../models/track');

it('should assert validation fails when milliseconds isnt a #', async () => {
	try {
		let track = new Track( {name: 'a', milliseconds: 'abc', unitPrice: 123} );
		await track.validate();
	}
	catch(error) {
		expect(error.errors[0].message).to.equal('Validation isNumeric on milliseconds failed');
	}

});

it('should assert validation works when milliseconds is a #', async () => {
	try {
		let track = new Track( {name: 'a', milliseconds: '123', unitPrice: 15} );
		await track.validate();
	}
	catch(error) {
		expect(error.errors[0].message).to.equal('Name must be between 2 and 10 characters');
	}

});