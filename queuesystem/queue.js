module.exports = function () {
    
    // Create queues
    for(const roomName in Game.rooms) {
        if(!Memory.queue) Memory.queue = {};
        if(!Memory.queue[roomName]) Memory.queue[roomName] = {};
    }

    for (const queue in Memory.queue) {
        let room = Game.rooms[queue];
        console.log('Queue: ' + queue + ', Room: ' + room.name);
        
        
        // Empty harvester spots
        let sources = room.find(FIND_SOURCES_ACTIVE);
        console.log('Active sources: '+sources.length);
        for (const id in sources) {
            const source = sources[id];
            console.log('Source: ' + source.id + ', X: ' + source.pos.x + ', Y: ' + source.pos.y);
            for(let y = -1; y <= 1; y++) {
                for(let x = -1; x <= 1; x++) {
                    let check = new RoomPosition(source.pos.x + x, source.pos.y + y, source.pos.roomName);
                    console.log(freeSpot(check));
                }
            }
        }
    }
    
};

function freeSpot(spot) {
    const look = spot.look();
    let count = 0;
    look.forEach(function(lookObject) {
        if(lookObject.type == LOOK_CREEPS or lookObject.type == LOOK_STRUCTURES) count++;
    });
    return count;
}
