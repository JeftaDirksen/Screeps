var c = require('config');
var f = require('functions');

module.exports = function (creep) {
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
		let site = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
		if(site) {
            let r = creep.build(site);
            if (r == ERR_NOT_IN_RANGE) creep.goTo(site);
            return r;
        }
		else creep.goIdle();
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
    }
}