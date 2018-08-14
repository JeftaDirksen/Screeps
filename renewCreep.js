var c = require('config');
var f = require('functions');

module.exports = {
	
	renew(spawn) {
		if (spawn.spawning) return;
		f.cpu('renewCreep.renew');
		// Find near creeps to renew
		let creeps = spawn.pos.findInRange(FIND_MY_CREEPS,1);
		if(creeps.length) {
			let creep = creeps[0];
			if(creep.ticksToLive >= 1000) return;
			let error = spawn.renewCreep(creep);
			if(error && error != ERR_FULL) f.error('renewCreep.renew returned: ' + error);
		}
	},
	
}
