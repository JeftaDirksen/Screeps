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
		
		// Sign controller
		signController(creep, controller, c.sign);
		
		// Upgrade
		let r = creep.upgradeController(controller);
		if (r == ERR_NOT_IN_RANGE) creep.goTo(controller);
		else creep.goIdle();
	}
	
	// Load
	else creep.goGetEnergy();
}

function signController(creep, controller, text) {
	if((!controller.sign && text != '') || (controller.sign && controller.sign.text != text)) {
		let r = creep.signController(controller, text);
		if (r == ERR_NOT_IN_RANGE) creep.goTo(controller);
		if (!r && text) f.debug('Controller signed with \''+text+'\'');
		else if (!r && !text) f.debug('Controller unsigned');
	}
}