// Load prototypes
require('creep.prototype');

module.exports.loop = function () {

    // CPU Bucket check
    if(Game.cpu.bucket < 100) {
        f.warning('Skipping tick due to low CPU bucket');
        return;
    }
    
    // Clear memory
    for (const name in Memory.creeps) {
        if (Game.creeps[name]) continue;
        console.log("Creep died " + name);
        delete Memory.creeps[name];
    }

    // Spawn creeps
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        
        if (spawn.spawning) continue;
        
        // Spawn Harvester
        const harvesters = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.role == 'harvester'
        }).length;
        if (harvesters < 2) {
            const type = 'harvester';
            const name = generateName(type);
            const body = [WORK, CARRY, MOVE];
            spawn.spawnCreep(body, name, {
                memory: {role: type}
            });
        }

    }

    require('harvester')();
    

    
    

}

function generateName(type) {
    const t = type.charAt(0).toUpperCase();
    for(let i = 1; i<=100; i++) {
        const name = t + i;
        if(!Game.creeps[name]) {
            return name;
        }
    }
}
