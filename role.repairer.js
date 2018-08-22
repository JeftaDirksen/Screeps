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
		let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: s =>
				s.structureType != STRUCTURE_WALL
				&& s.structureType != STRUCTURE_RAMPART
				&& s.hits < s.hitsMax
		});
		if(structure) {
			creep.goRepair(structure);
			return;
		}
		
		// Get all not full health Rampart/Wall
		let structures = creep.room.find(FIND_STRUCTURES, {
			filter: s =>
				(
					s.structureType == STRUCTURE_WALL
					|| s.structureType == STRUCTURE_RAMPART
				)
				&& s.hits < s.hitsMax
		});
		if(!structures) {
			creep.goIdle();
			return;
		}
		
		// Repair in hitpoint steps
		let stepSize = 1000;
		for(let h = stepSize; h <= 300000000; h += stepSize) {
			let thisStepStructures = _.filter(structures, function(s) {
				return s.hits < h;
			});
			if(thisStepStructures.length) {
				
				// Rampart
				let rampart = creep.pos.findClosestByPath(thisStepStructures, {
					filter: {structureType: STRUCTURE_RAMPART}
				});
				if(rampart) {
					creep.goRepair(rampart);
					return;
				}
				
				// Other
				let other = creep.pos.findClosestByPath(thisStepStructures);
				if(other) {
					creep.goRepair(other);
					return;
				}
				
				break;
			}
		}

		// Idle
		creep.goIdle();
		
	}
	
	// Load
	else creep.goGetEnergy();
}