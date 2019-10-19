// goTo
Creep.prototype.goTo = function(target, maxRooms = 1) {
    let r = this.moveTo(target,{
        visualizePathStyle: {},
        reusePath: 5,
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

// isEmpty
Creep.prototype.isEmpty = function() {
    return !_.sum(this.carry);
}

// isFull
Creep.prototype.isFull = function() {
    return _.sum(this.carry) == this.carryCapacity;
}
