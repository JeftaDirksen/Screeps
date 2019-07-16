/*
    Collector should:
    - Collect from containers >75%
    - Collect dropped energy
    - Unload to closest not full, not container
*/

var c = require('config');
var f = require('functions');

module.exports = function (creep) {
    // Check if full
    if(creep.memory.collect && creep.isFull()) {
        creep.memory.collect = false;
    }
    // Check if empty
    if(!creep.memory.collect && creep.isEmpty()) {
        creep.memory.collect = true;
    }

    // Collect
    if(creep.memory.collect) {
        
        // Collect from containers >50%
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_CONTAINER
                && _.sum(s.store) > 0.5 * s.storeCapacity
        });
        if(container) {
            let r = creep.withdraw(container, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(container);
            else if(r) creep.say(r);
            return;
        }
        
        // Collect from tombstones
        const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
            filter: t => t.store.energy
        });
        if(tombstone) {
            let r = creep.withdraw(tombstone, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(tombstone);
            else if(r) creep.say(r);
            return;
        }

        // Collect dropped energy
        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: {resourceType: RESOURCE_ENERGY}
        });
        if(droppedEnergy) {
            let r = creep.pickup(droppedEnergy);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(droppedEnergy);
            else if(r) creep.say(r);
            return;
        }
        
    }

    // Unload
    else {
        
        // Unload to closest not full, container <50%
        let unloadAt = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_LINK && s.energy < s.energyCapacity
                || s.structureType == STRUCTURE_STORAGE && _.sum(s.store) < s.storeCapacity
                || s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity
                || s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity
                || s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity
        });
        if(unloadAt) {
            let r = creep.transfer(unloadAt, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(unloadAt);
            else if(r) creep.say(r);
            return;
        }

    }

    // goIdle
    creep.goIdle();

}
