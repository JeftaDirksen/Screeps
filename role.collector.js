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
            filter: e => (
                e.resourceType == RESOURCE_ENERGY
                && e.amount >= 50
            )
        });
        dropped = creep.pos.findClosestByPath(dropped);
        if(dropped) {
            let r = creep.pickup(dropped);
            if(r == ERR_NOT_IN_RANGE) {
                creep.goTo(dropped);
            }
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