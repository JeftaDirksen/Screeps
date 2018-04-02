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
                else if ( !creep.hasResource(job.resourceType) ) {
                    creep.memory.reload = true;
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
                    creep.goBuild(Game.getObjectById(job.target));
                }
            break;

            default:
                f.debug('jobs.run: Unknown job.type: '+job.type);
        }


    },

}
