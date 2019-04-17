var c = require('config');
var f = require('functions');

module.exports = function (creep) {
    // Check if empty
    if(creep.memory.transport && creep.isEmpty()) {
        creep.memory.transport = false;
    }
    // Check if full
    if(!creep.memory.transport && creep.isFull()) {
        creep.memory.transport = true;
    }

    // Transport
    if(creep.memory.transport) {
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
        if(target) {
            let r = creep.transfer(target, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(target);
            else if (r) f.error('creep.transfer '+r);
            return;
        }
        
        // goIdle
        creep.goIdle();
    }

    // Load
    else {
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

        // goIdle
        creep.goIdle();
    }
}