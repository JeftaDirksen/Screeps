// Load modules
var cb = require('creepBuilder');
var jq = require('jobQueue');
var f = require('functions');
var c = require('config');
var roads = require('roads');
var tower = require('tower');
var link = require('link');

// Load prototypes
require('creep.prototype');
require('roomPosition.prototype');

module.exports.loop = function () {
	
	// CPU
	if (c.cpu && Game.cpu.bucket) {
		let lastBucket = Memory.lastBucketAmount;
		let currentBucket = Game.cpu.bucket;
		Memory.lastBucketAmount = currentBucket;
		let lastTickUsage = lastBucket - currentBucket;
		f.cpu('lastTickUsage: '+lastTickUsage);
	}
	
	// Requirements
	if(!Memory.jobQueue) Memory.jobQueue = {};
	if (!Memory.pathUse) Memory.pathUse = [];

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

	// Tower
	tower();

	// Link
	if(thisTick(8)) link();

	// Build roads
	if(thisTick(10)) roads.build();

}

function thisTick(everyThisTicks) {
	return !(Game.time % everyThisTicks);
}

function clearMemory() {
	for (let name in Memory.creeps) {
		if (Game.creeps[name]) continue;
		f.debug('Creep died ' + name);
		
		// A creep disapeared
		// Unassing job
		let jobId = Memory.creeps[name].job;
		if (jobId) jq.unassignJob(jobId);
		// Delete memory
		delete Memory.creeps[name];
		// Debug message
	}
}