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
    
    // Link energy
	const receiver = creep.room.find(FIND_MY_SPAWNS)[0].pos.findClosestByRange(FIND_MY_STRUCTURES, {
		filter: s => s.structureType == STRUCTURE_LINK
	});
	if (receiver && receiver.store[RESOURCE_ENERGY] && creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
	    creep.say("Link");
	    const r = creep.withdraw(receiver, RESOURCE_ENERGY);
	    if (r == ERR_NOT_IN_RANGE) creep.goTo(receiver);
	    return;
	}

    // Energy to spawn
    const spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_SPAWN && s.store.getFreeCapacity(RESOURCE_ENERGY)
    });
    if (spawn) {
        if (creep.isEmpty()) {
            creep.say("Energy");
            const energySource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => [STRUCTURE_CONTAINER, STRUCTURE_STORAGE].indexOf(s.structureType) >= 0 && s.store[RESOURCE_ENERGY]
            });
            if (energySource) {
                if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(energySource);
                return;
            }
        }
        else {
            creep.say("Spawn");
            if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(spawn);
            return;
        }
    }
    
    // Energy to tower
    const tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_TOWER && s.store.getFreeCapacity(RESOURCE_ENERGY)
    });
    if (tower) {
        if (creep.isEmpty()) {
            creep.say("Energy");
            const energySource = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && (s.energy || (s.store && s.store.energy) )
            });
            if (energySource) {
                if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(energySource);
                return;
            }
        }
        else {
            creep.say("Tower");
            if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.goTo(tower);
            return;
        }
    }    
    
    // Energy to storage
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (
                s.structureType == STRUCTURE_CONTAINER
                || s.structureType == STRUCTURE_STORAGE
            )
            && s.store.getFreeCapacity(RESOURCE_ENERGY)
        });
        if (storage) {
            creep.say("Store");
            const r = creep.transfer(storage, RESOURCE_ENERGY);
            console.log(r);
            if (r == ERR_NOT_IN_RANGE) creep.goTo(storage);
            return;
        }
    }

}
