// Load prototypes
require('creep.prototype');

module.exports.loop = function () {

    // CPU Bucket check
    if(Game.cpu.bucket < 100) {
        f.warning('Skipping tick due to low CPU bucket');
        return;
    }
    
    // Clear memory
    for (const name in Memory.creeps) {
        if (Game.creeps[name]) continue;
        console.log("Creep died " + name);
        delete Memory.creeps[name];
    }

    require("spawn")();
    require('harvester')();
    require('builder')();

}
