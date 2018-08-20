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
		else creep.goIdle();
	}
	
	// Load
	else creep.goGetEnergy();
}