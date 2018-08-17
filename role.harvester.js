var c = require('config');
var f = require('functions');

module.exports = function (creep) {
	if(!creep.memory.harvest && !_.sum(creep.carry)) {
		creep.memory.harvest = true;
		creep.say('> harvest');
	}
	
	if(creep.memory.harvest && _.sum(creep.carry) == creep.carryCapacity) {
		creep.memory.harvest = false;
		creep.say('> unload');
	}
	
	if(creep.harvest) {
		
	}
	else {
		
	}
	
	
}