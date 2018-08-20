var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Room switch
	if(f.roomSwitch(creep)) return;

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
		
		// Find container/link
		let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: s => (
				s.structureType == STRUCTURE_CONTAINER
				|| s.structureType == STRUCTURE_LINK
			)
			&& (
				_.sum(s.store) < s.storeCapacity
				|| s.energy < s.energyCapacity
			)
		});
		if(container) {
			let r = creep.transfer(container, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(container);
			return;
		}
		
		// Find other (spawn/extensions/storage)
		let other = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: s => (
				s.structureType == STRUCTURE_SPAWN
				|| s.structureType == STRUCTURE_EXTENSION
				|| s.structureType == STRUCTURE_STORAGE
				) && (
					s.energy < s.energyCapacity
					|| _.sum(s.store) < s.storeCapacity
				)
		});		
		if(other) {
			let r = creep.transfer(other, RESOURCE_ENERGY);
			if(r == ERR_NOT_IN_RANGE) creep.goTo(other);
			return;
		}
		
		// Drop
		creep.drop(RESOURCE_ENERGY);
	}
}