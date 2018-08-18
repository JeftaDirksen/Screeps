var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	// Check if empty
	if(creep.memory.upgrade && creep.isEmpty()) {
		creep.memory.upgrade = false;
	}
	// Check if full
	if(!creep.memory.upgrade && creep.isFull()) {
		creep.memory.upgrade = true;
	}
	
	// Upgrade
	if(creep.memory.upgrade) {
		let controller = creep.room.controller;
		let r = creep.upgradeController(controller);
		if (r == ERR_NOT_IN_RANGE) creep.goTo(controller);
		else creep.goIdle();
	}
	
	// Load
	else creep.goGetEnergy();
}