var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	if(!creep.memory.target) return;
	
	// Check if in room to claim
	if(creep.room.name != creep.memory.target) {
		// Move to room to claim
		let exit = creep.room.findExitTo(creep.memory.target);
		let r = creep.goTo(creep.pos.findClosestByRange(exit));
	}
	// Claim room
	else {
		let r = creep.claimController(creep.room.controller);
		if(r == ERR_NOT_IN_RANGE) creep.goTo(creep.room.controller);
		else if(!r || r == ERR_INVALID_TARGET) creep.memory.target = null;
		else f.debug('creep.claimController '+r);
	}
	
}