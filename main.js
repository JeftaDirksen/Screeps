// Load prototypes
require('creep.prototype');

// Load modules
const c = require('config');
const f = require('functions');
const buildCreeps = require('buildCreeps');
const tower = require('tower');
const link = require('link');
const CpuMeter = require('CpuMeter');

// Load roles
var role = [];
for(let roleName in c.creep.role) {
	role[roleName] = require('role.'+roleName);
}

module.exports.loop = function () {
	const meterMain = new CpuMeter('main');
	meterMain.start();
	
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
	const meterCreepRoles = new CpuMeter('creepRoles');
	meterCreepRoles.start();
	for (let creepName in Game.creeps) {
		let creep = Game.creeps[creepName];
		if (creep.spawning) continue;
		// Switch room or do role
		if(!creep.switchRoom()) {
			role[creep.memory.role](creep);
		}
	}
	meterCreepRoles.stop();
	f.cpu('meterCreepRoles: '+meterCreepRoles.getAverage());
	
	// Tower
	tower();

	// Link
	link();

	meterMain.stop();
	f.cpu('main: '+meterMain.getAverage(1));
	
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
