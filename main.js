// Load prototypes
require('creep.prototype');

// Load modules
const c = require('config');
const f = require('functions');
const buildCreeps = require('buildCreeps');
const tower = require('tower');
const link = require('link');

// Load roles
var role = [];
for(let roleName in c.creep.role) {
	role[roleName] = require('role.'+roleName);
}

module.exports.loop = function () {
	// CPU Bucket check
	if(Game.cpu.bucket < 100) {
		f.warning('Skipping tick due to low CPU bucket');
		return;
	}
	
	// Memory setup
	if(Memory.debug == undefined) Memory.debug = false;
	if(Memory.signText == undefined) Memory.signText = '';
	if(Memory.idleThresholdTicks == undefined) Memory.idleThresholdTicks = 15;
	if(Memory.reusePath == undefined) Memory.reusePath = 10;
	
	// Clear memory
	for (let name in Memory.creeps) {
		if (Game.creeps[name]) continue;
		f.debug('Creep died ' + name + ' (' + Memory.creeps[name].room + ')');
		delete Memory.creeps[name];
	}
	
	// Build creeps
	if(f.thisTick(10)) buildCreeps();
	
	// Run creep roles
	for (let creepName in Game.creeps) {
		let creep = Game.creeps[creepName];
		if (creep.spawning) continue;
		// Switch room or do role
		if(!creep.switchRoom()) {
			role[creep.memory.role](creep);
		}
	}
	
	// Tower
	tower();

	// Link
	link();
    
}
