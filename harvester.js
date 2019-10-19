module.exports = function () {

    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];

        spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'harvester'
        }).forEach(function(h){
            run(h);
        })
    }
};

function run(harvester) {
    
    // Check if empty/full
    if(!harvester.memory.harvest && harvester.isEmpty()) {
        harvester.memory.harvest = true;
    }
    if(harvester.memory.harvest && harvester.isFull()) {
        harvester.memory.harvest = false;
    }
    
    // Harvest
    if (harvester.memory.harvest) {
        const source = harvester.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(harvester.harvest(source) == ERR_NOT_IN_RANGE) harvester.goTo(source);
    }
    
    // Deliver
    else {
        
        // Spawn
        const spawn = harvester.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity
        }); 
        if (spawn) if(harvester.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) harvester.goTo(spawn);
        
    }

}