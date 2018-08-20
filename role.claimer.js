var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	if(!creep.memory.target) return;
	let r = creep.claimController(creep.room.controller);
	if(r == ERR_NOT_IN_RANGE) creep.goTo(creep.room.controller);
	else if(!r || r == ERR_INVALID_TARGET) creep.memory.target = null;
	else f.debug('creep.claimController '+r);
}