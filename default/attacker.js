module.exports = function () {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];

        // Unpause attackers
        const pausedCreeps = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'attacker' && c.memory.pause
        });
        if(pausedCreeps.length >= spawn.memory.squadSize) {
            for (const i in pausedCreeps) pausedCreeps[i].memory.pause = false;
        }

        const creeps = spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'attacker'
        });
        for (const i in creeps) run(creeps[i]);
    }
};

function run(creep) {
    if(creep.memory.pause) {
        creep.idle();
        return;
    }

    let target = Game.getObjectById(creep.memory.attackID);
    if(!target) {
        creep.say('t?');
        creep.idle();
    }
    else if(creep.attack(target) == ERR_NOT_IN_RANGE) creep.moveTo(target);

}
