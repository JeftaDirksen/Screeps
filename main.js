// Load prototypes
require('creep.prototype');

// Load modules
var c = require('config');
var f = require('functions');
var buildCreeps = require('buildCreeps');

// Load roles
var role = [];
for(let roleName in c.creep.role) {
	role[roleName] = require('role.'+roleName);
}

module.exports.loop = function () {
	
	// Clear memory
	clearMemory();
	
	// Build creeps
	if(thisTick(50)) buildCreeps(Game.spawns.Spawn1);

	// Run creep roles
	for (let creepName in Game.creeps) {
		let creep = Game.creeps[creepName];
		if (creep.spawning) continue;
		role[creep.memory.role](creep);
	}

}

function thisTick(everyThisTicks) {
	return !(Game.time % everyThisTicks);
}

function clearMemory() {
	for (let name in Memory.creeps) {
		if (Game.creeps[name]) continue;
		f.debug('Creep died ' + name);
		delete Memory.creeps[name];
	}
}
