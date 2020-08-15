module.exports = function () {
    
    // Iterate spawns
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        // Setup spawn memory
        if (spawn.memory.harvesters == undefined) spawn.memory.harvesters = null;
        if (spawn.memory.upgraders == undefined) spawn.memory.upgraders = null;
        if (spawn.memory.builders == undefined) spawn.memory.builders = null;
        if (spawn.memory.transporters == undefined) spawn.memory.transporters = null;
        if (spawn.memory.repairers == undefined) spawn.memory.repairers = null;
        if (spawn.memory.attackers == undefined) spawn.memory.attackers = null;
        if (spawn.memory.attackID == undefined) spawn.memory.attackID = null;
        if (spawn.memory.squadSize == undefined) spawn.memory.squadSize = 3;

        // Skip spawning
        if (spawn.spawning) continue;
        //if (spawn.room.energyAvailable < 250) continue;
        
        // Harvester
        const harvestersNeeded = spawn.memory.harvesters || 4;
        if (spawn.room.countCreeps("harvester") < harvestersNeeded) {
            const type = 'harvester';
            const name = spawn.generateCreepName(type);
            const body = [WORK, CARRY, MOVE, MOVE];
            const r = spawn.spawnCreep(body, name, {memory: {type: type}});
            if (r == OK) return;
            else if (r == ERR_NOT_ENOUGH_ENERGY) return;
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
            let body = [WORK, CARRY, MOVE, MOVE];
            if (spawn.room.energyCapacityAvailable >= 350) body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            const r = spawn.spawnCreep(body, name, {memory: {type: type}});
            if (r == OK) return;
            else if (r == ERR_NOT_ENOUGH_ENERGY) return;
        }
        
        // Builder
        const buildersNeeded = spawn.memory.builders || 2;
        const sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES).length
        if (sites && spawn.room.countCreeps("builder") < buildersNeeded) {
            const type = 'builder';
            const name = spawn.generateCreepName(type);
            let body = [WORK, CARRY, MOVE, MOVE];
            if (spawn.room.energyCapacityAvailable >= 350) body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            const r = spawn.spawnCreep(body, name, {memory: {type: type}});
            if (r == OK) return;
            else if (r == ERR_NOT_ENOUGH_ENERGY) return;
        }

        // Transporter
        const transportersNeeded = spawn.memory.transporters || 2;
        if (spawn.room.countCreeps("transporter") < transportersNeeded) {
            const type = 'transporter';
            const name = spawn.generateCreepName(type);
            let body = [CARRY, CARRY, MOVE, MOVE];
            if (spawn.room.energyCapacityAvailable >= 350) body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            const r = spawn.spawnCreep(body, name, {memory: {type: type}});
            if (r == OK) return;
            else if (r == ERR_NOT_ENOUGH_ENERGY) return;
        }

        // Repairer
        const repairersNeeded = spawn.memory.repairers || 1;
        const repairs = spawn.room.find(FIND_STRUCTURES, {
			filter: s =>
				s.structureType.isInList(STRUCTURE_ROAD, STRUCTURE_CONTAINER)
				&& s.hits < s.hitsMax
        }).length;
        const towers = spawn.room.find(FIND_MY_STRUCTURES, {
			filter: s =>
				s.structureType == STRUCTURE_TOWER
        }).length;
        if (!towers && repairs && spawn.room.countCreeps("repairer") < repairersNeeded) {
            const type = 'repairer';
            const name = spawn.generateCreepName(type);
            let body = [WORK, CARRY, MOVE, MOVE];
            if (spawn.room.energyCapacityAvailable >= 350) body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
            const r = spawn.spawnCreep(body, name, {memory: {type: type}});
            if (r == OK) return;
            else if (r == ERR_NOT_ENOUGH_ENERGY) return;
        }

        // Attacker
        const attackersNeeded = spawn.memory.attackers || 5;
        if(spawn.memory.attackID && spawn.room.countCreeps("attackers") < attackersNeeded) {
            const type = 'attacker';
            const name = spawn.generateCreepName(type);
            let body = [ATTACK, ATTACK, MOVE, MOVE];
            if (spawn.room.energyCapacityAvailable >= 390) body = [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
            const r = spawn.spawnCreep(body, name, {memory: 
                {type: type, attackID: spawn.memory.attackID, pause: true}
            });
            if (r == OK) return;
            else if (r == ERR_NOT_ENOUGH_ENERGY) return;
        }

    }
    
};
