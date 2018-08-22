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
		
		// Supply spawn/extensions
		let spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
			filter: s => (
				s.structureType == STRUCTURE_SPAWN
				|| s.structureType == STRUCTURE_EXTENSION
			) && s.energy < s.energyCapacity
		});
		if(spawn) {
			let r = creep.transfer(spawn, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(spawn);
			else if (r) f.error('creep.transfer '+r);
			return;
		}

		// Supply tower
		let tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
			filter: s => (
				s.structureType == STRUCTURE_TOWER
			) && s.energy < s.energyCapacity
		});
		if(tower) {
			let r = creep.transfer(tower, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(tower);
			else if (r) f.error('creep.transfer '+r);
			return;
		}
		
		// Load if not full or goIdle
		if(!creep.isFull()) {
			creep.memory.transport = false;
			creep.goGetEnergy();
		}
		else creep.goIdle();
	}
	
	// Load
	else creep.goGetEnergy();
}