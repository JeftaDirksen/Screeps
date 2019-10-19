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
        let structures = creep.room.find(FIND_STRUCTURES, {
            filter: s => (
                s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_LINK
            ) && (
                s.energy || (s.store && s.store.energy)
            )
        });
        if(structures.length) {
            let structure = creep.pos.findClosestByRange(structures);
            if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(structure);
        }
        
        // Get dropped energy
        else {
            let energyDrops = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: e => e.resourceType == RESOURCE_ENERGY
            });
            if(energyDrops.length) {
                let energyDrop = creep.pos.findClosestByRange(energyDrops);
                if (creep.pickup(energyDrop) == ERR_NOT_IN_RANGE) creep.goTo(energyDrop);
            }
        }
    }

}
