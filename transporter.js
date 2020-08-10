module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        const creeps = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'transporter'
        });
        for (const i in creeps) run(creeps[i]);
    }
};

function run(creep) {
 
    // Check if empty/full
    if(creep.memory.transport && creep.isEmpty()) {
        creep.memory.transport = false;
    }
    if(!creep.memory.transport && creep.isFull()) {
        creep.memory.transport = true;
    }
    
    // Transport
    if (creep.memory.transport) {

        // Spawn/Extension
        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => 
                s.structureType.isInList(STRUCTURE_SPAWN, STRUCTURE_EXTENSION)
                && s.store.getFreeCapacity(RESOURCE_ENERGY)
        });
        if (storage) {
            const r = creep.transfer(storage, RESOURCE_ENERGY);
            if (r == ERR_NOT_IN_RANGE) creep.goTo(storage);
            return;
        }

    }
    
    // Get energy
    else {
        if ( !creep.getEnergy() && creep.store[RESOURCE_ENERGY]) creep.memory.transport = true;
    }

}
