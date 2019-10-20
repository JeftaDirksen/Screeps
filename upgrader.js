module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        const creeps = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'upgrader'
        });
        for (const i in creeps) run(creeps[i]);
    }
};

function run(creep) {
 
    // Check if empty/full
    if(creep.memory.upgrade && creep.isEmpty()) {
        creep.memory.upgrade = false;
    }
    if(!creep.memory.upgrade && creep.isFull()) {
        creep.memory.upgrade = true;
    }
    
    // Upgrade
    if (creep.memory.upgrade) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            creep.goTo(creep.room.controller);
    }
    
    // Get energy
    else {
        creep.getEnergy();
    }

}
