/*
    Supplier should:
    - Load with any energy (not sender link)
    - Supply spawn
    - Supply extensions
    - Supply sender links
    - Supply tower
*/

var c = require('config');
var f = require('functions');

module.exports = function (creep) {
    // Check if empty
    if(creep.memory.supply && creep.isEmpty()) {
        creep.memory.supply = false;
    }
    // Check if full
    if(!creep.memory.supply && creep.isFull()) {
        creep.memory.supply = true;
    }

    // Load
    if(!creep.memory.supply) {

        // Get links
        let energies = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType == STRUCTURE_LINK
                && Memory.links[s.id].type == 'receiver'
                && s.energy
        });

        // Get energy from storage/container
        let structures = creep.room.find(FIND_STRUCTURES, {
            filter: s => (
                s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_CONTAINER
                ) && (s.energy || s.store && s.store.energy)
        });
        energies = energies.concat(structures);
        
        // Get dropped energy
        let energyDrops = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: e => e.resourceType == RESOURCE_ENERGY
        });
        energies = energies.concat(energyDrops);

        if(energies.length) {
            let closestEnergy = creep.pos.findClosestByPath(energies);
            let r = creep.withdraw(closestEnergy, RESOURCE_ENERGY);
            if(r == ERR_INVALID_TARGET) r = creep.pickup(closestEnergy);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(closestEnergy);
            else if(r) creep.say(r);
            return;
        }

    }

    // Supply
    else {
        
        // Set jobTarget
        let jobTarget;
        if(creep.memory.jobTarget) {
            jobTarget = Game.getObjectById(creep.memory.jobTarget);
        }

        
        // Supply spawn
        if (!jobTarget) {
            jobTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s =>
                    s.structureType == STRUCTURE_SPAWN
                    && s.energy < s.energyCapacity
            });
            if(jobTarget) creep.memory.jobTarget = jobTarget.id;
        }
        
        // Supply extensions
        if (!jobTarget) {
            jobTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s =>
                    s.structureType == STRUCTURE_EXTENSION
                    && s.energy < s.energyCapacity
            });
            if(jobTarget) creep.memory.jobTarget = jobTarget.id;
        }
        
        // Supply sender links
        if (!jobTarget) {
            jobTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s =>
                    s.structureType == STRUCTURE_LINK
                    && Memory.links[s.id].type == 'sender'
                    && s.energy < s.energyCapacity
            });
            if(jobTarget) creep.memory.jobTarget = jobTarget.id;
        }

        // Supply tower
        if (!jobTarget) {
            jobTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s =>
                    s.structureType == STRUCTURE_TOWER
                    && s.energy < s.energyCapacity
            });
            if(jobTarget) creep.memory.jobTarget = jobTarget.id;
        }

        // Supply jobTarget
        if(jobTarget) {
            let r = creep.transfer(jobTarget, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(jobTarget);
            else if(r != OK) creep.memory.jobTarget = null;
            return;
        }

    }

    // goIdle
    creep.goIdle();

}
