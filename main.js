// Load prototypes
require('creep.prototype');
require('spawn.prototype');
require('room.prototype');

module.exports.loop = function () {

    // CPU Bucket check
    if(Game.cpu.bucket < 100) {
        console.log("Skipping tick due to low CPU bucket");
        return;
    }
    
    // Clear memory
    for (const name in Memory.creeps) {
        if (Game.creeps[name]) continue;
        delete Memory.creeps[name];
    }

    require('harvester')();
    require('manager')();
    require("spawn")();
    require('upgrader')();
    require('builder')();
    require('tower')();
    require('link')();

}
