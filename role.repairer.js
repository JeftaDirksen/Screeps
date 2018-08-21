var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Check if empty
	if(creep.memory.repair && creep.isEmpty()) {
		creep.memory.repair = false;
	}
	// Check if full
	if(!creep.memory.repair && creep.isFull()) {
		creep.memory.repair = true;
	}
	
	// Repair
	if(creep.memory.repair) {
		
		// Road/Container
		let structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: s =>
				s.structureType != STRUCTURE_WALL
				&& s.structureType != STRUCTURE_RAMPART
				&& s.hits < s.hitsMax
		});
		if(structure) {
			creep.goRepair(structure);
		}
		
		else {
			// Repair Rampart/Wall
			let structures = creep.room.find(FIND_STRUCTURES, {
				filter: s =>
					(
						s.structureType == STRUCTURE_WALL
						|| s.structureType == STRUCTURE_RAMPART
					)
					&& s.hits < s.hitsMax
			});
			let structure = _.sortBy(structures, 'hits')[0];
			if (structure) {
				creep.goRepair(structure);
			}
			
			// Idle
			else creep.goIdle();
		}
	}
	
	// Load
	else creep.goGetEnergy();
}