module.exports = function () {
    
    // Iterate spawns
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        // Setup spawn memory
        if (spawn.memory.harvesters == undefined) spawn.memory.harvesters = null;
        if (spawn.memory.upgraders == undefined) spawn.memory.upgraders = null;

        // Skip spawning
        if (spawn.spawning) continue;
        if (spawn.room.energyAvailable < 250) continue;
        
        // Manager
        const storages = spawn.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_LINK
        }).length;
        if (storages && spawn.room.countCreeps("manager") < 1) {
            const type = 'manager';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }        

        // Harvester
        let harvestersNeeded = spawn.memory.harvesters || 4;
        if (spawn.room.countCreeps("harvester") < harvestersNeeded) {
            const type = 'harvester';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }
        
        // Upgrader
        let upgradersNeeded = spawn.memory.upgraders || Math.min(spawn.room.controller.level, harvestersNeeded-1);
        if (spawn.room.controller.level == 8) upgradersNeeded = 1;
        else if (upgradersNeeded > 1) {
            const sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length
            if (sites) upgradersNeeded = 1;
        }
        if (spawn.room.countCreeps("upgrader") < upgradersNeeded) {
            const type = 'upgrader';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }
        
        // Builder
        const sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length
        if (sites && spawn.room.countCreeps("builder") < 2) {
            const type = 'builder';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE, MOVE];
            if(spawn.spawnCreep(body, name, {
                memory: {type: type}
            }) == OK) return;
        }

    }
    
};
