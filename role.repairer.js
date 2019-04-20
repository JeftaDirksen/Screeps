var c = require('config');
var f = require('functions');

module.exports = function (creep) {
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
		let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: s =>
				s.structureType != STRUCTURE_WALL
				&& s.structureType != STRUCTURE_RAMPART
				&& s.hits < s.hitsMax
		});
		if(structure) {
            let r = creep.repair(structure);
            if (r == ERR_NOT_IN_RANGE) creep.goTo(structure);
            return;
		}
		
		// Get all not full health Rampart/Wall
		let structures = creep.room.find(FIND_STRUCTURES, {
			filter: s =>
				(
					s.structureType == STRUCTURE_WALL
					|| s.structureType == STRUCTURE_RAMPART
				)
				&& s.hits < s.hitsMax
		});
		if(!structures) {
			creep.goIdle();
			return;
		}
		
		// Repair in hitpoint steps
		let stepSize = 1000;
		for(let h = stepSize; h <= 300000000; h += stepSize) {
			let thisStepStructures = _.filter(structures, function(s) {
				return s.hits < h;
			});
			if(thisStepStructures.length) {
				
				// Rampart
				let rampart = creep.pos.findClosestByPath(thisStepStructures, {
					filter: {structureType: STRUCTURE_RAMPART}
				});
				if(rampart) {
                    let r = creep.repair(rampart);
                    if (r == ERR_NOT_IN_RANGE) creep.goTo(rampart);
					return;
				}
				
				// Other
				let other = creep.pos.findClosestByPath(thisStepStructures);
				if(other) {
                    let r = creep.repair(other);
                    if (r == ERR_NOT_IN_RANGE) creep.goTo(other);
					return;
				}
				
				break;
			}
		}

		// Idle
		creep.goIdle();
		
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
            let structure = creep.pos.findClosestByRange(structures);
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
                let energyDrop = creep.pos.findClosestByRange(energyDrops);
                let r = creep.pickup(energyDrop);
                if(r == ERR_NOT_IN_RANGE) creep.goTo(energyDrop);
                return r;
            }
            else {
                creep.memory.build = true;
                creep.goIdle();
            }
        }
    }
}