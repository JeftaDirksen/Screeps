module.exports = function () {
    
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        if (spawn.spawning) continue;
        
        // Harvester
        if (spawn.room.countCreeps("harvester") < 4) {
            const type = 'harvester';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }
        
        // Upgrader
        if (spawn.room.countCreeps("upgrader") < 1) {
            const type = 'upgrader';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }
        
        // Builder
        if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length) {
            if (spawn.room.countCreeps("builder") < 1) {
                const type = 'builder';
                const name = spawn.generateCreepName(type);
                const body = [WORK, CARRY, MOVE, MOVE];
                if(spawn.spawnCreep(body, name, {
                    memory: {type: type}
                }) == OK) return;
            }
        }
        
        // Manager
        if (spawn.room.countCreeps("manager") < 1) {
            const type = 'manager';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }        
        
        
    }
    
};
