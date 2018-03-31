var f = require('functions');

module.exports = {

    run: function (creep) {
        let job = Memory.jobQueue[creep.memory.job];
        
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
                    creep.goTransfer(structure, job.resourceType);
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

            default:
                f.debug('jobs.run: Unknown job.type: '+job.type);
        }


    },

}
