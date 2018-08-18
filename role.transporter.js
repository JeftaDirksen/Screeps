var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Check if empty
	if(creep.memory.transport && creep.isEmpty()) {
		creep.memory.transport = false;
	}
	// Check if full
	if(!creep.memory.transport && creep.isFull()) {
		creep.memory.transport = true;
	}
	
	// Transport
	if(creep.memory.transport) {
		let target = null;
		
		// Supply spawn/extensions
		target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES,{
			filter: s => (
				s.structureType == STRUCTURE_SPAWN
				|| s.structureType == STRUCTURE_EXTENSION
			) && s.energy < s.energyCapacity
		});
		
		if(target) {
			let r = creep.transfer(target, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(target);
			else if (r) f.error('creep.transfer '+r);
		}
		else creep.goIdle();
	}
	
	// Load
	else creep.goGetEnergy();
}