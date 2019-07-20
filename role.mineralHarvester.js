/*
    Minecral harvesters should:
    - Harvest to full
    - Unload at storage
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
            jobTarget = creep.pos.findClosestByPath(FIND_MINERALS, {
                filter: m => m.hasExtractor() && m.mineralAmount
            });
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
        
        if (!jobTarget) {
            // Find storage
            jobTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s =>
                    s.structureType == STRUCTURE_STORAGE
                    && _.sum(s.store) < s.storeCapacity
            });
            if(jobTarget) creep.memory.jobTarget = jobTarget.id;
        }

        if(jobTarget) {
            let r;
            for(const resourceType in creep.carry) {
               r = creep.transfer(jobTarget, resourceType);
            }
            if(r == ERR_NOT_IN_RANGE) creep.goTo(jobTarget);
            else if(r != OK) creep.memory.jobTarget = null;
        }
    }
}

Mineral.prototype.hasExtractor = function() {
    return Boolean(
        this.pos.findInRange(FIND_MY_STRUCTURES, 0, {
            filter: {structureType: STRUCTURE_EXTRACTOR}
        }).length
    );
}