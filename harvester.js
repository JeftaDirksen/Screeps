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
        
        // Spawn
        const spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity
        }); 
        if (spawn) {
            if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(spawn);
            return;
        }
        
        // Container/Storage/Link
        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (
                s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_LINK
            )
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
        });
        if (storage) {
            if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(storage);
                return;
        }
        
        // Drop
        else {
            creep.drop(RESOURCE_ENERGY);
        }
        
    }

}