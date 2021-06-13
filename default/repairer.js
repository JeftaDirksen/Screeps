module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        const creeps = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'repairer'
        });
        for (const i in creeps) run(creeps[i]);
    }
};

function run(creep) {
 
    // Check if empty/full
    if(creep.memory.repair && creep.isEmpty()) {
        creep.memory.repair = false;
    }
    if(!creep.memory.repair && creep.isFull()) {
        creep.memory.repair = true;
    }
    
    // Repair
    if (creep.memory.repair) {
		const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: s =>
				s.structureType.isInList(STRUCTURE_ROAD, STRUCTURE_CONTAINER)
				&& s.hits < s.hitsMax
		});        
        if(structure) {
            if (creep.repair(structure) == ERR_NOT_IN_RANGE) creep.goTo(structure);
        }
        else {
            creep.idle();
        }
    }
    
    // Get energy
    else if(!creep.getEnergy()) {
        if(creep.store[RESOURCE_ENERGY]) creep.memory.repair = true;
        creep.idle();
    }

}
