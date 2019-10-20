module.exports = function () {
    
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        if (spawn.spawning) continue;
        if (spawn.room.energyAvailable < 250) continue;
        
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
        let upgradersNeeded = spawn.room.controller.level;
        if (spawn.room.controller.level == 8) upgradersNeeded = 1;
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

    }
    
};
