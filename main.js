// Load prototypes
require('creep.prototype');

// Load modules
var c = require('config');
var f = require('functions');
var buildCreeps = require('buildCreeps');
var tower = require('tower');
var link = require('link');

// Load roles
var role = [];
for(let roleName in c.creep.role) {
	role[roleName] = require('role.'+roleName);
}

module.exports.loop = function () {
	// CPU Bucket checked
	if(Game.cpu.bucket < 100) {
		f.warning('Skipping tick due to low CPU bucket');
		return;
	}
	
	// Clear memory
	clearMemory();
	
	// Build creeps
	if(thisTick(10)) buildCreeps();

	// Run creep roles
	for (let creepName in Game.creeps) {
		let creep = Game.creeps[creepName];
		if (creep.spawning) continue;
		role[creep.memory.role](creep);
	}
	
	// Tower
	tower();

	// Link
	link();

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
