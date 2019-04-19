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
		signController(creep, controller, Memory.signText);
		
		// Upgrade
		let r = creep.upgradeController(controller);
		if (r == ERR_NOT_IN_RANGE) creep.goTo(controller);
		else if(r) creep.goIdle();
	}
	
	// Load
	else {
        // Get energy from storage/container/link (with enough energy)
        let structures = creep.room.find(FIND_STRUCTURES, {
            filter: s => (
                s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_LINK
            ) && (
                s.energy || (s.store && s.store.energy)
            )
        });
        if(structures.length) {
            let structure = creep.pos.findClosestByPath(structures);
            let r = creep.withdraw(structure, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(structure);
            return r;
        }
        
        else {
            // Get dropped energy
            let energyDrops = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: e => e.resourceType == RESOURCE_ENERGY
            });
            if(energyDrops.length) {
                let energyDrop = creep.pos.findClosestByPath(energyDrops);
                let r = creep.pickup(energyDrop);
                if(r == ERR_NOT_IN_RANGE) creep.goTo(energyDrop);
                return r;
            }
        }
        
        creep.memory.upgrade = true;
        creep.goIdle();
    }
}

function signController(creep, controller, text) {
	if((!controller.sign && text != '') || (controller.sign && controller.sign.text != text)) {
		let r = creep.signController(controller, text);
		if (r == ERR_NOT_IN_RANGE) creep.goTo(controller);
		if (!r && text) f.debug('Controller signed with \''+text+'\'');
		else if (!r && !text) f.debug('Controller unsigned');
	}
}