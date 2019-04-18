var c = require('config');
var f = require('functions');

module.exports = function (creep) {
    
    // Claim controller
    if(!creep.room.controller.my) {
        let r = creep.claimController(creep.room.controller);
        if (r == ERR_NOT_IN_RANGE) creep.goTo(creep.room.controller);
        else if (r == ERR_INVALID_TARGET) creep.goIdle();
        else if (r == OK) f.debug(creep.name + ' claimed the controller in ' + creep.room.name + '!');
        else f.debug('creep.claimController '+r);
    }
    
    // Build spawn
    else {
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
        
        // Harvest
        else {
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
    }
    
}
