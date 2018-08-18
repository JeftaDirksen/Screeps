var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Check if empty
	if(!creep.memory.harvest && creep.isEmpty()) {
		creep.memory.harvest = true;
	}
	// Check if full
	if(creep.memory.harvest && creep.isFull()) {
		creep.memory.harvest = false;
	}
	
	// Harvest
	if(creep.memory.harvest) {
		let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
		if(source) creep.goHarvest();
		else creep.goIdle();
	}
	// Unload
	else {
		let target = null;
		
		// Find container
		if(!target) {
			let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: s => s.structureType == STRUCTURE_CONTAINER
					&& _.sum(s.store) < s.storeCapacity
			});
			if(container) target = container;
		}
		
		// Find other (spawn/extensions/storage)
		if(!target) {
			let other = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
				filter: s => (
					s.structureType == STRUCTURE_SPAWN
					|| s.structureType == STRUCTURE_EXTENSION
					|| s.structureType == STRUCTURE_STORAGE
					) && s.energy < s.energyCapacity
			});		
			if(other) target = other;
		}
		
		// Unload at target
		if(target) {
			if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.goTo(target);
			}
		}
		
		// Drop
		else creep.drop(RESOURCE_ENERGY);
	}
}