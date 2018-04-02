var f = require('functions');
var jq = require('jobQueue');

module.exports = {

    run: function (creep) {
        let job = Memory.jobQueue[creep.memory.job];

        // Fix invalid job
        if(!job) {
            delete creep.memory.job;
            f.debug('Job not found, removed job from creep '+creep.name);
            return;
        }

        switch (job.type) {

            case 'transfer':
                // Task switcher
                if ( creep.memory.reload && creep.isFull() ) {
                    creep.memory.reload = false;
                }
                else if ( !creep.memory.reload && !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                }

                // Reload
                if (creep.memory.reload) {
                    if (job.resourceType == RESOURCE_ENERGY) {
                        let target = Game.getObjectById(job.target);
                        if (target.structureType == STRUCTURE_LINK) {
                            creep.goGetEnergy(false);
                        }
                        else creep.goGetEnergy();
                    }
                }

                // Transfer
                else {
                    let structure = Game.getObjectById(job.target);
                    let r = creep.goTransfer(structure, job.resourceType);
                    if (r == ERR_FULL) jq.removeJob(job.id);
                    if (r == ERR_INVALID_TARGET) jq.removeJob(job.id);
                }
            break;

            case 'upgrade':
                // Task switcher
                if ( creep.memory.reload && creep.isFull() ) {
                    creep.memory.reload = false;
                }
                else if ( !creep.memory.reload && !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                    jq.unassignJob(job.id);
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
                else if ( !creep.memory.reload && !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                    jq.unassignJob(job.id);
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
                else if ( !creep.memory.reload && !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                }

                // Reload
                if (creep.memory.reload) {
                    if (job.resourceType == RESOURCE_ENERGY) {
                        creep.goHarvest();
                    }
                }

                // Transfer
                else {
                    let structure = Game.getObjectById(job.target);
                    let r = creep.goTransfer(structure, job.resourceType);
                    if (r == ERR_FULL) jq.removeJob(job.id);
                    if (r == ERR_INVALID_TARGET) jq.removeJob(job.id);
                }
            break;

            case 'repair':
                // Task switcher
                if ( creep.memory.reload && creep.isFull() ) {
                    creep.memory.reload = false;
                }
                else if ( !creep.memory.reload && !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
                }

                // Reload
                if (creep.memory.reload) {
                    if (job.resourceType == RESOURCE_ENERGY) {
                        creep.goGetEnergy();
                    }
                }

                // Repair
                else {
                    let target = Game.getObjectById(job.target);
                    if(target.hits == target.hitsMax) jq.removeJob(job.id);
                    let r = creep.goRepair(target);
                    if (r == ERR_INVALID_TARGET) jq.removeJob(job.id);
                }
            break;

            default:
                f.debug('Unknown job type '+job.type);
                jq.removeJob(job.id);
        }


    },

}
