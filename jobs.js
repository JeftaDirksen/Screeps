var f = require('functions');
var jq = require('jobQueue');

module.exports = {

    run: function (creep) {
        let job = Memory.jobQueue[creep.memory.job];

        // Fix invalid job
        if(!job) {
            delete creep.memory.job;
            f.debug('jobs.run: job not found, removed job from creep '+creep.name);
            return;
        }

        switch (job.type) {

            case 'transfer':
                // Task switcher
                if ( creep.memory.reload && creep.isFull() ) {
                    creep.memory.reload = false;
                }
                else if ( !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                }

                // Reload
                if (creep.memory.reload) {
                    if (job.resourceType == RESOURCE_ENERGY) {
                        creep.goGetEnergy();
                    }
                }

                // Transfer
                else {
                    let structure = Game.getObjectById(job.target);
                    let r = creep.goTransfer(structure, job.resourceType);
                    if (r == ERR_FULL) jq.removeJob(job.id);
                }
            break;

            case 'upgradeController':
                // Task switcher
                if ( creep.memory.reload && creep.isFull() ) {
                    creep.memory.reload = false;
                }
                else if ( !creep.memory.reload && !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                    jq.removeJob(job.id);
                }

                // Reload
                if (creep.memory.reload) {
                    if (job.resourceType == RESOURCE_ENERGY) {
                        creep.goGetEnergy();
                    }
                }

                // Upgrade controller
                else {
                    creep.goUpgradeController();
                }
            break;

            case 'build':
                // Task switcher
                if ( creep.memory.reload && creep.isFull() ) {
                    creep.memory.reload = false;
                }
                else if ( !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                }

                // Reload
                if (creep.memory.reload) {
                    if (job.resourceType == RESOURCE_ENERGY) {
                        creep.goGetEnergy();
                    }
                }

                // Build
                else {
                    let r = creep.goBuild(Game.getObjectById(job.target));
                    if (r == ERR_INVALID_TARGET) jq.removeJob(job.id);
                }
            break;

            case 'harvest':
                // Task switcher
                if ( creep.memory.reload && creep.isFull() ) {
                    creep.memory.reload = false;
                }
                else if ( !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                }

                // Harvest
                if (creep.memory.reload) {
                    let target = Game.getObjectById(job.target);
                    let r = creep.goHarvestSource(target);
                    if(r == ERR_NOT_ENOUGH_RESOURCES) jq.removeJob(job.id);
                }

                // Transfer
                else {
                    let pos = creep.pos;
                    let structure = pos.findClosestByPath(FIND_STRUCTURES,{
                        filter: s => (s.structureType == STRUCTURE_LINK
                            || s.structureType == STRUCTURE_STORAGE
                            || s.structureType == STRUCTURE_CONTAINER)
                            && (s.energy < s.energyCapacity
                            || _.sum(s.store) < s.storeCapacity)
                    });
                    if(!structure) {
                        jq.removeJob(job.id);
                        break;
                    }
                    creep.goTransfer(structure, job.resourceType);
                }
            break;

            default:
                f.debug('jobs.run: Unknown job.type: '+job.type);
        }


    },

}
