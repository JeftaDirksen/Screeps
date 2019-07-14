var c = require('config');
var f = require('functions');

// getFreeCapacity
Creep.prototype.getFreeCapacity = function() {
    return this.carryCapacity - _.sum(this.carry);
}

// goIdle
Creep.prototype.goIdle = function() {
    // Reset ticksIdle if not idle last tick
    if(this.memory.lastIdleTick != Game.time-1) this.memory.ticksIdle = 0;
    // Increase ticks idle
    this.memory.ticksIdle++;
    // Set last idle tick
    this.memory.lastIdleTick = Game.time;
    // Go to idle point if ticks idle above threshold
    if(this.memory.ticksIdle >= Memory.idleThresholdTicks)
        this.goToIdlePoint();
}

// goTo
Creep.prototype.goTo = function(target, maxRooms = 1) {
    let r = this.moveTo(target,{
        visualizePathStyle: {},
        reusePath: Memory.reusePath,
        maxRooms: maxRooms,
    });
    switch(r) {
        case OK:
            break;
        case ERR_TIRED:
            this.say('.');
            break;
        case ERR_NO_PATH:
            this.say('?');
            break;
        case ERR_INVALID_TARGET:
            this.say('??');
            break;
        default:
            this.say(r);
    }
    return r;
}

// goToIdlePoint
Creep.prototype.goToIdlePoint = function() {
    let roomIdleFlag = _.filter(Game.flags, {room: this.room, name: 'Idle'});
    if(roomIdleFlag) {
        this.goTo(roomIdleFlag);
    }
    else {
        this.goTo(this.room.controller);
    }
}

// isEmpty
Creep.prototype.isEmpty = function() {
    return !_.sum(this.carry);
}

// isFull
Creep.prototype.isFull = function() {
    return _.sum(this.carry) == this.carryCapacity;
}

// switchRoom
Creep.prototype.switchRoom = function() {
    let roomName = this.memory.room;
    if(roomName != this.room.name) {
        // Room visible
        let room = Game.rooms[roomName];
        if(room) {
            this.goTo(room.controller, 16);
            return true;
        }
        // Room not visible yet
        else {
            let exit = this.pos.findClosestByPath(
                this.room.findExitTo(roomName)
            );
            this.goTo(exit);
            return true;
        }
    }
    
    return false;
}
