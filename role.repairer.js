var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Room switch
	if(creep.memory.target && creep.memory.target != creep.room.name) {
		return creep.goTo(Game.rooms[creep.memory.target].controller);
	}
	
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
				(
					s.structureType == STRUCTURE_ROAD
					|| s.structureType == STRUCTURE_CONTAINER
				)
				&& s.hits < s.hitsMax
		});
		if(structure) {
			creep.goRepair(structure);
		}
		
		else {
			// Repair Rampart/Wall
			let targets = creep.room.find(FIND_STRUCTURES, {
				filter: s =>
					(
						s.structureType == STRUCTURE_WALL
						|| s.structureType == STRUCTURE_RAMPART
					)
					&& s.hits < s.hitsMax
			});
			let target = _.sortBy(targets, 'hits')[0];
			if (target) {
				creep.goRepair(target);
			}
			
			// Idle
			else creep.goIdle();
		}
	}
	
	// Load
	else creep.goGetEnergy();
}