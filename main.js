// Load modules
var c = require('config');
var f = require('functions');
var buildCreeps = require('buildCreeps');

module.exports.loop = function () {
	
	// Clear memory
	clearMemory();
	
	// Build creeps
	if(thisTick(50)) buildCreeps.build(Game.spawns.Spawn1);

	// Run creeps
	for (let name in Game.creeps) {
		let creep = Game.creeps[name];
		if (creep.spawning) continue;
		creep.run();
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
