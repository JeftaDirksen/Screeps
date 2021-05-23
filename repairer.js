module.exports = function () {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if(creep.memory.type == 'repairer') run(creep);
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
		const structures = creep.room.find(FIND_STRUCTURES, {
			filter: s =>
				s.structureType.isInList(STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK, STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_RAMPART)
				&& s.hits < s.hitsMax
		});
		const structure = _.sortBy(structures, 'hits')[0];
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
