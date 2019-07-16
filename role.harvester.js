/*
    Harvesters should:
    - Harvest to full
    - Unload at spawn when there is no supplier
    - Unload at extensions when there is no supplier
    - Unload at closest not full energy storage (container/link/storage)
*/

var c = require('config');
var f = require('functions');


module.exports = function (creep) {
    // Check if empty
    if(!creep.memory.harvest && creep.isEmpty()) {
        creep.memory.harvest = true;
        creep.memory.jobTarget = null;
    }
    // Check if full
    if(creep.memory.harvest && creep.isFull()) {
        creep.memory.harvest = false;
        creep.memory.jobTarget = null;
    }

    // Harvest
    if(creep.memory.harvest) {
        // Set jobTarget
        let jobTarget;
        if(creep.memory.jobTarget) {
            jobTarget = Game.getObjectById(creep.memory.jobTarget);
        }
        else {
            jobTarget = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(jobTarget) creep.memory.jobTarget = jobTarget.id;
        }

        if(jobTarget) {
            let r = creep.harvest(jobTarget);
            if (r == ERR_NOT_IN_RANGE) {
                let r = creep.goTo(jobTarget);
                if(r != OK) creep.memory.jobTarget = null;
            }
            else if(r != OK) creep.memory.jobTarget = null;
        }
        else creep.goIdle();
    }

    // Unload
    else {
        // Set jobTarget
        let jobTarget;
        if(creep.memory.jobTarget) {
            jobTarget = Game.getObjectById(creep.memory.jobTarget);
        }
        else {
            const nrOfSuppliers = creep.room.find(FIND_MY_CREEPS, {
                filter: { memory: {role: 'supplier'} }
            }).length;
            
            if(nrOfSuppliers == 0) {
                // Find spawn
                jobTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: s => (
                        s.structureType == STRUCTURE_SPAWN
                        ) && (
                            s.energy < s.energyCapacity
                        )
                });            
    
                if(!jobTarget) {
                    // Find extensions
                    jobTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: s => (
                            s.structureType == STRUCTURE_EXTENSION
                            ) && (
                                s.energy < s.energyCapacity
                            )
                    });
                }
            }

            if(!jobTarget) {
                // Find container/link/storage
                jobTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (
                        s.structureType == STRUCTURE_CONTAINER
                        || s.structureType == STRUCTURE_LINK
                        || s.structureType == STRUCTURE_STORAGE
                    )
                    && (
                        _.sum(s.store) < s.storeCapacity
                        || s.energy < s.energyCapacity
                    )
                });
            }

            if(jobTarget) creep.memory.jobTarget = jobTarget.id;
        }

        if(jobTarget) {
            let r = creep.transfer(jobTarget, RESOURCE_ENERGY);
            if(r == ERR_NOT_IN_RANGE) creep.goTo(jobTarget);
            else if(r != OK) creep.memory.jobTarget = null;
        }
        else {
            // Drop
            creep.drop(RESOURCE_ENERGY);
        }
    }
}