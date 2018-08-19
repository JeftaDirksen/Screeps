var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Room switch
	if(creep.memory.target && creep.memory.target != creep.room.name) {
		return creep.goTo(Game.rooms[creep.memory.target].controller);
	}
	
	// Check if empty
	if(creep.memory.build && creep.isEmpty()) {
		creep.memory.build = false;
	}
	// Check if full
	if(!creep.memory.build && creep.isFull()) {
		creep.memory.build = true;
	}
	
	// Build
	if(creep.memory.build) {
		let site = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
		if(site) {
			creep.goBuild(site);
		}
		else creep.goIdle();
	}
	
	// Load
	else creep.goGetEnergy();
}