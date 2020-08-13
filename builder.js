module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        const creeps = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'builder'
        });
        for (const i in creeps) run(creeps[i]);
    }
};

function run(creep) {
 
    // Check if empty/full
    if(creep.memory.build && creep.isEmpty()) {
        creep.memory.build = false;
    }
    if(!creep.memory.build && creep.isFull()) {
        creep.memory.build = true;
    }
    
    // Repair / Build
    if (creep.memory.build) {
		const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: s =>
				s.structureType.isInList(STRUCTURE_ROAD, STRUCTURE_CONTAINER)
				&& s.hits < s.hitsMax
		});        
        if(structure) {
            if (creep.repair(structure) == ERR_NOT_IN_RANGE) creep.goTo(structure);
            return;
        }

        const site = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
        if(site) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) creep.goTo(site);
        }
        else {
            creep.idle();
        }
    }
    
    // Get energy
    else if(!creep.getEnergy()) {
        if(creep.store[RESOURCE_ENERGY]) creep.memory.build = true;
        creep.idle();
    }

}
