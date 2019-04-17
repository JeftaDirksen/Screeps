var c = require('config');
var f = require('functions');

module.exports = function (creep) {
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
