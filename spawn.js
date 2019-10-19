module.exports = function () {
    
    // Spawn creeps
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        if (spawn.spawning) continue;
        
        // Spawn Harvester
        if (countCreeps(spawn.room, "harvester") < 2) {
            const type = 'harvester';
            const name = generateName(type);
            const body = [WORK, CARRY, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }
        
        // Spawn Builder
        if (spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length) {
            if (countCreeps(spawn.room, "builder") < 2) {
                const type = 'builder';
                const name = generateName(type);
                const body = [WORK, CARRY, MOVE, MOVE];
                if(spawn.spawnCreep(body, name, {
                    memory: {type: type}
                }) == OK) return;
            }
        }
        
    }
    
};

function generateName(type) {
    const t = type.charAt(0).toUpperCase();
    for(let i = 1; i<=100; i++) {
        const name = t + i;
        if(!Game.creeps[name]) {
            return name;
        }
    }
}

function countCreeps(room, type) {
    return room.find(FIND_MY_CREEPS, {
        filter: c => c.memory.type == type
    }).length;
}
