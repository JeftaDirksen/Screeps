var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Check if empty
	if(creep.memory.build && !_.sum(creep.carry)) {
		creep.memory.build = false;
	}
	// Check if full
	if(!creep.memory.build && _.sum(creep.carry) == creep.carryCapacity) {
		creep.memory.build = true;
	}
	
	// Build
	if(creep.memory.build) {
		let site = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
		if(site) {
			let r = creep.build(site);
			if(r == ERR_NOT_IN_RANGE) creep.moveTo(site);
			else if (r) f.error('creep.build '+r);
		}
	}
	
	// Load
	else {
		// Find energy
		let energy = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: s => (
				s.structureType == STRUCTURE_CONTAINER
				|| s.structureType == STRUCTURE_STORAGE
				|| s.structureType == STRUCTURE_LINK
			)
			&& (
				(s.store && s.store.energy >= creep.carryCapacity)
				|| s.energy >= creep.carryCapacity
			)
		});
		
		// Get energy
		if(energy) {
			if(creep.withdraw(energy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(energy);
			}
		}
	}
}