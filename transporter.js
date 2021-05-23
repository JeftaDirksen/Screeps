module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if(creep.memory.type == 'transporter') run(creep);
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
        // Tower
        const towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s => 
                s.structureType == STRUCTURE_TOWER
                && s.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getCapacity(RESOURCE_ENERGY)
        });
        const tower = _.sortBy(towers, t => t.store.getUsedCapacity(RESOURCE_ENERGY))[0];
        if (storage) {
            const r = creep.transfer(storage, RESOURCE_ENERGY);
            if (r == ERR_NOT_IN_RANGE) creep.goTo(storage);
            return;
        }
        else if (tower) {
            const r = creep.transfer(tower, RESOURCE_ENERGY);
            if (r == ERR_NOT_IN_RANGE) creep.goTo(tower);
            return;            
        }
        else if(!creep.isFull()) {
            creep.memory.transport = false;
        }
        else {
            creep.idle();
        }

    }
    
    // Get energy
    else if(!creep.getEnergy()) {
        if(creep.store[RESOURCE_ENERGY]) creep.memory.transport = true;
        creep.idle();
    }

}
