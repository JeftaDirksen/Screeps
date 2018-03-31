// Load modules
var cb = require('creepBuilder');
var jq = require('jobQueue');
var f = require('functions');

// Load prototypes
require('creep.prototype');
require('roomPosition.prototype');

module.exports.loop = function () {
	
	// Clear memory
	clearMemory();
	
	// Build creeps
	if(thisTick(50)) cb.build(Game.spawns.Spawn1);
	
	// Generate jobs
	if(thisTick(1)) jq.generateJobs();

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
		
		// A creep disapeared
		// Unassing job
		let jobId = Memory.creeps[name].job;
		if (jobId) jq.unassignJob(jobId);
		// Delete memory
		delete Memory.creeps[name];
		// Debug message
		f.debug('Creep died: ' + name);
	}
}