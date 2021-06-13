module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        const creeps = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'harvester'
        });
        for (const i in creeps) run(creeps[i]);
    }
};

function run(creep) {
    
    // Check if empty/full
    if(!creep.memory.harvest && creep.isEmpty()) {
        creep.memory.harvest = true;
    }
    if(creep.memory.harvest && creep.isFull()) {
        creep.memory.harvest = false;
    }
    
    // Harvest
    if (creep.memory.harvest) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) creep.goTo(source);
    }
    
    // Deliver
    else {
        
        // Spawn/Extension
        if(!creep.room.countCreeps("transporter")) {
            const storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
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

        // Container/Storage/Link
        else {
            const storage2 = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => 
                    s.structureType.isInList(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK)
                    && s.store.getFreeCapacity(RESOURCE_ENERGY)
            });
            if (storage2) {
                const r = creep.transfer(storage2, RESOURCE_ENERGY);
                if (r == ERR_NOT_IN_RANGE) creep.goTo(storage2);
                return;
            }

            // Drop
            else {
                creep.drop(RESOURCE_ENERGY);
            }

        }

    }

}
