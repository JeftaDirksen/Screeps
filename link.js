var f = require('functions');

module.exports = function () {
	// For every room
	for (let roomName in Game.rooms) {
		let room = Game.rooms[roomName];

		// Get all active links
		let links = room.find(FIND_MY_STRUCTURES, {
			filter: s => s.structureType == STRUCTURE_LINK
		});
		if (!links.length) return;
		
		// Links statistics
		links = _.sortBy(links, 'energy');
		let linksCount = links.length;
		let linkMin = links[0];
		let linkMax = links[linksCount-1];
		if ( linkMax.cooldown ) {
			if(!Memory.link) Memory.link = {};
			Memory.link.pause = linkMax.cooldown;
			return;
		}
		let linksEnergyTotal = _.sum(links, function(o){return o.energy;});
		let linksEnergyBalance = Math.round(linksEnergyTotal / linksCount);
		
		// Transfer from max to min, amount: above balance, with minimum of 50
		let amount = linkMax.energy - linksEnergyBalance;
		if (amount >= 50) {
			linkMax.transferEnergy(linkMin, amount);
			f.debug('Link transfer '+amount+ ' '+linksEnergyBalance);
		}
		
	}
}
