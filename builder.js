module.exports = function () {

    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];

        spawn.room.find(FIND_MY_CREEPS, {
            filter: c => c.memory.type == 'builder'
        }).forEach(function(h){
            run(h);
        })
    }
};

function run(builder) {
    
}
