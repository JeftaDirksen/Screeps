module.exports = function () {
    
    // Spawn creeps
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        if (spawn.spawning) continue;
        
        // Spawn Harvester
        if (spawn.room.countCreeps("harvester") < 3) {
            const type = 'harvester';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }
        
        // Spawn Builder
        if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length) {
            if (spawn.room.countCreeps("builder") < 2) {
                const type = 'builder';
                const name = spawn.generateCreepName(type);
                const body = [WORK, CARRY, MOVE, MOVE];
                if(spawn.spawnCreep(body, name, {
                    memory: {type: type}
                }) == OK) return;
            }
        }
        
    }
    
};
