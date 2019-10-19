module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        const creeps = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'manager'
        });
        for (const i in creeps) run(creeps[i]);
    }
};

function run(creep) {
    
    // Energy to spawn
    const spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity
    });
    if (spawn) {
        if (creep.isEmpty()) {
            const energySource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && (s.energy || (s.store && s.store.energy) )
            });
            if (energySource) {
                if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(energySource);
                return;
            }
        }
        else if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(spawn);
    }
    
    
}
