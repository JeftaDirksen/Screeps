var c = require('config');
var f = require('functions');

module.exports = function (creep) {
    // Collect when empty
    if(!creep.memory.collect && creep.isEmpty()) {
        creep.memory.collect = true;
    }
    // Dump when full
    if(creep.memory.collect && creep.isFull()) {
        creep.memory.collect = false;
    }

    // Collect
    if(creep.memory.collect) {
        
        // Get dropped energy
        let dropped = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: e => e.resourceType == RESOURCE_ENERGY
        });

        // Get tombstone energy
        let tombstone = creep.room.find(FIND_TOMBSTONES, {
            filter: t => t.store.energy
        });

        // Combine/Get closest
        let energy = dropped.concat(tombstone);
        let closestEnergy = creep.pos.findClosestByPath(energy);
        if(closestEnergy) {
            let r = creep.pickup(closestEnergy);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(closestEnergy);
            return r;
        }

        creep.memory.collect = false;
        
        // goIdle
        creep.goIdle();
    }

    // Dump
    else {
        
        // Find container/link
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (
                s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_LINK
            )
            && (
                _.sum(s.store) < s.storeCapacity
                || s.energy < s.energyCapacity
            )
        });
        
        if(!target) {
            // Find other (spawn/extensions/storage)
            target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s => (
                    s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION
                    || s.structureType == STRUCTURE_STORAGE
                    ) && (
                        s.energy < s.energyCapacity
                        || _.sum(s.store) < s.storeCapacity
                    )
            });		
        }
        
        if(target) {
            let r = creep.transfer(target, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(target);
            else if (r) f.error('creep.transfer '+r);
            return;
        }
        
        creep.memory.collect = true;
        
        // goIdle
        creep.goIdle();
    }
}