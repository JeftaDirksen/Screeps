// Load modules
var cb = require('creepBuilder');
var jq = require('jobQueue');
var f = require('functions');

module.exports.loop = function () {
	
	// Clear memory
	clearMemory();
	
	// Build creeps
	if(thisTick(25)) cb.build(Game.spawns.Spawn1);
	
	// Generate jobs
	if(thisTick(1)) jq.generateJobs();
	
}

function thisTick(everyThisTicks) {
	return !(Game.time % everyThisTicks);
}

function clearMemory() {
	for (let name in Memory.creeps) {
		if (Game.creeps[name]) continue;
		delete Memory.creeps[name];
		f.debug('Creep died: ' + name);
	}
}